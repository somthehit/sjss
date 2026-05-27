"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import { Award, Compass, Heart, History, Sparkles } from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/milestones')
      .then(res => res.ok ? res.json() : { data: [] })
      .then(json => setMilestones(json.data || []))
      .catch(() => {});

    fetch('/api/settings')
      .then(res => res.ok ? res.json() : { data: null })
      .then(json => setSiteSettings(json.data || null))
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full">
      {/* Editorial Title Block */}
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("OUR IDENTITY & ROOTS", "हाम्रो परिचय र इतिहास")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("About Our Institution", "विद्यालयको परिचय")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Serving Kanchanpur since 2037 BS with pride, character, and dedication.",
            "वि.सं. २०३७ देखि निरन्तर कञ्चनपुर क्षेत्रमा गुणस्तरीय सार्वजनिक शिक्षाको माध्यमबाट राष्ट्र निर्माणमा समर्पित।"
          )}
        </p>
      </div>

      {/* SECTION 1: DUAL COLUMN HISTORY & VISION */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Profile Card */}
        <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-[#1a3a2a] border-b border-[#c9a227]/20 pb-3 mb-4">
              <History className="w-6 h-6 text-[#c9a227]" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif">{t("Our Rich History", "हाम्रो गौरवशाली इतिहास")}</h2>
            </div>
            <p className="text-sm text-[#444444] leading-relaxed font-sans">
              {t(
                "Shree Jiveen Shakti Secondary School was established in the year 2037 BS (1980 AD) during the early rehabilitation periods in the Punarbas municipality. Initiated in a simple thatch hut by passionate community educators, the school has undergone four decades of consistent development to emerge as a leading secondary institution in the Kanchanpur district, Nepal.",
                "श्री जिविन शक्ति माध्यमिक विद्यालयको स्थापना वि.सं. २०३७ सालमा पुनर्वास नगरपालिकाको प्रारम्भिक बसोबासको समयमा भएको हो। एक सामान्य खरको झुपडीबाट स्थानीय शिक्षाप्रेमीहरूको अनवरत प्रयासबाट सुरु भएको यस विद्यालयले चार दशक लामो यात्रा पार गर्दै आज कञ्चनपुर जिल्लाकै एक प्रतिष्ठित सामुदायिक विद्यालय बन्न सफल भएको छ।"
              )}
            </p>
          </div>
          <div className="mt-6 border-t border-[#c9a227]/10 pt-4 flex justify-between items-center text-xs text-[#8b1a1a] font-semibold">
            <span>{t("Established: 2037 BS", "स्थापना: २०३७ वि.सं.")}</span>
            <span>{t("Type: Government School", "प्रकार: सरकारी (सामुदायिक) विद्यालय")}</span>
          </div>
        </div>

        {/* Vision & Values */}
        <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 md:p-8 shadow-md parchment-glow flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-[#1a3a2a]/5 text-[#c9a227] rounded-full border border-[#c9a227]/25 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#1a3a2a] font-serif">{t("Mission & Vision", "लक्ष्य तथा परिकल्पना")}</h3>
              <p className="text-xs text-[#444444] leading-relaxed mt-1 font-sans">
                {t(
                  "To produce highly capable, globally competent, and morally upright citizens who are proud of their national heritage and are prepared to contribute constructively to society.",
                  "आफ्नो मौलिक पहिचान तथा राष्ट्रियता प्रति गौरव गर्ने, दक्ष, प्रतिस्पर्धी एवं नैतिकवान् नागरिक तयार गरी समाजको सकारात्मक रूपान्तरणमा योगदान पुर्‍याउने।"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-[#1a3a2a]/5 text-[#c9a227] rounded-full border border-[#c9a227]/25 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#1a3a2a] font-serif">{t("Core Institutional Values", "मूल मान्यताहरू")}</h3>
              <p className="text-xs text-[#444444] leading-relaxed mt-1 font-sans">
                {t(
                  "Integrity, equality, respect for diversity, scientific curiosity, and a deep dedication to social empowerment through localized public knowledge frameworks.",
                  "इमानदारिता, निष्पक्षता, विविधताको सम्मान, वैज्ञानिक जिज्ञासा र व्यावहारिक सिकाई प्रवर्द्धन मार्फत शैक्षिक उत्कृष्टता हासिल गर्ने।"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DhakaDivider />

      {/* SECTION 2: ESTABLISHMENT TIMELINE */}
      <section className="py-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a2a] text-center font-serif tracking-tight mb-8">
          {t("Our Historical Milestones", "ऐतिहासिक विकासक्रम")}
        </h2>
        <div className="relative border-l-2 border-[#c9a227]/40 pl-6 md:pl-10 ml-4 max-w-4xl mx-auto flex flex-col gap-8">
          {milestones.length === 0 ? (
            <p className="text-sm text-slate-400 italic">{t('No milestones added yet.', 'कुनै विकासक्रम थपिएको छैन।')}</p>
          ) : (
            milestones.filter(m => m.is_active).map((m) => (
              <div key={m.id} className="relative flex flex-col bg-white border border-[#c9a227]/10 p-5 rounded shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -left-[35px] md:-left-[51px] top-5 w-6 h-6 rounded-full bg-[#1a3a2a] border-2 border-[#c9a227] flex items-center justify-center text-[10px] text-[#c9a227] font-bold shadow-md">
                  ✓
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c9a227]/20 pb-2">
                  <span className="text-base font-bold text-[#1a3a2a] font-serif">{t(m.title_en, m.title_np)}</span>
                  <span className="px-3 py-0.5 bg-[#8b1a1a]/10 text-[#8b1a1a] text-xs font-bold rounded-full font-serif border border-[#8b1a1a]/20">
                    {m.date_label}{m.year_ad ? ` (${m.year_ad})` : ''}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed mt-2.5 font-sans">
                  {t(m.description_en, m.description_np)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <DhakaDivider />

      {/* SECTION 3: FULL PRINCIPAL ADDRESS */}
      <section className="bg-white border-2 border-[#c9a227] p-6 md:p-12 shadow-xl rounded-lg relative overflow-hidden bg-gradient-to-br from-white to-[#fdf6e3]/30">
        {/* Left top watermark seal */}
        <div className="absolute top-4 left-4 w-12 h-12 rounded-full border border-[#c9a227]/20 flex items-center justify-center text-[8px] text-[#c9a227] font-serif opacity-30 select-none pointer-events-none">
          GOVT SEAL
        </div>
        
        <div className="max-w-3xl mx-auto flex flex-col">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#1a3a2a] text-center border-b border-[#c9a227]/30 pb-4 tracking-tight">
            {t("Message from the Principal's Desk", "प्रधानाध्यापकको विस्तृत मन्तव्य")}
          </h2>
          
          <div className="text-sm md:text-base text-[#444444] leading-relaxed mt-6 space-y-4 font-serif text-justify">
            {siteSettings?.principal_message_en ? (
              language === 'EN' 
                ? siteSettings.principal_message_en.split('\n').map((para: string, i: number) => <p key={i}>{para}</p>)
                : siteSettings.principal_message_np?.split('\n').map((para: string, i: number) => <p key={i}>{para}</p>)
            ) : (
              <>
                <p>
                  {t(
                    "Dear Students, Parents, Guardians, and Well-wishers,",
                    "आदरणीय अभिभावक, शिक्षक, सरोकारवाला तथा प्यारा विद्यार्थी भाइबहिनीहरू,"
                  )}
                </p>
                <p>
                  {t(
                    "It is my extreme privilege and honor to serve as the Principal of Shree Jiveen Shakti Secondary School, Sitabasti, Kanchanpur. Ever since our inception in 2037 BS, our school has undergone massive shifts from a modest rural basic school to a full-fledged government secondary educational institution supporting diverse curriculums in Science, Humanities, and Education.",
                    "कञ्चनपुर जिल्लाको पुनर्वास नगरपालिकास्थित श्री जिविन शक्ति माध्यमिक विद्यालयको प्रधानाध्यापकका रूपमा यहाँहरूसँग जोडिन पाउँदा म अत्यन्तै गौरवान्वित छु। वि.सं. २०३७ सालमा सामान्य प्राथमिक पाठशालाको रूपमा स्थापना भएको यो विद्यालय आज क्षेत्रकै उत्कृष्ट सामुदायिक माध्यमिक विद्यालय बन्न सफल भएको छ।"
                  )}
                </p>
                <p>
                  {t(
                    "In alignment with the directives of the Ministry of Education, Nepal, our school has consistently achieved highly competitive results in the Secondary Education Examination (SEE). We recognize that textbook learning alone is incomplete. Hence, we prioritize an active integration of digital literacy, library exercises, physical sports, and cultural festivals which draws inspiration from our rich Nepalese identity.",
                    "नेपाल सरकारको राष्ट्रिय शिक्षा प्रणाली अनुरूप हामीले माध्यमिक शिक्षा परीक्षा (SEE) मा निरन्तर उत्कृष्ट नतिजा हासिल गर्दै आएका छौँ। हामी केवल परीक्षा उत्तीर्ण गर्ने शैक्षिक कारखाना होइनौँ, अपितु विद्यार्थीमा अन्तरनिहित प्रतिभा प्रस्फुटन गरी देश र समाजप्रति जिम्मेवार नागरिक उत्पादन गर्न समर्पित छौँ।"
                  )}
                </p>
                <p>
                  {t(
                    "We are highly grateful to the local government authorities of Punarbas-9, our hard-working faculty members, and the collaborative School Management Committee (SMC) who support our operations. We welcome all parents to maintain open communicative relationships with us to ensure our pupils reach their highest academic heights.",
                    "हामी पुनर्वास नगरपालिका, विद्यालय व्यवस्थापन समिति, शिक्षक अभिभावक संघ, लगनशील शिक्षक-कर्मचारी र सहयोगी हातहरू प्रति हार्दिक आभार प्रकट गर्दछौँ। यहाँहरूको साथ र सहयोग नै हाम्रो उत्प्रेरणाको स्रोत हो। आगामी दिनहरूमा पनि यस्तै सहकार्य र शुभेच्छाको अपेक्षा गर्दछौँ।"
                  )}
                </p>
                <p className="pt-2">
                  {t("Thank you. Wishing everyone a highly productive and fulfilling academic year.", "धन्यवाद। यहाँहरू सबैको शैक्षिक यात्रा सुखद接र सफल रहोस्।")}
                </p>
              </>
            )}
          </div>

          {/* Principal Signature Block */}
          <div className="mt-8 pt-6 border-t border-[#c9a227]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {/* Stamp representation */}
            <div className="flex items-center gap-3 bg-[#1a3a2a]/5 border border-[#c9a227]/30 px-4 py-2.5 rounded">
              <div className="w-8 h-8 rounded-full border border-[#8b1a1a] flex items-center justify-center text-[#8b1a1a] text-[8px] font-bold uppercase shrink-0">
                SEAL
              </div>
              <div className="flex flex-col text-[10px] text-[#444444]/80 font-sans leading-tight">
                <span className="font-bold text-[#1a3a2a]">{t("Jiveen Shakti Sec. School", "जिविन शक्ति मा.वि.")}</span>
                <span>{t("Sitabasti, Kanchanpur", "सिताबस्ती, कञ्चनपुर")}</span>
              </div>
            </div>

            {/* Signature text styled with premium hand-font fallbacks */}
            <div className="flex flex-col text-right sm:text-right">
              <span className="font-serif italic text-lg text-[#1a3a2a] tracking-wider leading-none">
                P. R. Upadhyaya
              </span>
              <div className="h-[1px] bg-gradient-to-l from-[#c9a227] to-transparent w-32 my-1.5 self-end" />
              <span className="font-bold text-xs text-[#8b1a1a] uppercase tracking-wider font-sans">
                Prayag Raj Upadhyaya
              </span>
              <span className="text-[11px] text-[#444444]/70 font-sans">
                {t("Principal, JSSS", "प्रधानाध्यापक, श्री जि.श.मा.वि.")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ACCREDITATIONS */}
      <section className="py-10 px-4 mt-8 bg-white border border-[#c9a227]/20 rounded-lg text-center parchment-glow">
        <h3 className="text-lg font-bold text-[#1a3a2a] font-serif uppercase tracking-wider mb-4">
          {t("Accreditation & Approvals", "मान्यता तथा सम्बन्धन")}
        </h3>
        <div className="flex flex-wrap justify-center gap-8 text-[#444444]/85 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#c9a227]" />
            <span>{t("Ministry of Education, Nepal Govt.", "शिक्षा मन्त्रालय, नेपाल सरकार")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#c9a227]" />
            <span>{t("National Examinations Board (NEB) Affiliated", "राष्ट्रिय परीक्षा बोर्ड (NEB) सम्बन्धन")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
