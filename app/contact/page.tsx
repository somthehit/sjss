"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const activeErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      activeErrors.name = t("Name is required", "नाम प्रविष्ट गर्न अनिवार्य छ");
    }
    if (!formData.email.trim()) {
      activeErrors.email = t("Email is required", "इमेल अनिवार्य छ");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      activeErrors.email = t("Invalid email format", "अमान्य इमेल ढाँचा");
    }
    if (!formData.message.trim()) {
      activeErrors.message = t("Message is required", "सन्देश लेख्नुहोस्");
    }
    return activeErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeErrors = validate();
    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
    } else {
      setErrors({});
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full no-print">
      {/* Title */}
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("CONNECT WITH US", "सम्पर्क तथा सुझाव")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("Contact Our Administration", "सम्पर्क राख्नुहोस्")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Reach out for inquiries, admissions, curriculum concerns, or general feedback.",
            "भर्ना सम्बन्धी सोधपुछ, सल्लाह वा सुझावका लागि विद्यालय प्रशासनमा सम्पर्क गर्न सक्नुहुनेछ।"
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Left Side: Contact Information Cards */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow flex items-start gap-4">
            <div className="p-3 bg-[#1a3a2a]/5 text-[#c9a227] border border-[#c9a227]/25 rounded-full shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#1a3a2a] font-serif uppercase tracking-wider">{t("Our Address", "ठेगाना")}</span>
              <span className="text-xs text-[#444444] leading-relaxed mt-1 font-sans">
                {t("Punarbas-9, Sitabasti, Kanchanpur District, Sudurpaschim Province, Nepal", "पुनर्वास-९, सिताबस्ती, कञ्चनपुर जिल्ला, सुदूरपश्चिम प्रदेश, नेपाल")}
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow flex items-start gap-4">
            <div className="p-3 bg-[#1a3a2a]/5 text-[#c9a227] border border-[#c9a227]/25 rounded-full shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#1a3a2a] font-serif uppercase tracking-wider">{t("Phone Numbers", "सम्पर्क फोन नम्बर")}</span>
              <span className="text-xs text-[#444444] leading-relaxed mt-1 font-sans">
                {t("+977-99-XXXXXX (General)", "+९७७-९९-XXXXXX (प्रशासन शाखा)")}
                <br />
                {t("+977-98XXXXXXXX (Principal Desk)", "+९७७-९८XXXXXXXX (प्रधानाध्यापक कक्ष)")}
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow flex items-start gap-4">
            <div className="p-3 bg-[#1a3a2a]/5 text-[#c9a227] border border-[#c9a227]/25 rounded-full shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#1a3a2a] font-serif uppercase tracking-wider">{t("Email Addresses", "इमेल ठेगाना")}</span>
              <span className="text-xs text-[#444444] leading-relaxed mt-1 font-sans">
                info@sjss.edu.np
                <br />
                principal@sjss.edu.np
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow flex items-start gap-4">
            <div className="p-3 bg-[#1a3a2a]/5 text-[#c9a227] border border-[#c9a227]/25 rounded-full shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#1a3a2a] font-serif uppercase tracking-wider">{t("Office Timings", "कार्यालय समय")}</span>
              <span className="text-xs text-[#444444] leading-relaxed mt-1 font-sans font-semibold text-[#8b1a1a]">
                {t("Sunday - Thursday: 10:00 AM - 4:00 PM", "आइतबार देखि बिहीबार: बिहान १०:०० देखि दिउँसो ४:०० सम्म")}
                <br />
                {t("Friday: 10:00 AM - 1:00 PM (Half Day)", "शुक्रबार: बिहान १०:०० देखि दिउँसो १:०० बजेसम्म (आधा दिन)")}
                <br />
                {t("Saturday: Closed (Weekly Holiday)", "शनिबार: बन्द (साप्ताहिक बिदा)")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="md:col-span-3 bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-6">
            {t("Send Us a Message", "सन्देश वा सुझाव पठाउनुहोस्")}
          </h2>

          {isSubmitted ? (
            <div className="text-center py-10 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-[#1a3a2a] mb-4" />
              <h3 className="text-lg font-bold font-serif text-[#1a3a2a]">
                {t("Message Submitted Successfully!", "सन्देश सफलतापूर्वक प्राप्त भयो!")}
              </h3>
              <p className="text-xs sm:text-sm text-[#444444]/80 mt-2 font-sans max-w-sm">
                {t(
                  "Thank you for contacting Shree Jiveen Shakti Secondary School. Our school administrators will review your inquiry shortly.",
                  "हामीलाई सम्पर्क गर्नुभएकोमा धन्यवाद। विद्यालय प्रशासनले यहाँको सन्देश समीक्षा गरी यथाशीघ्र सम्पर्क राख्नेछ।"
                )}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 px-6 py-2.5 bg-[#1a3a2a] text-white border border-[#c9a227] font-semibold text-xs uppercase tracking-wider rounded cursor-pointer"
              >
                {t("Send Another Message", "अर्को सन्देश पठाउनुहोस्")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Full Name *", "पूरा नाम *")}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2.5 border rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30 ${
                      errors.name ? "border-[#8b1a1a]" : "border-[#c9a227]/30"
                    }`}
                  />
                  {errors.name && <span className="text-[#8b1a1a] text-[10px] font-semibold">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Email Address *", "इमेल ठेगाना *")}</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full p-2.5 border rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30 ${
                      errors.email ? "border-[#8b1a1a]" : "border-[#c9a227]/30"
                    }`}
                  />
                  {errors.email && <span className="text-[#8b1a1a] text-[10px] font-semibold">{errors.email}</span>}
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">{t("Contact Number (Optional)", "सम्पर्क फोन नम्बर (ऐच्छिक)")}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-[#c9a227]/30 rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">{t("Your Message *", "सन्देश विवरण *")}</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full p-2.5 border rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30 ${
                    errors.message ? "border-[#8b1a1a]" : "border-[#c9a227]/30"
                  }`}
                />
                {errors.message && <span className="text-[#8b1a1a] text-[10px] font-semibold">{errors.message}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 w-full py-3 bg-[#1a3a2a] text-white border border-[#c9a227] font-semibold uppercase tracking-wider rounded cursor-pointer hover:bg-[#102419] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#c9a227]" />
                <span>{t("Submit Inquiry", "सन्देश पठाउनुहोस्")}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <DhakaDivider />

      {/* SECTION 3: MAP CONTAINER (High fidelity custom graphical SVG map layout instead of heavy google maps loading) */}
      <section className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-md parchment-glow text-center">
        <h3 className="text-base font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-4 uppercase tracking-wider">
          {t("Our Physical Location in Punarbas", "भौगोलिक अवस्थिति नक्सा")}
        </h3>
        
        {/* Breathtaking Map SVG Layout showing Sitabasti and school marker */}
        <div className="w-full h-80 rounded border border-[#c9a227]/25 bg-gradient-to-br from-green-50 to-amber-50/20 relative flex items-center justify-center p-8 select-none">
          <svg className="absolute inset-0 w-full h-full text-green-200/50" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
            {/* Roads */}
            <path d="M0 20 L50 20 L100 50" stroke="#f0d5a3" strokeWidth="2" />
            <path d="M40 0 L40 100" stroke="#f0d5a3" strokeWidth="2" />
            <path d="M0 80 L100 80" stroke="#f0d5a3" strokeWidth="1.5" />
            {/* River */}
            <path d="M0 5 C30 5, 50 45, 100 45" stroke="#bae1ff" strokeWidth="6" />
          </svg>
          
          <div className="z-10 flex flex-col items-center">
            <div className="p-4 bg-[#8b1a1a] border-2 border-[#c9a227] rounded-full text-white shadow-lg animate-bounce">
              <MapPin className="w-8 h-8 text-[#c9a227]" />
            </div>
            <div className="mt-4 p-3 bg-white border border-[#c9a227] rounded shadow-md max-w-xs parchment-glow">
              <h4 className="font-bold text-xs text-[#1a3a2a] font-serif leading-none">Shree Jiveen Shakti Secondary School</h4>
              <p className="text-[10px] text-[#444444]/80 mt-1">{t("Sitabasti, Kanchanpur (Punarbas-9)", "सिताबस्ती, कञ्चनपुर (पुनर्वास वडा नं. ९)")}</p>
            </div>
          </div>

          {/* Interactive Info Marker */}
          <div className="absolute bottom-4 right-4 bg-[#102419] text-white border border-[#c9a227] px-3 py-1.5 rounded text-[10px] font-sans">
            <span>{t("Kanchanpur District, Sudurpaschim", "कञ्चनपुर जिल्ला, सुदूरपश्चिम प्रदेश")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
