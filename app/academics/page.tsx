"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import { BookOpen, Star, Sparkles, GraduationCap, Trophy, ClipboardCheck } from "lucide-react";
import { toNepaliNumerals } from "@/lib/dateConverter";

export default function Academics() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"primary" | "secondary" | "grading">("primary");

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
      <div className="flex justify-center border-b border-[#c9a227]/30 pb-px mb-8 no-print">
        <div className="flex gap-2 sm:gap-6 font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("primary")}
            className={`pb-4 px-2 cursor-pointer border-b-2 transition-all ${
              activeTab === "primary"
                ? "border-[#c9a227] text-[#1a3a2a] font-bold"
                : "border-transparent text-[#444444]/60 hover:text-[#1a3a2a]"
            }`}
          >
            {t("Primary (Grades 1-8)", "आधारभूत तह (कक्षा १-८)")}
          </button>
          <button
            onClick={() => setActiveTab("secondary")}
            className={`pb-4 px-2 cursor-pointer border-b-2 transition-all ${
              activeTab === "secondary"
                ? "border-[#c9a227] text-[#1a3a2a] font-bold"
                : "border-transparent text-[#444444]/60 hover:text-[#1a3a2a]"
            }`}
          >
            {t("Secondary (Grades 9-12)", "माध्यमिक तह (कक्षा ९-१२)")}
          </button>
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

      {/* TAB CONTENT 1: PRIMARY */}
      {activeTab === "primary" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#c9a227]" />
              {t("Primary & Lower Secondary Curriculum (Class 1-8)", "आधारभूत तह पाठ्यक्रम (कक्षा १-८)")}
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed mt-4 font-sans">
              {t(
                "Our basic school curriculum conforms strictly to the standards set by the Curriculum Development Centre (CDC), Sanothimi, Bhaktapur. We focus on building fundamental competencies in languages, mathematics, social ethics, and basic environmental sciences.",
                "कक्षा १ देखि ८ सम्मको पठनपाठन पाठ्यक्रम विकास केन्द्र, सानोठिमी भक्तपुरद्वारा निर्धारित राष्ट्रिय पाठ्यक्रम प्रारूपमा आधारित छ। यस तहमा बालबालिकाहरूको भाषिक विकास, गणितीय सीप, सामाजिक दायित्व र वातावरण सम्बन्धी आधारभूत ज्ञान निर्माणमा जोड दिइन्छ।"
              )}
            </p>
            
            <h3 className="text-base font-bold text-[#1a3a2a] font-serif uppercase tracking-wider mt-6 mb-3">
              {t("Core Subject Matrix", "प्रमुख विषयहरू")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-sans text-[#444444]">
              <div className="flex items-center gap-2 p-2.5 bg-[#1a3a2a]/5 border border-[#c9a227]/10 rounded font-semibold text-[#1a3a2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                <span>{t("Nepali Language", "नेपाली भाषा")}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#1a3a2a]/5 border border-[#c9a227]/10 rounded font-semibold text-[#1a3a2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                <span>{t("English Language", "अंग्रेजी भाषा")}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#1a3a2a]/5 border border-[#c9a227]/10 rounded font-semibold text-[#1a3a2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                <span>{t("Mathematics", "गणित")}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#1a3a2a]/5 border border-[#c9a227]/10 rounded font-semibold text-[#1a3a2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                <span>{t("Science & Technology", "विज्ञान तथा प्रविधि")}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#1a3a2a]/5 border border-[#c9a227]/10 rounded font-semibold text-[#1a3a2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                <span>{t("Social Studies", "सामाजिक अध्ययन")}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#1a3a2a]/5 border border-[#c9a227]/10 rounded font-semibold text-[#1a3a2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                <span>{t("Health & Physical Education", "स्वास्थ्य तथा शारीरिक शिक्षा")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SECONDARY */}
      {activeTab === "secondary" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#c9a227]" />
              {t("Secondary School & SEE Preparation (Class 9-10)", "माध्यमिक तह र एस.ई.ई. तयारी (कक्षा ९-१०)")}
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed mt-4 font-sans">
              {t(
                "Secondary education is a critical bridge to higher studies. We prepare our Class 10 pupils rigorously for the nationwide Secondary Education Examination (SEE) using systematic weekly tests, subject-specific counseling, and additional laboratory coaching.",
                "कक्षा ९ र १० को शिक्षा माध्यमिक तहको मुख्य जग हो। हामी हाम्रा कक्षा १० का विद्यार्थीहरूलाई राष्ट्रिय परीक्षा बोर्डद्वारा सञ्चालित देशव्यापी माध्यमिक शिक्षा परीक्षा (SEE) को लागि विशेष तयारी कक्षाहरू, साप्ताहिक नमुना परीक्षाहरू र प्रयोगशाला अभ्यास मार्फत अब्बल बनाउँछौँ।"
              )}
            </p>

            <h3 className="text-base font-bold text-[#1a3a2a] font-serif uppercase tracking-wider mt-6 mb-3">
              {t("Special SEE Elective Streams", "एस.ई.ई. ऐच्छिक विषयहरू")}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm font-sans text-[#444444]">
              <div className="p-4 border border-[#c9a227]/30 rounded bg-white">
                <h4 className="font-bold font-serif text-sm text-[#8b1a1a] mb-1">
                  {t("Elective Stream A: Pure Science Prep", "ऐच्छिक समूह क: शुद्ध विज्ञान तयारी")}
                </h4>
                <p className="text-xs text-[#444444]/80">
                  {t("Includes Opt. Mathematics and Environmental Science. Recommended for students wishing to pursue higher technical streams.", "ऐच्छिक गणित र वातावरण विज्ञान। उच्च प्राविधिक तथा विज्ञान क्षेत्रमा लाग्न चाहनेहरूका लागि उपयोगी।")}
                </p>
              </div>
              <div className="p-4 border border-[#c9a227]/30 rounded bg-white">
                <h4 className="font-bold font-serif text-sm text-[#8b1a1a] mb-1">
                  {t("Elective Stream B: Commerce & Admin", "ऐच्छिक समूह ख: व्यवस्थापन र प्रशासन")}
                </h4>
                <p className="text-xs text-[#444444]/80">
                  {t("Includes Accountancy & Economics. Focuses on regional trade, agriculture management, and bookkeeping basics.", "ऐच्छिक लेखा र अर्थशास्त्र। स्थानीय उद्यमशीलता, बैंकिङ र व्यवस्थापनका आधारभूत पक्षहरूमा केन्द्रित।")}
                </p>
              </div>
            </div>
          </div>

          {/* Plus two section */}
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow mt-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#c9a227]" />
              {t("Higher Secondary School (+2 Program: Class 11-12)", "उच्च माध्यमिक (+२ कार्यक्रम: कक्षा ११-१२)")}
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed mt-4 font-sans">
              {t(
                "Approved by the National Examinations Board (NEB), our plus-two streams are structured to provide advanced, affordable regional studies. We offer two major streams:",
                "राष्ट्रिय परीक्षा बोर्ड (NEB) बाट सम्बन्धन प्राप्त हाम्रो उच्च माध्यमिक तहमा विद्यार्थीहरूको सहज पहूँचका लागि निम्न दुई संकायहरू सञ्चालित छन्:"
              )}
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-xs sm:text-sm text-[#444444]">
              <li>
                <strong>{t("Education Stream (B.Ed. Preparatory): ", "शिक्षा संकाय: ")}</strong>
                {t("Focuses on teacher training, child development theories, and educational philosophy.", "अध्यापन अध्यादेश, बाल मनोविज्ञान र शैक्षिक दर्शन जस्ता विषयहरूमा आधारित।")}
              </li>
              <li>
                <strong>{t("Management Stream (BBS/BBA Preparatory): ", "व्यवस्थापन संकाय: ")}</strong>
                {t("Focuses on business mathematics, accountancy principles, economics, and business studies.", "व्यावसायिक गणित, वित्तीय लेखा, अर्थशास्त्र र व्यावसायिक संगठन जस्ता विषयहरूमा केन्द्रित।")}
              </li>
            </ul>
          </div>
        </div>
      )}

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
