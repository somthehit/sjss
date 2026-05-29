"use client";

import React, { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [announcementEN, setAnnouncementEN] = useState("");
  const [announcementNP, setAnnouncementNP] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(json => {
      if (json.success && json.data) {
        const s = json.data;
        const en = s.announcement_text_en || "SEE Examination Results 2081 are out! | Admissions for Academic Year 2083 are now open!";
        const np = s.announcement_text_np || "एस.ई.ई. परीक्षा नतिजा २०८१ प्रकाशित भएको छ! | शैक्षिक वर्ष २०८३ को लागि भर्ना खुला गरिएको छ!";
        setAnnouncementEN(en);
        setAnnouncementNP(np);
        const enabled = s.announcement_visible !== 'false';
        if (enabled && !localStorage.getItem("announcement_dismissed")) {
          setIsVisible(true);
        }
      }
    }).catch(() => {});
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="no-print relative w-full bg-[#8b1a1a] text-white py-2 px-4 flex items-center justify-between overflow-hidden border-b border-[#c9a227] z-50">
      <div className="flex items-center gap-2 flex-grow max-w-7xl mx-auto overflow-hidden">
        <div className="flex items-center gap-1.5 text-[#c9a227] shrink-0 font-semibold text-sm">
          <Megaphone className="w-4 h-4 animate-bounce" />
          <span>{t("URGENT:", "महत्वपूर्ण सूचना:")}</span>
        </div>

        <div className="relative flex overflow-x-hidden w-full font-medium text-xs md:text-sm">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            <span className="mx-4">{t(announcementEN, announcementNP)}</span>
            <span className="mx-4">{t(announcementEN, announcementNP)}</span>
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8">
            <span className="mx-4">{t(announcementEN, announcementNP)}</span>
            <span className="mx-4">{t(announcementEN, announcementNP)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        className="text-white/80 hover:text-white transition-colors cursor-pointer shrink-0 ml-4 hover:bg-white/10 p-1 rounded-full"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
