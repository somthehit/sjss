"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Menu, Lock } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function OrbitalNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setSettings(json.data);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const navItems = [
    { href: "/", labelEn: "Home", labelNp: "गृहपृष्ठ" },
    { href: "/about", labelEn: "About Us", labelNp: "हाम्रो बारे" },
    { href: "/academics", labelEn: "Academics", labelNp: "शैक्षिक कार्यक्रम" },
    { href: "/faculty", labelEn: "Faculty & Staff", labelNp: "शिक्षक-कर्मचारी" },
    { href: "/notices", labelEn: "Notice Board", labelNp: "सूचना पाटी" },
    { href: "/gallery", labelEn: "Gallery", labelNp: "तस्विर सङ्ग्रह" },
    { href: "/contact", labelEn: "Contact Us", labelNp: "सम्पर्क" },
    { href: "/admission", labelEn: "Admission", labelNp: "भर्ना" },
    { href: "/results", labelEn: "Results", labelNp: "परीक्षा फल" },
  ];

  // Close drawer on route change or Escape press
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLangToggle = () => {
    setLanguage(language === "EN" ? "NP" : "EN");
  };

  const isAdminPage = pathname?.startsWith("/admin");
  if (isAdminPage) return null;

  return (
    <div className="no-print">
      {/* Floating Orbital Nav Button Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#1a3a2a] text-white flex items-center justify-center cursor-pointer shadow-2xl border-2 border-[#c9a227] z-50 focus:outline-none hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        {/* Monogram or Hamburger on state */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-[#c9a227]" />
            </motion.div>
          ) : (
            <motion.div
              key="monogram"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center font-serif"
            >
              {settings.logo_url ? (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <>
                  <span className="text-[#c9a227] text-xs font-bold leading-none">JSS</span>
                  <span className="text-white text-[9px] font-medium leading-none tracking-widest">NP</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Animated Gold Orbital Ring */}
        <span className="absolute inset-0 rounded-full border border-[#c9a227] opacity-60 scale-110 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
      </motion.button>

      {/* Side Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#102419] backdrop-blur-sm z-40"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1a3a2a] text-white border-l-2 border-[#c9a227] shadow-2xl z-40 flex flex-col p-8 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex flex-col items-center gap-4 py-8 border-b border-[#c9a227]/30 text-center shrink-0">
                {settings.logo_url ? (
                  <div className="w-20 h-20 rounded-full border-2 border-[#c9a227] flex items-center justify-center bg-[#102419] overflow-hidden">
                    <img src={settings.logo_url} alt="School Logo" className="w-full h-full object-contain bg-white" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-[#c9a227] flex items-center justify-center bg-[#102419] font-serif text-[#c9a227] font-extrabold text-lg">
                    JSSS
                  </div>
                )}
                <div className="flex flex-col font-serif">
                  <h2 className="text-xl font-bold text-[#c9a227] tracking-wide">
                    {t("Shree Jiveen Shakti", "श्री जिविन शक्ति")}
                  </h2>
                  <p className="text-sm text-white/80">
                    {t("Secondary School", "माध्यमिक विद्यालय")}
                  </p>
                  <p className="text-xs text-white/60 mt-1 italic">
                    {t("Kanchanpur, Nepal", "कञ्चनपुर, नेपाल")}
                  </p>
                </div>
              </div>

              {/* Navigation Link List (Editorial Magazine Style) */}
              <ul className="flex-grow flex flex-col gap-4 py-8 pl-4 pr-2 font-serif text-lg leading-relaxed">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex flex-col py-1.5 transition-all group pl-4 relative ${
                          isActive
                            ? "text-[#c9a227] font-bold border-l-4 border-[#c9a227] -ml-4 pl-4"
                            : "text-white/80 hover:text-[#c9a227] hover:translate-x-2"
                        }`}
                      >
                        <span className="text-xl md:text-2xl leading-none">
                          {t(item.labelEn, item.labelNp)}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-[#c9a227]/60 group-hover:text-[#c9a227]/90 transition-colors font-sans mt-0.5">
                          {t(item.labelNp, item.labelEn)}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Drawer Footer controls */}
              <div className="mt-auto pt-6 border-t border-[#c9a227]/30 flex items-center justify-between shrink-0">
                {/* Language switch */}
                <button
                  onClick={handleLangToggle}
                  className="flex items-center gap-2 py-2 px-4 rounded border border-[#c9a227]/40 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#1a3a2a] transition-all cursor-pointer font-sans text-xs font-semibold uppercase tracking-wider"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "EN" ? "नेपाली (NP)" : "ENGLISH (EN)"}</span>
                </button>

                {/* Admin CMS redirect */}
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t("Staff Portal", "कर्मचारी पोर्टल")}</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
