"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface CalendarMonth {
  id: number;
  month_name: string;
  month_index: number;
  days: string[];
}

export default function BSCalendar() {
  const [months, setMonths] = useState<CalendarMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarYear, setCalendarYear] = useState("२०८३");

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch('/api/calendar');
        if (res.ok) {
          const json = await res.json();
          setMonths(json.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    const fetchYear = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.data?.calendar_year) {
            setCalendarYear(json.data.calendar_year);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCalendar();
    fetchYear();
  }, []);

  const totalDays = 32;

  if (loading) {
    return (
      <div className="bg-[#fdf6e3] rounded-xl p-12 flex justify-center items-center shadow-md border border-[#c9a227]/40">
        <Loader2 className="w-8 h-8 text-[#1a3a2a] animate-spin" />
      </div>
    );
  }

  const extraKeywords = ['योजना', 'निर्माण', 'भर्ना', 'पिकनिक', 'वार्षिकोत्सव', 'गठन', 'तयारी', 'सरस्वती', 'अतिरिक्त'];
  const examKeywords = ['परीक्षा', 'प', 'रिजल्ट', 'नतिजा'];

  const calculateStats = (days: string[]) => {
    const stats = { study: 0, sat: 0, sun: 0, holiday: 0, exam: 0, extra: 0, total: 0 };
    for (let i = 0; i < totalDays; i++) {
      const day = days[i];
      if (!day) continue;
      stats.total++;
      if (day === 'शनि') stats.sat++;
      else if (day === 'आइत') stats.sun++;
      else if (day === '📖' || day === 'पढाइ') stats.study++;
      else if (examKeywords.some(k => day.includes(k))) stats.exam++;
      else if (extraKeywords.some(k => day.includes(k))) stats.extra++;
      else stats.holiday++;
    }
    return stats;
  };

  const grandTotals = { study: 0, sat: 0, sun: 0, holiday: 0, exam: 0, extra: 0, total: 0, open: 0 };

  return (
    <div className="bg-[#fdf6e3] text-[#444444] rounded-xl p-6 md:p-8 shadow-md border border-[#c9a227]/40 font-sans">
      
      {/* Header Section */}
      <div className="text-center mb-8 mt-2 relative z-10">
        <div className="flex justify-center mb-1">
          <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> SHREE JIVEEN SHAKTI SECONDARY SCHOOL
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a3a2a] mb-2 tracking-wide font-serif">
          श्री जीवन शक्ति <span className="text-[#c9a227]">माध्यमिक विद्यालय</span>
        </h1>
        <p className="text-[#444444] text-sm md:text-base mb-4 font-medium">
          पुनर्वास-९, सीताबस्ती, कञ्चनपुर (Punarbas-9, Sitabasti, Kanchanpur)
        </p>
        <div className="inline-block px-8 py-2 rounded-full border border-[#c9a227]/50 bg-white text-[#1a3a2a] font-bold text-sm md:text-base tracking-wide shadow-sm">
          शैक्षिक सत्र {calendarYear} को वार्षिक कार्यक्रम
        </div>
      </div>

      {/* Legend Block */}
      <div className="border border-[#c9a227]/30 bg-white rounded-xl p-3 md:p-4 mb-6 flex flex-wrap justify-between items-center gap-3 text-xs md:text-sm font-semibold text-[#444444] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#8b1a1a]/10 border border-[#8b1a1a]/30"></div>
          <span>शनिबार (Saturday) / आइतबार (Sunday)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#c9a227]/20 border border-[#c9a227]/50"></div>
          <span>परीक्षा (Exams)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#1a3a2a]/10 border border-[#1a3a2a]/30"></div>
          <span>विदा / गतिविधि (Holidays/Events)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">📖</span>
          <span>पढाइ हुने दिन (Teaching Days)</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto border border-[#c9a227]/30 rounded-lg bg-white shadow-sm scrollbar-thin scrollbar-thumb-[#1a3a2a]">
        <table className="w-full text-center border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-[#1a3a2a] text-[10px] md:text-[11px] font-bold tracking-wider text-white">
              <th className="py-2.5 px-3 text-left border-r border-[#c9a227]/50 sticky left-0 bg-[#1a3a2a] z-20">महिना</th>
              {Array.from({ length: totalDays }, (_, i) => (
                <th key={i} className="py-2.5 px-1 border-r border-[#c9a227]/30 min-w-[28px] font-medium">{i + 1}</th>
              ))}
              <th className="py-2 px-1.5 border-r border-[#c9a227]/50 leading-tight text-[9px]">विद्यालय<br/>खुल्ने<br/>दिन</th>
              <th className="py-2 px-1.5 border-r border-[#c9a227]/50 leading-tight text-[9px]">पढाइ<br/>हुने<br/>दिन</th>
              <th className="py-2 px-1.5 border-r border-[#c9a227]/50 leading-tight text-[9px]">शनिबार</th>
              <th className="py-2 px-1.5 border-r border-[#c9a227]/50 leading-tight text-[9px]">आइतबार</th>
              <th className="py-2 px-1.5 border-r border-[#c9a227]/50 leading-tight text-[9px]">सार्वजनिक<br/>विदा</th>
              <th className="py-2 px-1.5 border-r border-[#c9a227]/50 leading-tight text-[9px]">परीक्षा<br/>विदा</th>
              <th className="py-2 px-1.5 border-r border-[#c9a227]/50 leading-tight text-[9px]">विद्यालय<br/>अतिरिक्त</th>
              <th className="py-2 px-1.5 leading-tight text-[9px]">जम्मा<br/>दिन</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-[#c9a227]/20 font-medium">
            {months.map((month) => {
              const renderedDays = new Set<number>();
              
              const stats = calculateStats(month.days);
              const openDays = stats.study + stats.exam + stats.extra;
              
              grandTotals.study += stats.study;
              grandTotals.sat += stats.sat;
              grandTotals.sun += stats.sun;
              grandTotals.holiday += stats.holiday;
              grandTotals.exam += stats.exam;
              grandTotals.extra += stats.extra;
              grandTotals.total += stats.total;
              grandTotals.open += openDays;

              return (
              <tr key={month.id} className="hover:bg-[#fdf6e3]/50 transition-colors">
                <td className="py-1.5 px-3 text-left border-r border-[#c9a227]/30 sticky left-0 bg-[#fdf6e3] z-10 text-[#1a3a2a] font-bold shadow-[2px_0_5px_rgba(0,0,0,0.03)] font-serif text-[12px]">
                  {month.month_name}
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  if (renderedDays.has(i)) return null;

                  const dayVal = month.days[i] || '';
                  
                  let colSpan = 1;
                  if (dayVal && dayVal !== '📖' && dayVal !== 'पढाइ' && dayVal !== 'शनि' && dayVal !== 'आइत') {
                    for (let j = i + 1; j < totalDays; j++) {
                      if (month.days[j] === dayVal) {
                        colSpan++;
                        renderedDays.add(j);
                      } else {
                        break;
                      }
                    }
                  }

                  let bgClass = "bg-white text-[#444444]";
                  let displayVal: React.ReactNode = dayVal;
                  
                  if (dayVal === 'शनि' || dayVal === 'आइत') {
                    bgClass = "bg-[#8b1a1a]/10 text-[#8b1a1a] font-bold";
                  }
                  else if (dayVal === '📖' || dayVal === 'पढाइ') {
                    bgClass = "bg-white text-[#1a3a2a]";
                    displayVal = "📖";
                  }
                  else if (examKeywords.some(k => dayVal.includes(k))) {
                    bgClass = "bg-[#c9a227]/20 text-[#1a3a2a] font-bold";
                    displayVal = <>{dayVal} {colSpan > 1 ? `(${colSpan})` : ''}</>;
                  }
                  else if (extraKeywords.some(k => dayVal.includes(k))) {
                    bgClass = "bg-[#1a3a2a]/10 text-[#1a3a2a] font-bold";
                    displayVal = <>{dayVal} {colSpan > 1 ? `(${colSpan} दिन)` : ''}</>;
                  }
                  else if (dayVal) {
                    bgClass = "bg-[#8b1a1a]/5 text-[#8b1a1a] font-bold";
                    displayVal = <>{dayVal} {colSpan > 1 ? `(${colSpan})` : ''}</>;
                  }

                  if (!dayVal) {
                    displayVal = "";
                  }

                  return (
                    <td key={i} colSpan={colSpan} className={`py-1 px-0.5 border-r border-[#c9a227]/20 text-[10px] align-middle transition-colors ${bgClass}`}>
                      <div className="flex items-center justify-center h-full min-h-[28px]">
                        <span className="block text-center whitespace-nowrap px-0.5" title={dayVal}>
                          {displayVal}
                        </span>
                      </div>
                    </td>
                  );
                })}

                {/* Stats Columns */}
                <td className="py-1 px-1.5 border-x border-[#c9a227]/30 bg-[#c9a227]/10 text-[#1a3a2a] font-bold text-[11px]">{openDays}</td>
                <td className="py-1 px-1.5 border-r border-[#c9a227]/30 bg-[#fdf6e3]/50 text-[#444444] font-semibold text-[11px]">{stats.study}</td>
                <td className="py-1 px-1.5 border-r border-[#c9a227]/30 bg-[#fdf6e3]/50 text-[#444444] font-semibold text-[11px]">{stats.sat}</td>
                <td className="py-1 px-1.5 border-r border-[#c9a227]/30 bg-[#fdf6e3]/50 text-[#444444] font-semibold text-[11px]">{stats.sun}</td>
                <td className="py-1 px-1.5 border-r border-[#c9a227]/30 bg-[#fdf6e3]/50 text-[#8b1a1a] font-bold text-[11px]">{stats.holiday}</td>
                <td className="py-1 px-1.5 border-r border-[#c9a227]/30 bg-[#fdf6e3]/50 text-[#444444] font-semibold text-[11px]">{stats.exam}</td>
                <td className="py-1 px-1.5 border-r border-[#c9a227]/30 bg-[#fdf6e3]/50 text-[#444444] font-semibold text-[11px]">{stats.extra}</td>
                <td className="py-1 px-1.5 bg-[#1a3a2a]/5 text-[#1a3a2a] font-bold text-[11px]">{stats.total}</td>
              </tr>
              );
            })}

            {/* Grand Totals Row */}
            {months.length > 0 && (
              <tr className="bg-[#1a3a2a] text-white font-bold text-[11px]">
                <td className="py-3 px-3 text-left border-r border-[#c9a227]/50 sticky left-0 bg-[#1a3a2a] z-10 text-white/70 font-medium italic text-[10px] whitespace-nowrap">
                  संकेतः 📖 पढाइ हुने दिन
                </td>
                <td colSpan={totalDays} className="py-3 border-r border-[#c9a227]/50 bg-[#1a3a2a]">
                  {/* scrollbar track area */}
                </td>
                <td className="py-3 px-1.5 border-r border-[#c9a227]/50 text-[#1a3a2a] bg-[#c9a227] text-center font-bold">{grandTotals.open}</td>
                <td className="py-3 px-1.5 border-r border-[#c9a227]/50 text-white text-center">{grandTotals.study}</td>
                <td className="py-3 px-1.5 border-r border-[#c9a227]/50 text-[#c9a227] text-center">{grandTotals.sat}</td>
                <td className="py-3 px-1.5 border-r border-[#c9a227]/50 text-[#c9a227] text-center">{grandTotals.sun}</td>
                <td className="py-3 px-1.5 border-r border-[#c9a227]/50 text-rose-300 text-center">{grandTotals.holiday}</td>
                <td className="py-3 px-1.5 border-r border-[#c9a227]/50 text-white text-center">{grandTotals.exam}</td>
                <td className="py-3 px-1.5 border-r border-[#c9a227]/50 text-white text-center">{grandTotals.extra}</td>
                <td className="py-3 px-1.5 text-[#1a3a2a] bg-[#c9a227] text-center font-bold">{grandTotals.total}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="mt-16 mb-6 px-10 flex flex-col md:flex-row justify-between items-center gap-16 text-[#1a3a2a] font-bold text-sm">
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-48 border-b-2 border-dashed border-[#1a3a2a]/30 mb-3"></div>
          <span>प्रधानाध्यापक</span>
        </div>
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-48 border-b-2 border-dashed border-[#1a3a2a]/30 mb-3"></div>
          <span>शिक्षक प्रतिनिधि</span>
        </div>
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-48 border-b-2 border-dashed border-[#1a3a2a]/30 mb-3"></div>
          <span>वि.स.स अध्यक्ष</span>
        </div>
      </div>

    </div>
  );
}
