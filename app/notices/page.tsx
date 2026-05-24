"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { getDualCalendarString, toNepaliNumerals } from "@/lib/dateConverter";
import DhakaDivider from "@/components/DhakaDivider";
import {
  Bell,
  Search,
  Grid,
  List,
  Pin,
  Download,
  Printer,
  Sparkles,
} from "lucide-react";

interface Notice {
  id: string;
  titleEn: string;
  titleNp: string;
  date: string;
  category: "Exam" | "Holiday" | "Event" | "Admission" | "Results";
  isPinned: boolean;
  contentEn: string;
  contentNp: string;
}

export default function Notices() {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "pinned">("pinned");

  const noticesData: Notice[] = [
    {
      id: "1",
      titleEn: "Admissions Open for Grade 11 Science & Commerce (Academic Year 2083)",
      titleNp: "कक्षा ११ विज्ञान तथा व्यवस्थापन संकायमा भर्ना खुला सम्बन्धी सूचना (शैक्षिक वर्ष २०८३)",
      date: "2083-05-10",
      category: "Admission",
      isPinned: true,
      contentEn: "Application forms for Grade 11 Science and Commerce streams are available at the administration desk. Submit completed inquiries by Ashadh 20, 2083 along with transcripts and character certificates. Entrance exam date will be announced subsequently.",
      contentNp: "शैक्षिक वर्ष २०८३ का लागि कक्षा ११ विज्ञान र व्यवस्थापन संकायमा भर्ना आवेदन फारम वितरण सुरु भएको छ। आवेदन फारम २०८३ असार २० गतेभित्र विद्यालयको प्रशासन शाखामा बुझाइसक्नुपर्नेछ। प्रवेश परीक्षाको मिति पछि प्रकाशित गरिनेछ।"
    },
    {
      id: "2",
      titleEn: "First Terminal Examination Schedule - Grades 1 to 10",
      titleNp: "प्रथम त्रैमासिक परीक्षा तालिका प्रकाशन - कक्षा १ देखि १०",
      date: "2083-05-20",
      category: "Exam",
      isPinned: true,
      contentEn: "The First Terminal Examinations for Grades 1 to 10 will commence on Jestha 25, 2083. Daily routine and roll schedules have been pinned to respective class boards. Parents are requested to ensure pupils undergo regular reading regimes at home.",
      contentNp: "कक्षा १ देखि १० सम्मको शैक्षिक सत्र २०८३ को प्रथम त्रैमासिक परीक्षा यही २०८३ जेठ २५ गतेदेखि सुरु हुने भएकाले विस्तृत परीक्षा तालिका सम्बन्धित कक्षाकोठाको सूचना पाटीमा टाँस गरिएको ब्यहोरा जानकारी गराइन्छ। विद्यार्थीहरूको नियमित गृहकार्य तथा तयारीमा सहयोग गरिदिनुहुन अभिभावकहरूमा अनुरोध छ।"
    },
    {
      id: "3",
      titleEn: "School Closure on Republic Day (Jestha 15)",
      titleNp: "गणतन्त्र दिवसको उपलक्ष्यमा सार्वजनिक बिदा सम्बन्धी सूचना (जेठ १५ गते)",
      date: "2083-05-14",
      category: "Holiday",
      isPinned: false,
      contentEn: "Notice is hereby given that the school will remain closed on Jestha 15, 2083 on the national occasion of Republic Day of Nepal. Regular classroom operations will resume on Jestha 16 at normal school hours.",
      contentNp: "मिति २०८३ जेठ १५ गते गणतन्त्र दिवसको पावन अवसरमा विद्यालयमा सार्वजनिक बिदा रहने ब्यहोरा सबैमा जानकारी गराइन्छ। नियमित पठनपाठन जेठ १६ गतेदेखि सामान्य रूपमा सञ्चालन हुनेछ।"
    },
    {
      id: "4",
      titleEn: "Annual Sports Week Prize Distribution Ceremony",
      titleNp: "वार्षिक खेलकुद सप्ताह पुरस्कार वितरण समारोह सम्बन्धी सूचना",
      date: "2083-04-18",
      category: "Event",
      isPinned: false,
      contentEn: "The grand distribution ceremony for the Annual Sports Meet will be held inside the main school ground on Ashadh 5. All parents and local municipal leaders are cordially invited to witness and encourage our sports champions.",
      contentNp: "यस विद्यालयको वार्षिक खेलकुद सप्ताहका विजयी खेलाडी छात्रछात्राहरूलाई पुरस्कार तथा प्रमाणपत्र वितरण गरिने वृहत् कार्यक्रम यही असार ५ गते विद्यालयको प्राङ्गणमा आयोजना हुन गइरहेकाले सम्पूर्ण अभिभावक तथा खेलप्रेमी महानुभावहरूलाई उपस्थितिको लागि हार्दिक निमन्त्रणा गर्दछौँ।"
    },
    {
      id: "5",
      titleEn: "SEE Examination Marksheet Download & Archive 2081",
      titleNp: "एस.ई.ई. परीक्षा २०८१ को शैक्षिक लब्धाङ्क पत्र डाउनलोड सम्बन्धी सूचना",
      date: "2083-03-25",
      category: "Results",
      isPinned: false,
      contentEn: "Official academic marksheets for the SEE batches of 2081 are ready for download. Students can insert their Roll Numbers directly into the Results tab on this portal to generate a digital marksheet copy. Hardcopies are available at administration desks.",
      contentNp: "२०८१ सालको एस.ई.ई. परीक्षा उत्तीर्ण विद्यार्थीहरूको शैक्षिक लब्धाङ्क पत्र (Marksheet) यस विद्यालयको वेबसाइटमा उपलब्ध गराइएको छ। विद्यार्थीहरूले नतिजा ट्याबमा गई आफ्नो रोल नम्बर प्रविष्ट गरेर डिजिटल मार्कसिट डाउनलोड गर्न सक्नुहुनेछ।"
    }
  ];

  // Filtering notices
  const filteredNotices = noticesData
    .filter((notice) => {
      // Category filter
      if (activeCategory !== "All" && notice.category !== activeCategory) return false;
      
      // Search filter
      const searchStr = `${notice.titleEn} ${notice.titleNp} ${notice.contentEn} ${notice.contentNp}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // Sorting notices
      if (sortBy === "pinned") {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }
      
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "oldest" ? dateA - dateB : dateB - dateA;
    });

  const categories = ["All", "Exam", "Holiday", "Event", "Admission", "Results"];

  // Helper to trigger print dialog for the browser
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="text-center flex flex-col items-center mb-10 no-print">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("INFORMATION BOARD", "महत्वपूर्ण सूचना पाटी")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("Official Notice Board", "सूचना बोर्ड")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Stay updated with recent notices, academic schedules, exam timetables, and holidays.",
            "परीक्षा तालिका, बिदा तथा भर्ना सम्बन्धी आधिकारिक सूचनाहरू यहाँ प्राप्त गर्नुहोस्।"
          )}
        </p>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print-only text-center border-b-2 border-black pb-4 mb-8">
        <h1 className="text-3xl font-bold font-serif text-black uppercase">Shree Jiveen Shakti Secondary School</h1>
        <p className="text-sm font-sans">Punarbas-9, Sitabasti, Kanchanpur, Nepal</p>
        <h2 className="text-xl font-bold font-serif mt-4 uppercase border-y border-black py-1">Official Board Notices</h2>
      </div>

      {/* Search & Configuration Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white border border-[#c9a227]/30 rounded-lg p-4 mb-6 shadow-sm parchment-glow no-print">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-[#444444]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search notices...", "सूचना खोज्नुहोस्...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-[#c9a227]/30 rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30"
          />
        </div>

        {/* Configurations */}
        <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#444444]/60 font-semibold">{t("Sort by:", "क्रमबद्ध:")}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-[#c9a227]/30 bg-white rounded p-1.5 focus:outline-none font-semibold text-[#1a3a2a]"
            >
              <option value="pinned">{t("Priority (Pinned)", "प्राथमिकता (पिन)")}</option>
              <option value="newest">{t("Newest First", "नयाँ पहिले")}</option>
              <option value="oldest">{t("Oldest First", "पुरानो पहिले")}</option>
            </select>
          </div>

          {/* Toggle View Mode */}
          <div className="flex border border-[#c9a227]/30 rounded overflow-hidden">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 cursor-pointer ${
                viewMode === "card" ? "bg-[#1a3a2a] text-[#c9a227]" : "bg-white text-[#444444]"
              }`}
              title="Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 cursor-pointer ${
                viewMode === "list" ? "bg-[#1a3a2a] text-[#c9a227]" : "bg-white text-[#444444]"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-2 bg-[#1a3a2a] text-white rounded font-bold hover:bg-[#102419] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#c9a227]" />
            <span>{t("Print Board", "सूचना छाप्नुहोस्")}</span>
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8 no-print justify-center md:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans cursor-pointer transition-all border ${
              activeCategory === cat
                ? "bg-[#8b1a1a] text-white border-[#c9a227] shadow"
                : "bg-white border-[#c9a227]/25 text-[#444444] hover:bg-[#8b1a1a]/5 hover:text-[#8b1a1a]"
            }`}
          >
            {cat === "All"
              ? t("All Notices", "सबै सूचनाहरू")
              : cat === "Exam"
              ? t("Examinations", "परीक्षा सूचना")
              : cat === "Holiday"
              ? t("Holidays", "बिदा")
              : cat === "Event"
              ? t("School Events", "कार्यक्रमहरू")
              : cat === "Admission"
              ? t("Admissions", "भर्ना सूचना")
              : t("Results Archive", "नतिजा")}
          </button>
        ))}
      </div>

      {/* Notices Listings */}
      {filteredNotices.length === 0 ? (
        <div className="bg-white border border-[#c9a227]/30 rounded-lg p-12 text-center parchment-glow font-serif">
          <Bell className="w-8 h-8 text-[#c9a227] mx-auto opacity-50 mb-3" />
          <p>{t("No notices found matching search criteria.", "यस श्रेणीमा कुनै सूचनाहरू फेला परेनन्।")}</p>
        </div>
      ) : viewMode === "card" ? (
        /* CARD VIEW */
        <div className="grid sm:grid-cols-2 gap-6 print:grid-cols-1">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white border rounded-lg p-5 flex flex-col justify-between shadow-sm relative parchment-glow print:shadow-none print:border-black ${
                notice.isPinned ? "border-[#c9a227] ring-1 ring-[#c9a227]/35" : "border-[#c9a227]/30"
              }`}
            >
              {/* Pinned Icon */}
              {notice.isPinned && (
                <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#c9a227] text-[#1a3a2a] p-1.5 rounded-full shadow border border-[#1a3a2a]/20">
                  <Pin className="w-3.5 h-3.5 fill-[#1a3a2a]" />
                </div>
              )}

              <div className="flex flex-col">
                {/* Category Badge & Date */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-[#8b1a1a]/15 text-[#8b1a1a] text-[9px] font-bold uppercase rounded tracking-wider border border-[#8b1a1a]/15">
                    {t(notice.category, notice.category === "Exam" ? "परीक्षा" : notice.category === "Holiday" ? "बिदा" : notice.category === "Event" ? "कार्यक्रम" : notice.category === "Admission" ? "भर्ना" : "नतिजा")}
                  </span>
                  <span className="text-[10px] text-[#444444]/60 font-semibold font-sans">
                    {getDualCalendarString(notice.date, language)}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#1a3a2a] font-serif leading-snug">
                  {t(notice.titleEn, notice.titleNp)}
                </h3>

                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed mt-3 font-sans">
                  {t(notice.contentEn, notice.contentNp)}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-[#c9a227]/10 flex justify-between items-center no-print">
                <button
                  onClick={() => window.print()}
                  className="text-xs font-bold text-[#1a3a2a] hover:text-[#c9a227] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3 h-3 text-[#c9a227]" />
                  <span>{t("Print Notice", "प्रिन्ट")}</span>
                </button>
                
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-bold text-[#444444]/40 hover:text-[#1a3a2a] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>{t("Download PDF", "पि.डि.एफ.")}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white border border-[#c9a227]/30 rounded-lg shadow-sm overflow-hidden divide-y divide-[#c9a227]/10 parchment-glow print:border-black">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-5 flex flex-col md:flex-row gap-4 items-start justify-between relative hover:bg-[#1a3a2a]/5 transition-colors ${
                notice.isPinned ? "bg-[#c9a227]/5" : ""
              }`}
            >
              <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  {notice.isPinned && <Pin className="w-3.5 h-3.5 text-[#c9a227] fill-[#c9a227]" />}
                  <span className="px-1.5 py-0.5 bg-[#8b1a1a]/15 text-[#8b1a1a] text-[8px] font-bold uppercase rounded border border-[#8b1a1a]/15">
                    {t(notice.category, notice.category)}
                  </span>
                  <span className="text-[10px] text-[#444444]/60 font-semibold">
                    {getDualCalendarString(notice.date, language)}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#1a3a2a] font-serif">
                  {t(notice.titleEn, notice.titleNp)}
                </h3>
                <p className="text-xs text-[#444444] mt-1 max-w-3xl line-clamp-2">
                  {t(notice.contentEn, notice.contentNp)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-3 md:mt-0 shrink-0 no-print text-xs font-semibold font-sans">
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-[#c9a227]/30 hover:bg-[#1a3a2a] hover:text-[#c9a227] text-[#1a3a2a] rounded cursor-pointer transition-colors"
                  title="Print Notice"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DhakaDivider />
    </div>
  );
}
