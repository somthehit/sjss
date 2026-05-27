"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import { BookOpen, Star, Sparkles, GraduationCap, Trophy, ClipboardCheck } from "lucide-react";
import { toNepaliNumerals } from "@/lib/dateConverter";

export default function Academics() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("grading");
  const [programs, setPrograms] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/academic-programs')
      .then(res => res.ok ? res.json() : { data: [] })
      .then(json => {
        const data = json.data || [];
        setPrograms(data);
        if (data.length > 0) {
          setActiveTab(data[0].id.toString());
        }
      })
      .catch(console.error);
  }, []);

  const gradingSystem = [
    { interval: "90 - 100", gpa: "4.0", grade: "A+", descEn: "Outstanding", descNp: "सर्वोत्कृष्ट" },
    { interval: "80 - 90", gpa: "3.6", grade: "A", descEn: "Excellent", descNp: "अति उत्तम" },
    { interval: "70 - 80", gpa: "3.2", grade: "B+", descEn: "Very Good", descNp: "उत्तम" },
    { interval: "60 - 70", gpa: "2.8", grade: "B", descEn: "Good", descNp: "सन्तोषजनक" },
    { interval: "50 - 60", gpa: "2.4", grade: "C+", descEn: "Satisfactory", descNp: "ग्राह्य" },
    { interval: "40 - 50", gpa: "2.0", grade: "C", descEn: "Acceptable", descNp: "स्वीकार्य" },
    { interval: "35 - 40", gpa: "1.6", grade: "D", descEn: "Basic", descNp: "साधारण" },
    { interval: "Below 35", gpa: "0.0", grade: "NG", descEn: "Non-Graded (Fail)", descNp: "वर्गीकरण नभएको (अनुत्तीर्ण)" }
  ];

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full">
      {/* Title block */}
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("KNOWLEDGE AND EXCELLENCE", "शिक्षा र उत्कृष्टता")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("Academic Programs", "शैक्षिक कार्यक्रमहरू")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Empowering students through structured learning, scientific curiosities, and standard NEB curriculums.",
            "नेपाल सरकारको पाठ्यक्रम ढाँचा अन्तर्गत व्यावहारिक र वैज्ञानिक पद्धतिमा आधारित शिक्षण सिकाइ।"
          )}
        </p>
      </div>

      {/* Tab controls */}
      <div className="flex justify-center border-b border-[#c9a227]/30 pb-px mb-8 no-print flex-wrap">
        <div className="flex gap-2 sm:gap-6 font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider flex-wrap justify-center">
          {programs.filter(p => p.is_active).map(program => (
            <button
              key={program.id}
              onClick={() => setActiveTab(program.id.toString())}
              className={`pb-4 px-2 cursor-pointer border-b-2 transition-all ${
                activeTab === program.id.toString()
                  ? "border-[#c9a227] text-[#1a3a2a] font-bold"
                  : "border-transparent text-[#444444]/60 hover:text-[#1a3a2a]"
              }`}
            >
              {t(program.level_en, program.level_np)}
            </button>
          ))}
          <button
            onClick={() => setActiveTab("grading")}
            className={`pb-4 px-2 cursor-pointer border-b-2 transition-all ${
              activeTab === "grading"
                ? "border-[#c9a227] text-[#1a3a2a] font-bold"
                : "border-transparent text-[#444444]/60 hover:text-[#1a3a2a]"
            }`}
          >
            {t("Grading System", "मूल्याङ्कन तथा ग्रेडिङ")}
          </button>
        </div>
      </div>

      {/* DYNAMIC PROGRAMS */}
      {programs.filter(p => p.is_active && activeTab === p.id.toString()).map((program) => (
        <div key={program.id} className="flex flex-col gap-6">
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#c9a227]" />
              {t(program.level_en, program.level_np)}
            </h2>
            <div className="text-sm text-[#444444] leading-relaxed mt-4 font-sans space-y-3">
              {language === 'en' 
                ? program.description_en?.split('\n').map((para: string, i: number) => <p key={i}>{para}</p>)
                : program.description_np?.split('\n').map((para: string, i: number) => <p key={i}>{para}</p>)
              }
            </div>
            
            {program.subjects && program.subjects.length > 0 && (
              <>
                <h3 className="text-base font-bold text-[#1a3a2a] font-serif uppercase tracking-wider mt-6 mb-3">
                  {t("Core Subjects", "प्रमुख विषयहरू")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-sans text-[#444444]">
                  {program.subjects.map((sub: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#1a3a2a]/5 border border-[#c9a227]/10 rounded font-semibold text-[#1a3a2a]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                      <span>{t(sub.nameEn || sub.name_en, sub.nameNp || sub.name_np)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ))}


      {/* TAB CONTENT 3: GRADING */}
      {activeTab === "grading" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-[#c9a227]" />
              {t("NEB Standard GPA Evaluation Criteria", "नेपाल सरकार (NEB) ग्रेडिङ प्रणाली")}
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed mt-4 mb-6 font-sans">
              {t(
                "Below is the official standard letter-grading evaluation framework implemented in school term reports and internal marksheets in line with Nepalese board standards.",
                "राष्ट्रिय परीक्षा नियन्त्रण कार्यालय र विद्यालयको आन्तरिक मूल्याङ्कनमा प्रयोग हुने आधिकारिक राष्ट्रिय अक्षराङ्कन (Letter-Grading) पद्धति निम्न बमोजिम रहेको छ:"
              )}
            </p>

            {/* Responsive Table */}
            <div className="overflow-x-auto border border-[#c9a227]/30 rounded">
              <table className="w-full text-left font-sans text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#1a3a2a] text-[#c9a227] border-b border-[#c9a227]/40 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">{t("Percentage Range", "प्रतिशत दायरा")}</th>
                    <th className="py-3.5 px-4">{t("Letter Grade", "अक्षर ग्रेड")}</th>
                    <th className="py-3.5 px-4">{t("Grade Point (GPA)", "ग्रेड प्वाइन्ट (GPA)")}</th>
                    <th className="py-3.5 px-4">{t("Description", "विवरण")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c9a227]/10 bg-white">
                  {gradingSystem.map((g, idx) => (
                    <tr key={idx} className="hover:bg-[#1a3a2a]/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1a3a2a]">
                        {language === "NP" ? toNepaliNumerals(g.interval) : g.interval}
                      </td>
                      <td className="py-3 px-4 font-serif text-[#8b1a1a] font-extrabold">{g.grade}</td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {language === "NP" ? toNepaliNumerals(g.gpa) : g.gpa}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold">{t(g.descEn, g.descNp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <DhakaDivider />

      {/* Curriculum support statement */}
      <section className="py-6 px-4 bg-white border border-[#c9a227]/20 rounded-lg text-center parchment-glow">
        <h3 className="text-base font-bold text-[#1a3a2a] font-serif uppercase tracking-wider mb-2">
          {t("Extracurricular Synergy", "अतिरिक्त क्रियाकलाप समन्वय")}
        </h3>
        <p className="text-xs sm:text-sm text-[#444444] leading-relaxed max-w-2xl mx-auto font-sans">
          {t(
            "Academics is paired dynamically with regular speech competitions, sports tournaments, and organic science exhibitions, ensuring the wholesome cognitive and physical growth of the children.",
            "बौद्धिक विकासका साथसाथै नियमित वक्तृत्वकला, खेलकुद प्रतियोगिता र विज्ञान प्रदर्शनीहरू आयोजना गरिन्छ जसले विद्यार्थीको मानसिक तथा शारीरिक विकासमा सन्तुलन कायम राख्दछ।"
          )}
        </p>
      </section>
    </div>
  );
}
