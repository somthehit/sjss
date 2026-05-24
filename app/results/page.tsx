"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import { toNepaliNumerals } from "@/lib/dateConverter";
import {
  Sparkles,
  Search,
  Printer,
  Download,
  Award,
  AlertCircle,
  ExternalLink,
  ClipboardList,
} from "lucide-react";

interface SubjectResult {
  code: string;
  nameEn: string;
  nameNp: string;
  fullMarks: number;
  passMarks: number;
  marksObtained: number;
  grade: string;
  remarksEn: string;
  remarksNp: string;
}

export default function Results() {
  const { t, language } = useLanguage();
  
  // Search parameters
  const [rollNo, setRollNo] = useState("");
  const [academicYear, setAcademicYear] = useState("2081");
  const [classGrade, setClassGrade] = useState("10");
  
  // States
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<{
    studentName: string;
    fatherName: string;
    rollNo: string;
    academicYear: string;
    classGrade: string;
    divisionEn: string;
    divisionNp: string;
    percentage: number;
    passStatus: boolean;
    subjects: SubjectResult[];
  } | null>(null);

  const mockSubjects: SubjectResult[] = [
    { code: "101", nameEn: "English", nameNp: "अंग्रेजी", fullMarks: 100, passMarks: 35, marksObtained: 84, grade: "A", remarksEn: "Excellent", remarksNp: "अति उत्तम" },
    { code: "102", nameEn: "Nepali", nameNp: "नेपाली", fullMarks: 100, passMarks: 35, marksObtained: 76, grade: "B+", remarksEn: "Very Good", remarksNp: "उत्तम" },
    { code: "103", nameEn: "Compulsory Mathematics", nameNp: "गणित", fullMarks: 100, passMarks: 35, marksObtained: 92, grade: "A+", remarksEn: "Outstanding", remarksNp: "सर्वोत्कृष्ट" },
    { code: "104", nameEn: "Science & Technology", nameNp: "विज्ञान तथा प्रविधि", fullMarks: 100, passMarks: 35, marksObtained: 85, grade: "A", remarksEn: "Excellent", remarksNp: "अति उत्तम" },
    { code: "105", nameEn: "Social Studies & Civics", nameNp: "सामाजिक अध्ययन", fullMarks: 100, passMarks: 35, marksObtained: 78, grade: "B+", remarksEn: "Very Good", remarksNp: "उत्तम" },
    { code: "106", nameEn: "Optional Mathematics", nameNp: "ऐच्छिक गणित", fullMarks: 100, passMarks: 35, marksObtained: 90, grade: "A+", remarksEn: "Outstanding", remarksNp: "सर्वोत्कृष्ट" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    
    // Simplistic roll number search validation (Roll 101 or 12 or 5 to show pass, others show error/fail for testing)
    const normalized = rollNo.trim().toLowerCase();
    if (normalized === "101" || normalized === "12" || normalized === "5" || normalized === "05") {
      setResult({
        studentName: "Siddharth Upadhyaya",
        fatherName: "Prayag Raj Upadhyaya",
        rollNo: rollNo,
        academicYear: academicYear,
        classGrade: classGrade,
        divisionEn: "Distinction",
        divisionNp: "विशिष्ट श्रेणी",
        percentage: 84.16,
        passStatus: true,
        subjects: mockSubjects
      });
    } else {
      setResult(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="text-center flex flex-col items-center mb-10 no-print">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("ACADEMIC PERFORMANCE BOARD", "शैक्षिक परीक्षा परिणाम")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("Student Results Lookup", "नतिजा खोज बोर्ड")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Search school internal terminal examinations and download official digital marksheets instantly.",
            "शैक्षिक वर्ष तथा लब्धाङ्क पत्र खोज्न रोल नम्बर प्रविष्ट गर्नुहोस् र मार्कसिट प्रिन्ट गर्नुहोस्।"
          )}
        </p>
      </div>

      {/* PRINT-ONLY LOGO HEADER */}
      {result && (
        <div className="hidden print-only text-center border-b-2 border-black pb-4 mb-8">
          <h1 className="text-2xl font-bold font-serif text-black uppercase">SHREE JIVEEN SHAKTI SECONDARY SCHOOL</h1>
          <p className="text-xs font-sans">Punarbas-9, Sitabasti, Kanchanpur, Nepal | Estd: 2037 BS</p>
          <h2 className="text-lg font-bold font-serif mt-3 uppercase border-y border-black py-1">OFFICIAL ACADEMIC MARKSHEET</h2>
        </div>
      )}

      {/* Search Bar Container */}
      <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 md:p-6 shadow-sm parchment-glow mb-8 no-print">
        <h3 className="text-base font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Search className="w-5 h-5 text-[#c9a227]" />
          <span>{t("Insert Result Query Criteria", "परीक्षा नतिजा खोज्नुहोस्")}</span>
        </h3>

        <form onSubmit={handleSearch} className="grid sm:grid-cols-4 gap-4 items-end font-sans text-xs sm:text-sm">
          {/* Roll No */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1a3a2a]">{t("Roll Number *", "रोल नम्बर *")}</label>
            <input
              type="text"
              required
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. 101"
              className="w-full p-2 border border-[#c9a227]/30 rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30 font-mono font-bold text-base"
            />
          </div>

          {/* Academic Year */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1a3a2a]">{t("Academic Year", "शैक्षिक वर्ष")}</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a] font-semibold text-[#1a3a2a]"
            >
              {["2081", "2080", "2079"].map((yr) => (
                <option key={yr} value={yr}>
                  {language === "NP" ? `${toNepaliNumerals(yr)} वि.सं.` : `${yr} BS`}
                </option>
              ))}
            </select>
          </div>

          {/* Class Grade */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1a3a2a]">{t("Class Grade", "कक्षा")}</label>
            <select
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value)}
              className="w-full p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a] font-semibold text-[#1a3a2a]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={String(g)}>
                  {t(`Grade ${g}`, `कक्षा ${toNepaliNumerals(g)}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#1a3a2a] text-white border border-[#c9a227] font-bold text-xs uppercase tracking-wider rounded cursor-pointer hover:bg-[#102419]"
          >
            {t("Fetch Marksheet", "नतिजा खोज्नुहोस्")}
          </button>
        </form>

        <p className="text-[10px] text-[#444444]/60 mt-3 italic">
          {t("* Demonstration Tip: Enter Roll Number '101' to fetch Siddharth's distinction marksheet.", "* नमुनाको लागि: सिद्धार्थको लब्धाङ्क पत्र हेर्न रोल नम्बर '१०१' प्रविष्ट गर्नुहोस्।")}
        </p>
      </div>

      {/* RESULT / MARKSHEET DISPLAY PANEL */}
      {searched && (
        <div className="flex flex-col">
          {result ? (
            <div className="bg-white border-2 border-black sm:border-[#c9a227] p-4 sm:p-10 shadow-xl rounded-lg relative overflow-hidden bg-gradient-to-br from-white to-[#fdf6e3]/20 parchment-glow">
              {/* Seal watermark behind for authenticity */}
              <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
                <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor" className="text-[#1a3a2a]">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
                  <text x="50" y="55" fontSize="12" textAnchor="middle" fontWeight="bold">JSSS</text>
                </svg>
              </div>

              {/* Marksheet Controls Bar */}
              <div className="flex justify-end gap-3 mb-6 no-print border-b border-[#c9a227]/20 pb-4">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1a3a2a] text-white border border-[#c9a227] rounded text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#102419]"
                >
                  <Printer className="w-3.5 h-3.5 text-[#c9a227]" />
                  <span>{t("Print Marksheet", "मार्कसिट छाप्नुहोस्")}</span>
                </button>
              </div>

              {/* Student Bio details */}
              <div className="grid sm:grid-cols-2 gap-4 font-serif text-sm border-b-2 border-black pb-4 mb-6 text-left">
                <div className="space-y-1.5">
                  <div>
                    <span className="font-sans text-[10px] text-[#444444]/60 font-bold block uppercase">{t("Student Name:", "विद्यार्थीको नाम:")}</span>
                    <span className="text-base font-bold text-[#1a3a2a] uppercase">{result.studentName}</span>
                  </div>
                  <div>
                    <span className="font-sans text-[10px] text-[#444444]/60 font-bold block uppercase">{t("Father / Guardian Name:", "पिता / अभिभावकको नाम:")}</span>
                    <span className="font-bold">{result.fatherName}</span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:text-right">
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:items-end">
                    <div>
                      <span className="font-sans text-[10px] text-[#444444]/60 font-bold block uppercase">{t("Roll Number:", "रोल नम्बर:")}</span>
                      <span className="font-mono font-bold text-base text-[#8b1a1a]">{result.rollNo}</span>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] text-[#444444]/60 font-bold block uppercase">{t("Class Grade & Year:", "कक्षा र शैक्षिक वर्ष:")}</span>
                      <span className="font-bold">
                        {t(`Grade ${result.classGrade}`, `कक्षा ${toNepaliNumerals(result.classGrade)}`)} | {language === "NP" ? toNepaliNumerals(result.academicYear) : result.academicYear}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabular Marks Matrix */}
              <div className="overflow-x-auto border border-black rounded">
                <table className="w-full text-left font-sans text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#1a3a2a] text-white border-b-2 border-black uppercase font-semibold text-[10px] sm:text-xs">
                      <th className="py-3 px-3">{t("Code", "कोड")}</th>
                      <th className="py-3 px-3">{t("Subject Description", "विषय नामाकरण")}</th>
                      <th className="py-3 px-3 text-center">{t("Full Marks", "पूर्णाङ्क")}</th>
                      <th className="py-3 px-3 text-center">{t("Pass Marks", "उत्तीर्णाङ्क")}</th>
                      <th className="py-3 px-3 text-center">{t("Marks Obtained", "प्राप्ताङ्क")}</th>
                      <th className="py-3 px-3 text-center">{t("Grade", "ग्रेड")}</th>
                      <th className="py-3 px-3 text-center">{t("Remarks", "कैफियत")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c9a227]/20 bg-white text-[#444444] font-medium">
                    {result.subjects.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-[#fdf6e3]/40">
                        <td className="py-3 px-3 font-mono font-bold text-[#1a3a2a]">{sub.code}</td>
                        <td className="py-3 px-3 font-serif font-bold text-sm text-[#1a3a2a]">
                          {t(sub.nameEn, sub.nameNp)}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">{language === "NP" ? toNepaliNumerals(sub.fullMarks) : sub.fullMarks}</td>
                        <td className="py-3 px-3 text-center font-mono">{language === "NP" ? toNepaliNumerals(sub.passMarks) : sub.passMarks}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-[#8b1a1a]">
                          {language === "NP" ? toNepaliNumerals(sub.marksObtained) : sub.marksObtained}
                        </td>
                        <td className="py-3 px-3 text-center font-serif font-extrabold text-[#1a3a2a] text-base">{sub.grade}</td>
                        <td className="py-3 px-3 text-center text-xs font-semibold">{t(sub.remarksEn, sub.remarksNp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Marksheet Totals Footer Summary */}
              <div className="mt-8 border-t-2 border-black pt-4 grid sm:grid-cols-2 gap-4 text-left font-serif text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between max-w-xs border-b border-[#c9a227]/20 pb-1">
                    <span className="font-sans text-xs text-[#444444]/70 font-semibold">{t("Percentage Score:", "कुल प्रतिशत दर:")}</span>
                    <span className="font-mono font-bold text-[#1a3a2a]">{language === "NP" ? toNepaliNumerals(result.percentage) : result.percentage}%</span>
                  </div>
                  <div className="flex justify-between max-w-xs border-b border-[#c9a227]/20 pb-1">
                    <span className="font-sans text-xs text-[#444444]/70 font-semibold">{t("Academic Division:", "प्राप्त श्रेणी:")}</span>
                    <span className="font-bold text-[#1a3a2a]">{t(result.divisionEn, result.divisionNp)}</span>
                  </div>
                </div>

                <div className="sm:text-right flex flex-col justify-end items-start sm:items-end">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs px-3 py-1 bg-[#1a3a2a]/10 border border-[#1a3a2a]/20 text-[#1a3a2a] rounded">
                    <Award className="w-4 h-4 text-[#c9a227]" />
                    <span>{t("Pass Status: QUALIFIED", "नतिजा: उत्तीर्ण")}</span>
                  </div>
                </div>
              </div>

              {/* Stamp Seal signature area for printing */}
              <div className="hidden print-only mt-16 flex justify-between items-center text-xs font-sans text-black">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border border-black rounded-full flex items-center justify-center opacity-40">STAMP</div>
                  <span className="mt-2 font-bold uppercase tracking-wider text-[10px]">Verified By Administration</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-serif italic text-sm">P. R. Upadhyaya</span>
                  <div className="h-[0.5px] bg-black w-28 my-1" />
                  <span className="font-bold uppercase tracking-wider text-[9px]">Prayag Raj Upadhyaya</span>
                  <span className="text-[9px] opacity-75">Principal, JSSS</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#8b1a1a]/30 p-8 rounded-lg shadow-sm text-center flex flex-col items-center text-[#8b1a1a] parchment-glow">
              <AlertCircle className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-bold font-serif">{t("Result Records Not Found!", "नतिजा रेकर्ड फेला परेन!")}</h3>
              <p className="text-xs sm:text-sm text-[#444444] mt-2 font-sans max-w-sm">
                {t(
                  "We could not find result files associated with Roll Number: ",
                  "हामीले रोल नम्बर: "
                )}
                <strong>{rollNo}</strong>
                {t(" for the academic selections. Please verify input characters.", " को परीक्षा नतिजा भेट्टाउन सकेनौँ। कृपया रोल नम्बर पुन: जाँच गर्नुहोला।")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: EXTERNAL SEE LINKS (NEB INTEGRATION) */}
      <section className="mt-12 no-print bg-[#1a3a2a]/5 border-2 border-[#c9a227]/30 p-6 md:p-8 rounded-lg parchment-glow text-center">
        <h3 className="text-lg font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#c9a227]" />
          <span>{t("Official Board Examinations (SEE / NEB)", "राष्ट्रिय बोर्ड परीक्षा सम्बन्धी लिंकहरू")}</span>
        </h3>
        <p className="text-xs text-[#444444] max-w-md mx-auto mb-6 leading-relaxed">
          {t(
            "To lookup national boards or check ledger grades externally, please proceed directly to the certified governmental website integrations below.",
            "राष्ट्रिय परीक्षा बोर्ड (NEB) र एस.ई.ई. परीक्षा नतिजा सम्बन्धी जानकारीका लागि निम्न सरकारी वेबसाइटहरूमा जान सक्नुहुनेछ।"
          )}
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto font-sans text-xs">
          <a
            href="https://see.gov.np"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white border border-[#c9a227]/30 rounded hover:shadow-md hover:border-[#1a3a2a] transition-all text-[#1a3a2a] font-bold"
          >
            <div className="flex flex-col text-left">
              <span>{t("SEE Controller Office", "एस.ई.ई. परीक्षा नियन्त्रण कार्यालय")}</span>
              <span className="text-[10px] text-[#444444]/60 font-medium">see.gov.np</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#c9a227] shrink-0" />
          </a>

          <a
            href="https://neb.gov.np"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white border border-[#c9a227]/30 rounded hover:shadow-md hover:border-[#1a3a2a] transition-all text-[#1a3a2a] font-bold"
          >
            <div className="flex flex-col text-left">
              <span>{t("National Examinations Board (NEB)", "राष्ट्रिय परीक्षा बोर्ड (NEB)")}</span>
              <span className="text-[10px] text-[#444444]/60 font-medium">neb.gov.np</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#c9a227] shrink-0" />
          </a>
        </div>
      </section>
    </div>
  );
}
