"use client";

import React, { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function PopupNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [noticeEN, setNoticeEN] = useState("");
  const [noticeNP, setNoticeNP] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(json => {
      if (json.success && json.data) {
        const s = json.data;
        const enabled = s.popup_notice_enabled === 'true';
        const en = s.popup_notice_en || "";
        const np = s.popup_notice_np || "";
        setNoticeEN(en);
        setNoticeNP(np);
        if (enabled && en && !localStorage.getItem("popup_notice_dismissed")) {
          setIsOpen(true);
        }
      }
    }).catch(() => {});
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("popup_notice_dismissed", "true");
  };

  if (!isOpen || !noticeEN) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4" onClick={handleDismiss}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 text-[#1a3a2a]">
          <div className="bg-[#1a3a2a]/10 p-2.5 rounded-full">
            <Bell className="w-6 h-6 text-[#c9a227]" />
          </div>
          <h2 className="text-xl font-bold font-serif">{t("Notice", "सूचना")}</h2>
        </div>

        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-sans">
          {t(noticeEN, noticeNP)}
        </div>

        <button
          onClick={handleDismiss}
          className="mt-6 w-full bg-[#1a3a2a] text-white py-2.5 rounded-lg font-bold hover:bg-[#2a5a4a] transition-colors"
        >
          {t("OK, Got it", "ठिक छ, बुझियो")}
        </button>
      </div>
    </div>
  );
}
