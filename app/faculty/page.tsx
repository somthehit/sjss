"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import { Sparkles, Users, Award, ShieldAlert, GraduationCap, Briefcase } from "lucide-react";

interface Teacher {
  nameEn: string;
  nameNp: string;
  designationEn: string;
  designationNp: string;
  department: "Science" | "Arts" | "Commerce" | "Admin";
  subjectEn: string;
  subjectNp: string;
  qualificationsEn: string;
  qualificationsNp: string;
  initials: string;
  photoUrl: string | null;
}

export default function Faculty() {
  const { t } = useLanguage();
  const [activeDept, setActiveDept] = useState<"All" | "Science" | "Arts" | "Commerce" | "Admin">("All");
  const [facultyData, setFacultyData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch('/api/staff');
        if (!res.ok) { setLoading(false); return; }
        const json = await res.json();
        
        if (json.success && json.data) {
          const data = json.data || [];
          // Map database fields to component interface
          const mappedData: Teacher[] = data.map((staff: any) => ({
            nameEn: staff.name_en,
            nameNp: staff.name_np,
            designationEn: staff.role_en,
            designationNp: staff.role_np,
            department: staff.department === 'administration' ? 'Admin' : staff.department === 'science' ? 'Science' : staff.department === 'arts' ? 'Arts' : 'Commerce',
            subjectEn: staff.department,
            subjectNp: staff.department,
            qualificationsEn: staff.qualification,
            qualificationsNp: staff.qualification,
            initials: staff.name_en.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 3),
            photoUrl: staff.photo_url || null,
          }));
          setFacultyData(mappedData);
        } else {
          console.error('API returned error:', json.error);
        }
      } catch (error) {
        console.error('Failed to fetch faculty:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  // Filtering list
  const filteredFaculty = facultyData.filter((t) => {
    if (activeDept === "All") return true;
    return t.department === activeDept;
  });

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full">
      {/* Page Title */}
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("GUIDES AND MENTORS", "मार्गदर्शक र संरक्षकहरू")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("Faculty & Staff", "शिक्षक तथा कर्मचारी वर्ग")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Meet the dedicated team of qualified educators steering the academic success in Punarbas.",
            "पुनर्वास क्षेत्रकै शैक्षिक उन्नयन र प्रवर्द्धनमा अनवरत खटिने योग्य एवं अनुभवी शिक्षकहरू।"
          )}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 font-sans text-xs uppercase tracking-wider font-semibold no-print">
        {["All", "Science", "Arts", "Commerce", "Admin"].map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept as any)}
            className={`px-4 py-2 border rounded cursor-pointer transition-all ${
              activeDept === dept
                ? "bg-[#1a3a2a] text-[#c9a227] border-[#c9a227] shadow"
                : "bg-white border-[#c9a227]/30 text-[#444444]/80 hover:bg-[#1a3a2a]/5 hover:text-[#1a3a2a]"
            }`}
          >
            {dept === "All"
              ? t("All Departments", "सबै विभागहरू")
              : dept === "Science"
              ? t("Science Department", "विज्ञान विभाग")
              : dept === "Arts"
              ? t("Arts / Language", "कला तथा भाषा विभाग")
              : dept === "Commerce"
              ? t("Management Stream", "व्यवस्थापन विभाग")
              : t("School Administration", "विद्यालय प्रशासन")}
          </button>
        ))}
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-[#444444]/60">
            Loading faculty data...
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[#444444]/60">
            No faculty members found.
          </div>
        ) : (
          filteredFaculty.map((teacher, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#c9a227]/30 rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden parchment-glow"
          >
            {/* Corner Department Tag */}
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#1a3a2a]/10 text-[#1a3a2a] text-[9px] font-bold uppercase rounded-bl font-sans">
              {t(teacher.department, teacher.department === "Admin" ? "प्रशासन" : teacher.department === "Science" ? "विज्ञान" : teacher.department === "Arts" ? "कला" : "लेखा")}
            </div>

            <div className="flex flex-col">
              {/* Avatar: real photo if available, otherwise monogram initials */}
              <div className="w-16 h-16 rounded-full border-2 border-[#c9a227] shadow-md mb-4 shrink-0 overflow-hidden bg-[#1a3a2a] flex items-center justify-center">
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.nameEn}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-white font-serif text-lg font-bold">{teacher.initials}</span>
                )}
              </div>

              {/* Teacher Info */}
              <h3 className="text-lg font-bold font-serif text-[#1a3a2a] leading-tight">
                {t(teacher.nameEn, teacher.nameNp)}
              </h3>
              <p className="text-xs font-semibold text-[#8b1a1a] tracking-wide uppercase font-sans mt-0.5">
                {t(teacher.designationEn, teacher.designationNp)}
              </p>

              <div className="h-[1px] bg-[#c9a227]/20 w-full my-3" />

              {/* Quals and Subjects details */}
              <div className="flex flex-col gap-2 font-sans text-xs text-[#444444]/90">
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-[#c9a227] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#1a3a2a]">{t("Qualifications:", "योग्यता:")}</span>
                    <span>{t(teacher.qualificationsEn, teacher.qualificationsNp)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-[#c9a227] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#1a3a2a]">{t("Key Area:", "शिक्षण विषय:")}</span>
                    <span>{t(teacher.subjectEn, teacher.subjectNp)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#c9a227]/10 pt-3 text-[10px] text-[#444444]/60 font-semibold tracking-wider text-right uppercase">
              {t("Verified Educator", "प्रमाणित शिक्षक")}
            </div>
          </div>
        )))}
      </div>

      <DhakaDivider />

      {/* Administration panel CTA */}
      <section className="py-6 px-4 bg-white border border-[#c9a227]/20 rounded-lg text-center parchment-glow">
        <h3 className="text-sm font-bold text-[#1a3a2a] font-serif uppercase tracking-wider mb-2">
          {t("Administrative Advisory Board", "प्रशासकीय परामर्शदात्री समिति")}
        </h3>
        <p className="text-xs text-[#444444] leading-relaxed max-w-2xl mx-auto font-sans">
          {t(
            "School policies, budgets, and infrastructural setups are governed collaboratively under the guidance of the School Management Committee (SMC) chaired by parents and local municipal leaders.",
            "विद्यालय विकास, बजेट र भौतिक पूर्वाधार निर्माणका कार्यहरू अभिभावक तथा वडा प्रतिनिधिको प्रतिनिधित्व रहेको विद्यालय व्यवस्थापन समिति (SMC) को समन्वयमा सञ्चालन गरिन्छ।"
          )}
        </p>
      </section>
    </div>
  );
}
