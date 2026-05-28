import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { computePromotion } from '@/lib/promotion';

/**
 * POST /api/students/promote
 * Manually promote one or multiple students to the next class/year.
 * Body: { student_ids: number[], remarks?: string }
 * OR: { class: string, academic_year: string, remarks?: string }  (bulk promote entire class)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_ids, class: bulkClass, academic_year: bulkYear, remarks } = body;

    let targetStudents: any[] = [];

    if (student_ids && Array.isArray(student_ids) && student_ids.length > 0) {
      const { data, error } = await supabaseAdmin()
        .from('students')
        .select()
        .in('id', student_ids)
        .eq('status', 'Active');

      if (error) throw error;
      targetStudents = data || [];
    } else if (bulkClass && bulkYear) {
      const { data, error } = await supabaseAdmin()
        .from('students')
        .select()
        .eq('current_class', bulkClass)
        .eq('academic_year', bulkYear)
        .eq('status', 'Active');

      if (error) throw error;
      targetStudents = data || [];
    } else {
      return NextResponse.json(
        { success: false, error: 'Provide either student_ids array OR class+academic_year for bulk promotion' },
        { status: 400 }
      );
    }

    if (targetStudents.length === 0) {
      return NextResponse.json({ success: false, error: 'No active students found for promotion' }, { status: 404 });
    }

    const promotionResults = [];

    for (const student of targetStudents) {
      const { nextClass, nextYear, isPassedOut } = computePromotion(
        student.current_class,
        student.academic_year
      );

      const { error: updateError } = await supabaseAdmin()
        .from('students')
        .update({
          current_class: isPassedOut ? student.current_class : nextClass,
          academic_year: nextYear,
          status: isPassedOut ? 'Passed Out' : 'Active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', student.id);

      if (updateError) throw updateError;

      const { data: promo, error: insertError } = await supabaseAdmin()
        .from('student_promotions')
        .insert({
          student_id: student.id,
          from_class: student.current_class,
          to_class: isPassedOut ? 'Passed Out' : nextClass,
          from_academic_year: student.academic_year,
          to_academic_year: nextYear,
          promotion_type: 'manual',
          remarks: remarks || (isPassedOut ? 'Passed out of school' : `Promoted to Class ${nextClass}`),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      promotionResults.push({
        student_id: student.id,
        name: student.student_name_en,
        from_class: student.current_class,
        to_class: isPassedOut ? 'Passed Out' : nextClass,
        from_year: student.academic_year,
        to_year: nextYear,
        status: isPassedOut ? 'Passed Out' : 'Active',
        promotion_id: promo.id,
      });
    }

    return NextResponse.json({
      success: true,
      promoted: promotionResults.length,
      data: promotionResults,
    });
  } catch (error) {
    console.error('POST /api/students/promote error:', error);
    return NextResponse.json({ success: false, error: 'Promotion failed' }, { status: 500 });
  }
}
