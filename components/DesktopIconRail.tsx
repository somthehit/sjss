"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Home,
  Info,
  BookOpen,
  Users,
  Bell,
  Image as ImageIcon,
  Mail,
  GraduationCap,
  ClipboardList,
  Lock,
  Globe,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function DesktopIconRail() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
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
    { href: "/", icon: Home, labelEn: "Home", labelNp: "गृहपृष्ठ" },
    { href: "/about", icon: Info, labelEn: "About Us", labelNp: "हाम्रो बारे" },
    { href: "/academics", icon: BookOpen, labelEn: "Academics", labelNp: "शैक्षिक कार्यक्रम" },
    { href: "/faculty", icon: Users, labelEn: "Faculty & Staff", labelNp: "शिक्षक-कर्मचारी" },
    { href: "/notices", icon: Bell, labelEn: "Notice Board", labelNp: "सूचना पाटी" },
    { href: "/gallery", icon: ImageIcon, labelEn: "Gallery", labelNp: "तस्विर सङ्ग्रह" },
    { href: "/contact", icon: Mail, labelEn: "Contact Us", labelNp: "सम्पर्क" },
    { href: "/admission", icon: GraduationCap, labelEn: "Admission", labelNp: "भर्ना" },
    { href: "/results", icon: ClipboardList, labelEn: "Results", labelNp: "परीक्षा फल" },
  ];

  const handleLanguageToggle = () => {
    setLanguage(language === "EN" ? "NP" : "EN");
  };

  // Hide left rail in admin panel pages for a cleaner CMS experience
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;

  return (
    <motion.aside
      className="hidden md:flex fixed top-0 left-0 h-screen z-40 bg-[#1a3a2a] text-white flex-col border-r border-[#c9a227] shadow-xl no-print"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      animate={{ width: isExpanded ? 240 : 72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      {/* Monogram Seal / Logo Section */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-[#c9a227]/30 h-[120px] shrink-0">
        <Link href="/" className="flex items-center gap-3">
          {settings.logo_url ? (
            <div className="w-12 h-12 rounded-full border-2 border-[#c9a227] flex items-center justify-center bg-[#102419] shrink-0 overflow-hidden">
              <img src={settings.logo_url} alt="School Logo" className="w-full h-full object-contain bg-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-[#c9a227] flex items-center justify-center bg-[#102419] font-serif text-[#c9a227] font-extrabold text-sm shrink-0">
              JSSS
            </div>
          )}
          
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col font-serif leading-none"
            >
              <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider mb-1">Shree Jiveen</span>
              <span className="text-white text-xs font-medium opacity-90 mb-1">Shakti Sec. School</span>
              {settings.emis && (
                <span className="text-white/60 text-[10px] font-sans">EMIS: {settings.emis}</span>
              )}
              {settings.school_code && (
                <span className="text-white/60 text-[10px] font-sans">Code: {settings.school_code}</span>
              )}
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow flex flex-col gap-1.5 py-6 px-3.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 py-3 px-3 rounded-lg transition-all duration-200 relative group cursor-pointer ${
                isActive
                  ? "bg-[#c9a227]/25 text-[#c9a227] font-semibold border-l-4 border-[#c9a227]"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isExpanded ? (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-sans truncate"
                >
                  {t(item.labelEn, item.labelNp)}
                </motion.span>
              ) : (
                /* Tooltip when rail is collapsed */
                <span className="absolute left-16 bg-[#102419] text-[#c9a227] text-xs py-1 px-2.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-[#c9a227]/25 z-50">
                  {t(item.labelEn, item.labelNp)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Language Toggle & Admin Panel Access */}
      <div className="p-3.5 border-t border-[#c9a227]/30 flex flex-col gap-2 shrink-0">
        {/* Language Switcher */}
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-4 py-2.5 px-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer w-full text-left"
        >
          <Globe className="w-5 h-5 shrink-0 text-[#c9a227]" />
          {isExpanded ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-semibold"
            >
              {language === "EN" ? "नेपाली (NP)" : "English (EN)"}
            </motion.span>
          ) : (
            <span className="absolute left-16 bg-[#102419] text-[#c9a227] text-xs py-1 px-2.5 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-[#c9a227]/25 z-50">
              {language === "EN" ? "Switch to Nepali" : "English मा जानुहोस्"}
            </span>
          )}
        </button>

        {/* Admin Link */}
        <Link
          href="/admin/login"
          className="flex items-center gap-4 py-2.5 px-3 rounded-lg text-white/50 hover:text-white hover:bg-[#8b1a1a]/25 hover:text-[#8b1a1a] transition-all cursor-pointer"
        >
          <Lock className="w-5 h-5 shrink-0" />
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs uppercase tracking-wider"
            >
              {t("Staff Portal", "कर्मचारी पोर्टल")}
            </motion.span>
          )}
        </Link>
      </div>
    </motion.aside>
  );
}
