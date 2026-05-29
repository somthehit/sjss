"use client";

import React, { useState, useRef, useEffect } from "react";
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

interface SchoolInfo {
  phone: string;
  email: string;
  emis: string;
  schoolCode: string;
  addressEn: string;
  addressNp: string;
}

export default function Notices() {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "pinned">("pinned");
  const [noticesData, setNoticesData] = useState<Notice[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    phone: '+977-99-420XXX',
    email: 'info@sjss.edu.np',
    emis: 'EMIS-00000',
    schoolCode: 'SC-0000',
    addressEn: 'Punarbas-9, Sitabasti, Kanchanpur, Nepal',
    addressNp: 'पुनर्बास-९, सिताबस्ती, कञ्चनपुर, नेपाल',
  });
  const [printNoticeId, setPrintNoticeId] = useState<string | null>(null);
  const printTriggerRef = useRef(false);

  React.useEffect(() => {
    fetch('/api/notices')
      .then(res => res.ok ? res.json() : { data: [] })
      .then(json => {
        const mapped = (json.data || []).map((n: any) => ({
          id: n.id,
          titleEn: n.title_en,
          titleNp: n.title_np,
          date: n.published_at || n.created_at || new Date().toISOString(),
          category: n.category,
          isPinned: n.is_pinned,
          contentEn: n.content_en,
          contentNp: n.content_np,
        }));
        setNoticesData(mapped);
      })
      .catch(console.error);
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : { data: {} })
      .then(json => {
        const s = json.data || {};
        if (s.phone || s.email || s.emis || s.school_code) {
          setSchoolInfo({
            phone: s.phone || '+977-99-420XXX',
            email: s.email || 'info@sjss.edu.np',
            emis: s.emis || 'EMIS-00000',
            schoolCode: s.school_code || 'SC-0000',
            addressEn: s.address_en || 'Punarbas-9, Sitabasti, Kanchanpur, Nepal',
            addressNp: s.address_np || 'पुनर्बास-९, सिताबस्ती, कञ्चनपुर, नेपाल',
          });
        }
      })
      .catch(console.error);
  }, []);

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

  // Helper to trigger print dialog for selected notice
  const handlePrintNotice = (notice: Notice) => {
    setPrintNoticeId(notice.id);
    printTriggerRef.current = true;
  };

  const handlePrintBoard = () => {
    setPrintNoticeId("__all__");
    printTriggerRef.current = true;
  };

  // Trigger print after state update
  useEffect(() => {
    if (printTriggerRef.current) {
      printTriggerRef.current = false;
      setTimeout(() => {
        window.print();
      }, 100);
    }
  }, [printNoticeId]);

  // Clean up print state after print dialog closes
  useEffect(() => {
    const handle = () => setPrintNoticeId(null);
    window.addEventListener("afterprint", handle);
    return () => window.removeEventListener("afterprint", handle);
  }, []);

  const formatDateNp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = ["वैशाख","जेठ","असार","साउन","भदौ","असोज","कात्तिक","मङ्सिर","पुस","माघ","फागुन","चैत"];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } catch { return dateStr; }
  };

  const formatDateEn = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch { return dateStr; }
  };

  const getNoticeHTML = (notice: Notice, info: SchoolInfo): string => {
    const catLabel = notice.category === "Exam" ? "परीक्षा" : notice.category === "Holiday" ? "बिदा" : notice.category === "Event" ? "कार्यक्रम" : notice.category === "Admission" ? "भर्ना" : "नतिजा";
    const dateStr = language === "NP" ? formatDateNp(notice.date) : formatDateEn(notice.date);
    const title = language === "NP" ? notice.titleNp : notice.titleEn;
    const content = language === "NP" ? notice.contentNp : notice.contentEn;
    const pinnedBadge = notice.isPinned ? '★ PINNED' : '';
    const officialNoticeLabel = language === "NP" ? "आधिकारिक सूचना" : "Official Notice";
    const footerNote = language === "NP" ? "यो कम्प्युटरबाट तयार गरिएको सूचना हो।" : "This is a computer-generated notice.";
    return `
      <div style="max-width:700px;margin:40px auto;font-family:Georgia,serif;color:#1a3a2a;">
        <div style="text-align:center;border-bottom:2px solid #1a3a2a;padding-bottom:16px;margin-bottom:24px;">
          <h1 style="font-size:22px;font-weight:bold;margin:0;text-transform:uppercase;">Shree Jiveen Shakti Secondary School</h1>
          <p style="font-size:13px;color:#555;margin:4px 0;">${info.addressEn}</p>
          <p style="font-size:12px;color:#777;">Phone: ${info.phone} | Email: ${info.email}</p>
          <p style="font-size:11px;color:#777;">EMIS: ${info.emis} | School Code: ${info.schoolCode}</p>
        </div>
        <h2 style="font-size:18px;font-weight:bold;text-align:center;text-transform:uppercase;border-top:1px solid #1a3a2a;border-bottom:1px solid #1a3a2a;padding:8px 0;margin-bottom:24px;">${officialNoticeLabel}</h2>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:11px;font-weight:bold;text-transform:uppercase;color:#8b1a1a;background:#8b1a1a10;padding:2px 8px;border-radius:4px;">${catLabel}</span>
          ${pinnedBadge ? `<span style="font-size:11px;font-weight:bold;color:#c9a227;">${pinnedBadge}</span>` : ''}
          <span style="font-size:11px;color:#888;margin-left:auto;">${dateStr}</span>
        </div>
        <h3 style="font-size:16px;font-weight:bold;margin:12px 0 8px;">${title}</h3>
        <p style="font-size:13px;color:#444;line-height:1.6;white-space:pre-line;">${content}</p>
        <div style="margin-top:32px;padding-top:12px;border-top:1px solid #ccc;text-align:center;font-size:11px;color:#999;">
          <p>${footerNote}</p>
        </div>
      </div>
    `;
  };

  const handleDownloadPDF = (notice: Notice) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Notice - ${notice.titleEn}</title></head><body>${getNoticeHTML(notice, schoolInfo)}</body></html>`;
    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) { alert('Pop-up blocked! Please allow pop-ups for this site.'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
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
            onClick={handlePrintBoard}
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
                  onClick={() => handlePrintNotice(notice)}
                  className="text-xs font-bold text-[#1a3a2a] hover:text-[#c9a227] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3 h-3 text-[#c9a227]" />
                  <span>{t("Print Notice", "प्रिन्ट")}</span>
                </button>
                
                <button
                  onClick={() => handleDownloadPDF(notice)}
                  className="text-xs font-bold text-[#444444]/40 hover:text-[#1a3a2a] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>{t("Download PDF", "पि.डि.एफ.")}</span>
                </button>
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
                  onClick={() => handlePrintNotice(notice)}
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

      {/* Print-only formatted notice */}
      {printNoticeId && (
        <div className="print-formatted">
          {/* School letterhead */}
          <div className="text-center border-b-2 border-[#1a3a2a] pb-4 mb-6">
            <h1 className="text-2xl font-bold font-serif text-[#1a3a2a] uppercase">Shree Jiveen Shakti Secondary School</h1>
            <p className="text-sm text-gray-600">{schoolInfo.addressEn}</p>
            <p className="text-xs text-gray-500">Phone: {schoolInfo.phone} | Email: {schoolInfo.email}</p>
            <p className="text-xs text-gray-500">EMIS: {schoolInfo.emis} | School Code: {schoolInfo.schoolCode}</p>
          </div>

          <h2 className="text-lg font-bold font-serif text-center uppercase mb-6 border-y border-[#1a3a2a] py-2">
            {t("Official Notice", "आधिकारिक सूचना")}
          </h2>

          {printNoticeId === "__all__"
            ? filteredNotices.map((n) => (
                <div key={n.id} className="mb-8 pb-6 border-b border-gray-300 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase text-[#8b1a1a] bg-[#8b1a1a]/10 px-2 py-0.5 rounded">{t(n.category, n.category)}</span>
                    {n.isPinned && <span className="text-xs font-bold text-[#c9a227]">★ {t("PINNED", "पिन गरिएको")}</span>}
                    <span className="text-xs text-gray-500 ml-auto">{language === "NP" ? formatDateNp(n.date) : formatDateEn(n.date)}</span>
                  </div>
                  <h3 className="text-base font-bold font-serif text-[#1a3a2a]">{t(n.titleEn, n.titleNp)}</h3>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">{t(n.contentEn, n.contentNp)}</p>
                </div>
              ))
            : (() => {
                const n = noticesData.find((x) => x.id === printNoticeId);
                if (!n) return null;
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold uppercase text-[#8b1a1a] bg-[#8b1a1a]/10 px-2 py-0.5 rounded">{t(n.category, n.category)}</span>
                      {n.isPinned && <span className="text-xs font-bold text-[#c9a227]">★ {t("PINNED", "पिन गरिएको")}</span>}
                      <span className="text-xs text-gray-500 ml-auto">{language === "NP" ? formatDateNp(n.date) : formatDateEn(n.date)}</span>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-[#1a3a2a]">{t(n.titleEn, n.titleNp)}</h3>
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-line">{t(n.contentEn, n.contentNp)}</p>
                    <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
                      <p>{t("This is a computer-generated notice.", "यो कम्प्युटरबाट तयार गरिएको सूचना हो।")}</p>
                    </div>
                  </div>
                );
              })()}
        </div>
      )}

      <style>{`
        @media print {
          body { visibility: hidden; background: white !important; }
          .print-formatted, .print-formatted * { visibility: visible; }
          .print-formatted { display: block !important; position: absolute; top: 0; left: 5%; right: 5%; }
        }
      `}</style>
    </div>
  );
}
