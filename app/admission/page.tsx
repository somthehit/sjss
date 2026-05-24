"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import {
  Sparkles,
  ClipboardList,
  FileCheck,
  Search,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Send,
  Loader2,
} from "lucide-react";
import { toNepaliNumerals } from "@/lib/dateConverter";

export default function Admission() {
  const { t } = useLanguage();

  // Inquiry form states
  const [formData, setFormData] = useState({
    student_name: "",
    guardian_name: "",
    grade_applying: "1",
    phone: "",
    email: "",
    address: "",
    dob: "",
    previous_school: "",
    gpa_score: "",
    message: "",
  });
  const [hasPreviousSchool, setHasPreviousSchool] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string>("");

  // Status search states
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<{
    id: string;
    student_name: string;
    status: string;
    grade_applying: string;
    submitted_at: string;
  } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSearched, setSearchSearched] = useState(false);

  const documentChecklist = [
    { itemEn: "Scanned copy of Birth Certificate", itemNp: "जन्म दर्ता प्रमाणपत्रको प्रतिलिपि" },
    { itemEn: "Transfer Certificate / Character Certificate from previous school", itemNp: "चारित्रिक प्रमाणपत्र तथा स्थानान्तरण प्रमाणपत्र (टि.सी.)" },
    { itemEn: "Grade Sheets / Transcripts of the final examination", itemNp: "विगत कक्षाको लब्धाङ्क पत्र (मार्कसिट)" },
    { itemEn: "Recent passport-sized photographs (3 copies)", itemNp: "हालसालै खिचिएको पासपोर्ट साइजको फोटो (३ प्रति)" },
    { itemEn: "Citizenship Certificate of Parent / Guardian", itemNp: "अभिभावकको नागरिकता प्रमाणपत्रको प्रतिलिपि" },
  ];

  const eligibilityCriteria = [
    { gradeEn: "Grade 1 to 5", gradeNp: "कक्षा १ देखि ५", ageEn: "5+ years", ageNp: "५ वर्ष पुगेको", criteriaEn: "Basic age screening and interview", criteriaNp: "आधारभूत अन्तर्वार्ता र उमेर परीक्षण" },
    { gradeEn: "Grade 6 to 8", gradeNp: "कक्षा ६ देखि ८", ageEn: "10+ years", ageNp: "१० वर्ष पुगेको", criteriaEn: "Review of Class 5 CDC reports and screening test", criteriaNp: "कक्षा ५ को परीक्षा प्रतिवेदन र छनोट परीक्षा" },
    { gradeEn: "Secondary (Grade 9-10)", gradeNp: "कक्षा ९ र १०", ageEn: "13+ years", ageNp: "१३ वर्ष पुगेको", criteriaEn: "Entrance test in Mathematics, English & Science", criteriaNp: "गणित, अंग्रेजी र विज्ञान विषयको प्रवेश परीक्षा" },
    { gradeEn: "Plus Two (Grade 11-12)", gradeNp: "कक्षा ११ र १२", ageEn: "15+ years", ageNp: "१५ वर्ष पुगेको", criteriaEn: "SEE graduation with minimum GPA 2.0+", criteriaNp: "एस.ई.ई. उत्तीर्ण र न्यूनतम जी.पी.ए. २.०+" },
  ];

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.student_name.trim()) errs.student_name = t("Student name is required", "विद्यार्थीको नाम अनिवार्य छ");
    if (!formData.guardian_name.trim()) errs.guardian_name = t("Parent name is required", "अभिभावकको नाम अनिवार्य छ");
    if (!formData.phone.trim()) errs.phone = t("Phone is required", "सम्पर्क नम्बर अनिवार्य छ");
    if (!formData.address.trim()) errs.address = t("Address is required", "ठेगाना अनिवार्य छ");
    if (!formData.dob.trim()) errs.dob = t("Date of birth is required", "जन्म मिति अनिवार्य छ");
    return errs;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        previous_school: hasPreviousSchool ? formData.previous_school : null,
      };

      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(t("Submission failed. Please try again.", "आवेदन दर्ता असफल। पुनः प्रयास गर्नुहोस्।"));
        return;
      }

      // Generate a readable ID from the DB id
      const appId = `JSSS-2083-${String(json.data.id).padStart(2, "0")}`;
      setSubmittedId(appId);
      setFormSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(t("Network error. Please try again.", "नेटवर्क त्रुटि। पुनः प्रयास गर्नुहोस्।"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSearched(true);
    setSearchLoading(true);
    setSearchResult(null);

    try {
      // Parse id from JSSS-YYYY-NN or just a number
      const match = searchId.trim().match(/(\d+)$/);
      if (!match) {
        setSearchLoading(false);
        return;
      }
      const numericId = parseInt(match[1], 10);
      const res = await fetch(`/api/admissions/${numericId}`);
      const json = await res.json();

      if (res.ok && json.data) {
        setSearchResult({
          id: `JSSS-2083-${String(json.data.id).padStart(2, "0")}`,
          student_name: json.data.student_name,
          status: json.data.status,
          grade_applying: json.data.grade_applying,
          submitted_at: json.data.submitted_at,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full p-2.5 border rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30 transition-colors ${
      formErrors[field] ? "border-[#8b1a1a] bg-[#8b1a1a]/5" : "border-[#c9a227]/30"
    }`;

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full no-print">
      {/* Title */}
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("ADMISSION GATEWAY", "भर्ना सम्बन्धी जानकारी")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("Admissions & Inquiries", "नयाँ विद्यार्थी भर्ना")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Review admission eligibility criteria, checklist items, and complete the online inquiry form.",
            "शैक्षिक योग्यता, भर्ना प्रक्रिया, आवश्यक कागजात र शुल्क संरचना सम्बन्धी जानकारी।"
          )}
        </p>
      </div>

      {/* Grid: Form & Info */}
      <div className="grid md:grid-cols-5 gap-8 items-start">

        {/* Left column: Eligibility Criteria and Checklist */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Eligibility Panel */}
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow">
            <h3 className="text-base font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-5 h-5 text-[#c9a227]" />
              <span>{t("Eligibility Benchmarks", "शैक्षिक योग्यता मापदण्ड")}</span>
            </h3>
            <div className="flex flex-col gap-3 font-sans text-xs">
              {eligibilityCriteria.map((c, idx) => (
                <div key={idx} className="p-3 border border-[#c9a227]/20 rounded bg-[#fdf6e3]/30">
                  <h4 className="font-bold text-[#1a3a2a] text-sm">{t(c.gradeEn, c.gradeNp)}</h4>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-[#444444]/80">
                    <div>
                      <span className="font-bold block text-[10px] uppercase text-[#8b1a1a]">{t("Min Age:", "न्यूनतम उमेर:")}</span>
                      <span>{t(c.ageEn, c.ageNp)}</span>
                    </div>
                    <div>
                      <span className="font-bold block text-[10px] uppercase text-[#8b1a1a]">{t("Selection Mode:", "मूल्याङ्कन पद्धति:")}</span>
                      <span>{t(c.criteriaEn, c.criteriaNp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist Panel */}
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-5 shadow-sm parchment-glow">
            <h3 className="text-base font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-5 h-5 text-[#c9a227]" />
              <span>{t("Document Checklist", "आवश्यक कागजातहरू")}</span>
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-xs text-[#444444]">
              {documentChecklist.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#1a3a2a]/10 border border-[#c9a227]/30 text-[#c9a227] flex items-center justify-center shrink-0 font-bold mt-0.5">✓</span>
                  <span>{t(doc.itemEn, doc.itemNp)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column: Inquiry Form */}
        <div className="md:col-span-3 bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-6">
            {t("Online Admission Inquiry Form", "अनलाइन भर्ना सोधपुछ फारम")}
          </h2>

          {formSubmitted ? (
            <div className="text-center py-10 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-[#1a3a2a] mb-4" />
              <h3 className="text-lg font-bold font-serif text-[#1a3a2a]">
                {t("Inquiry Submitted Successfully!", "आवेदन फारम सफलतापूर्वक दर्ता भयो!")}
              </h3>
              <p className="text-xs sm:text-sm text-[#444444]/90 mt-3 font-sans max-w-md">
                {t("Your Application ID is:", "यहाँको आवेदन नम्बर (Application ID) निम्न बमोजिम छ:")}
                <strong className="text-[#8b1a1a] block font-mono text-base mt-1.5 bg-[#fdf6e3] border border-[#c9a227]/40 py-1.5 px-4 rounded inline-block">
                  {submittedId}
                </strong>
              </p>
              <p className="text-xs text-[#444444]/70 mt-3 max-w-sm">
                {t(
                  "Please save this ID to check your admission approval status on the lookup bar below.",
                  "कृपया यो नम्बर सुरक्षित राख्नुहोस्, भविष्यमा स्वीकृतिको स्थिति बुझ्न यो आवश्यक पर्नेछ।"
                )}
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({
                    student_name: "", guardian_name: "", grade_applying: "1",
                    phone: "", email: "", address: "", dob: "",
                    previous_school: "", gpa_score: "", message: "",
                  });
                  setHasPreviousSchool(false);
                }}
                className="mt-6 px-6 py-2.5 bg-[#1a3a2a] text-white border border-[#c9a227] font-semibold text-xs uppercase tracking-wider rounded cursor-pointer"
              >
                {t("Submit Another Inquiry", "नयाँ आवेदन दर्ता गर्नुहोस्")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 font-sans text-xs sm:text-sm">

              {/* Row 1: Student Name + Parent Name */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Student's Full Name *", "विद्यार्थीको पूरा नाम *")}</label>
                  <input
                    type="text"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    className={inputClass("student_name")}
                  />
                  {formErrors.student_name && <span className="text-[#8b1a1a] text-[10px] font-semibold">{formErrors.student_name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Parent / Guardian Name *", "अभिभावकको नाम *")}</label>
                  <input
                    type="text"
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    className={inputClass("guardian_name")}
                  />
                  {formErrors.guardian_name && <span className="text-[#8b1a1a] text-[10px] font-semibold">{formErrors.guardian_name}</span>}
                </div>
              </div>

              {/* Row 2: Grade + Date of Birth */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Grade Applied For *", "आवेदन कक्षा *")}</label>
                  <select
                    value={formData.grade_applying}
                    onChange={(e) => setFormData({ ...formData, grade_applying: e.target.value })}
                    className="w-full p-2.5 border border-[#c9a227]/30 rounded focus:outline-none focus:border-[#1a3a2a] bg-white font-semibold text-[#1a3a2a]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={String(g)}>
                        {t(`Grade ${g}`, `कक्षा ${toNepaliNumerals(g)}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Date of Birth *", "जन्म मिति *")}</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className={inputClass("dob")}
                  />
                  {formErrors.dob && <span className="text-[#8b1a1a] text-[10px] font-semibold">{formErrors.dob}</span>}
                </div>
              </div>

              {/* Row 3: Phone + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Contact Mobile Number *", "सम्पर्क मोबाइल नम्बर *")}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977-98XXXXXXXX"
                    className={inputClass("phone")}
                  />
                  {formErrors.phone && <span className="text-[#8b1a1a] text-[10px] font-semibold">{formErrors.phone}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">{t("Email Address", "इमेल ठेगाना")}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass("email")}
                  />
                </div>
              </div>

              {/* Row 4: Address (full width) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">{t("Current Address *", "हालको ठेगाना *")}</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t("Village/Municipality, Ward No., District", "गाउँपालिका/नगरपालिका, वडा नं., जिल्ला")}
                  className={inputClass("address")}
                />
                {formErrors.address && <span className="text-[#8b1a1a] text-[10px] font-semibold">{formErrors.address}</span>}
              </div>

              {/* Row 5: Previous Score */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">{t("Previous Score (GPA / Marks)", "अघिल्लो कक्षाको प्राप्ताङ्क (जीपीए / प्रतिशत)")}</label>
                <input
                  type="text"
                  placeholder="e.g. 3.25 GPA or 75%"
                  value={formData.gpa_score}
                  onChange={(e) => setFormData({ ...formData, gpa_score: e.target.value })}
                  className={inputClass("gpa_score")}
                />
              </div>

              {/* Row 6: Previous Institution Toggle */}
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={hasPreviousSchool}
                      onChange={(e) => setHasPreviousSchool(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      hasPreviousSchool
                        ? "bg-[#1a3a2a] border-[#1a3a2a]"
                        : "bg-white border-[#c9a227]/50 group-hover:border-[#1a3a2a]"
                    }`}>
                      {hasPreviousSchool && (
                        <svg className="w-3 h-3 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-[#1a3a2a]">
                    {t("I have studied at a previous institution", "मैले अघिल्लो संस्थामा अध्ययन गरेको छु")}
                  </span>
                </label>

                {/* Conditional Previous School Field */}
                {hasPreviousSchool && (
                  <div className="flex flex-col gap-1.5 ml-8 animate-in slide-in-from-top-2 duration-200">
                    <label className="font-semibold text-[#1a3a2a]">
                      {t("Previous Academic Institution *", "अघिल्लो अध्ययन संस्थाको नाम *")}
                    </label>
                    <input
                      type="text"
                      value={formData.previous_school}
                      onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                      placeholder={t("e.g. Sitabasti Primary School", "उदा. सिताबस्ती प्राथमिक विद्यालय")}
                      className="w-full p-2.5 border border-[#c9a227]/30 rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30"
                    />
                  </div>
                )}
              </div>

              {/* Row 7: Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">{t("Additional Message (Optional)", "थप सन्देश (वैकल्पिक)")}</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t("Any special requirements or questions...", "कुनै विशेष आवश्यकता वा प्रश्नहरू...")}
                  className="w-full p-2.5 border border-[#c9a227]/30 rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full py-3 bg-[#1a3a2a] text-white border border-[#c9a227] font-semibold uppercase tracking-wider rounded cursor-pointer hover:bg-[#102419] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 text-[#c9a227] animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-[#c9a227]" />
                )}
                <span>
                  {submitting
                    ? t("Submitting...", "बुझाउँदै छ...")
                    : t("Submit Admission Inquiry", "भर्ना सोधपुछ बुझाउनुहोस्")}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>

      <DhakaDivider />

      {/* SECTION 3: APPLICATION STATUS LOOKUP */}
      <section className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow max-w-3xl mx-auto w-full">
        <h3 className="text-lg font-bold font-serif text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-4 uppercase tracking-wider text-center flex items-center justify-center gap-2">
          <Search className="w-5 h-5 text-[#c9a227]" />
          <span>{t("Admission Status Lookup Tool", "भर्ना स्वीकृतिको स्थिति खोज्ने माध्यम")}</span>
        </h3>
        <p className="text-xs text-[#444444] text-center max-w-md mx-auto mb-6 leading-relaxed">
          {t(
            "Enter your unique Application ID (e.g. JSSS-2083-04) generated during your inquiry submission to search current approval status.",
            "सोधपुछ फारम बुझाउँदा प्राप्त भएको आवेदन नम्बर (ID) प्रविष्ट गरी आफ्नो भर्ना स्वीकृतिको अवस्था तुरुन्त हेर्नुहोस्।"
          )}
        </p>

        <form onSubmit={handleStatusSearch} className="flex gap-2 max-w-md mx-auto font-sans">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="e.g. JSSS-2083-04"
            className="flex-grow p-2.5 border border-[#c9a227]/40 rounded focus:outline-none focus:border-[#1a3a2a] bg-[#fdf6e3]/30 text-xs sm:text-sm font-mono font-bold text-[#1a3a2a]"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="px-5 py-2.5 bg-[#1a3a2a] text-white border border-[#c9a227] font-bold text-xs uppercase tracking-wider rounded cursor-pointer disabled:opacity-60"
          >
            {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Search", "खोज्नुहोस्")}
          </button>
        </form>

        {/* Search Results */}
        {searchSearched && !searchLoading && (
          <div className="mt-8 border-t border-[#c9a227]/20 pt-6 max-w-md mx-auto text-left font-sans text-xs sm:text-sm">
            {searchResult ? (
              <div className="p-4 bg-[#fdf6e3]/50 border border-[#c9a227]/20 rounded flex flex-col gap-2 relative">
                {/* Status badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                  {searchResult.status === "approved" ? (
                    <span className="px-2.5 py-0.5 bg-[#1a3a2a] text-[#c9a227] border border-[#c9a227] rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t("APPROVED", "स्वीकृत")}
                    </span>
                  ) : searchResult.status === "rejected" ? (
                    <span className="px-2.5 py-0.5 bg-[#8b1a1a]/15 text-[#8b1a1a] border border-[#8b1a1a]/30 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {t("REJECTED", "अस्वीकृत")}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      {t("PENDING", "प्रक्रियामा")}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[#444444]/60 font-semibold block text-[10px] uppercase">{t("Application ID:", "आवेदन नम्बर (ID):")}</span>
                  <span className="font-mono font-bold text-[#1a3a2a]">{searchResult.id}</span>
                </div>

                <div>
                  <span className="text-[#444444]/60 font-semibold block text-[10px] uppercase">{t("Student Name:", "विद्यार्थीको नाम:")}</span>
                  <span className="font-serif font-bold text-base text-[#1a3a2a]">{searchResult.student_name}</span>
                </div>

                <div>
                  <span className="text-[#444444]/60 font-semibold block text-[10px] uppercase">{t("Applied Grade:", "आवेदन कक्षा:")}</span>
                  <span className="font-semibold">{t(`Grade ${searchResult.grade_applying}`, `कक्षा ${toNepaliNumerals(searchResult.grade_applying)}`)}</span>
                </div>

                {searchResult.status === "approved" ? (
                  <p className="text-xs text-[#1a3a2a] font-bold border-t border-[#c9a227]/10 pt-2 mt-2 leading-relaxed">
                    {t(
                      "Congratulations! Your admission has been pre-approved. Please visit the school administration within 7 working days to finalize document submissions.",
                      "बधाई छ! यहाँको भर्ना आवेदन प्राथमिक रूपमा स्वीकृत भएको छ। आवश्यक कागजातहरू प्रमाणीकरणका लागि ७ दिनभित्र विद्यालय प्रशासनमा सम्पर्क राख्नुहोला।"
                    )}
                  </p>
                ) : searchResult.status === "rejected" ? (
                  <p className="text-xs text-[#8b1a1a] font-bold border-t border-[#c9a227]/10 pt-2 mt-2 leading-relaxed">
                    {t(
                      "Unfortunately, your admission could not be approved at this time. Please contact the school administration for more information.",
                      "माफ गर्नुहोस्, यहाँको आवेदन स्वीकृत गर्न सकिएन। थप जानकारीका लागि विद्यालय प्रशासनमा सम्पर्क राख्नुहोला।"
                    )}
                  </p>
                ) : (
                  <p className="text-xs text-yellow-700 font-bold border-t border-[#c9a227]/10 pt-2 mt-2 leading-relaxed">
                    {t(
                      "Your inquiry is currently in queue. Our coordinators are conducting credential reviews. We will contact you soon.",
                      "यहाँको आवेदन हाल प्रक्रियामै रहेको छ। योग्यता र सिट संख्याको आधारमा छिट्टै जानकारी पठाइनेछ।"
                    )}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-[#8b1a1a]/5 border border-[#8b1a1a]/25 rounded text-[#8b1a1a] text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{t("No inquiry ID found matching the records.", "यस आईडीको कुनै भर्ना आवेदन भेटिएन। कृपया पुनः जाँच गर्नुहोला।")}</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
