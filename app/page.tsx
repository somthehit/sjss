import type { Metadata } from 'next';
import Link from 'next/link';
import { Notice, HeroSlide } from '@/lib/schema';

import HeroSlider from '@/components/HeroSlider';
import BSCalendar from '@/components/BSCalendar';

export const metadata: Metadata = {
  title: 'Shree Jiveen Shakti Secondary School | Kanchanpur, Nepal',
  description: 'Official website of Shree Jiveen Shakti Secondary School, Punarbas-9, Sitabasti, Kanchanpur, Nepal. Established 2037 BS.',
};

async function getLatestNotices(): Promise<Notice[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/notices?limit=4`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/hero-slides`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const allSlides = json.data || [];
    return allSlides.filter((s: any) => s.is_active);
  } catch {
    return [];
  }
}

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/settings`, { next: { revalidate: 300 } });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch {
    return {};
  }
}

async function getEvents(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/events`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

const getStats = (settings: Record<string, string>) => [
  { value: settings.total_students || '847+', label_en: 'Students', label_np: 'विद्यार्थीहरू' },
  { value: settings.total_staff || '42', label_en: 'Staff Members', label_np: 'शिक्षक/कर्मचारी' },
  { value: settings.established_year_bs || '2037', label_en: 'Established (BS)', label_np: 'स्थापना (BS)' },
  { value: settings.school_classes || '1–10', label_en: 'Classes', label_np: 'कक्षाहरू' },
];

const quickLinks = [
  { href: '/admission', icon: '📋', label_en: 'Apply for Admission', label_np: 'भर्नाको लागि आवेदन', color: '#1a3a2a' },
  { href: '/results', icon: '🏆', label_en: 'Check Results', label_np: 'नतिजा हेर्नुहोस्', color: '#8b1a1a' },
  { href: '/gallery', icon: '🖼️', label_en: 'Photo Gallery', label_np: 'फोटो ग्यालेरी', color: '#c9a227' },
  { href: '/notices', icon: '📢', label_en: 'Notice Board', label_np: 'सूचना पाटी', color: '#2d5016' },
];

const upcomingEvents = [
  { date_bs: 'जेठ २५, २०८१', date_en: 'June 8, 2025', event_en: 'Parent-Teacher Meeting', event_np: 'अभिभावक-शिक्षक बैठक' },
  { date_bs: 'असार १५, २०८१', date_en: 'June 28, 2025', event_en: 'Annual Sports Day', event_np: 'वार्षिक खेलकुद दिवस' },
  { date_bs: 'साउन ५, २०८१', date_en: 'July 20, 2025', event_en: 'First Terminal Exam Begins', event_np: 'प्रथम टर्मिनल परीक्षा शुरु' },
  { date_bs: 'भाद्र १, २०८१', date_en: 'Aug 17, 2025', event_en: 'Independence Day Celebration', event_np: 'स्वतन्त्रता दिवस उत्सव' },
  { date_bs: 'असोज २८, २०८१', date_en: 'Oct 14, 2025', event_en: 'Dashain Holidays Begin', event_np: 'दशैँ बिदा शुरु' },
];

const categoryColors: Record<string, string> = {
  admission: '#1a3a2a', results: '#8b1a1a', event: '#c9a227',
  meeting: '#2d5016', holiday: '#7c4a03', general: '#444444',
};

export default async function HomePage() {
  const notices = await getLatestNotices();
  const heroSlides = await getActiveHeroSlides();
  const siteSettings = await getSiteSettings();
  const events = await getEvents();

  const stats = getStats(siteSettings);

  const displayEvents = events.length > 0 ? events.map(e => ({
    date_bs: e.date_bs,
    date_en: new Date(e.date_en).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    event_en: e.title_en,
    event_np: e.title_np
  })) : upcomingEvents;

  return (
    <div className="min-h-screen" style={{ background: '#fdf6e3' }}>

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d2016 0%, #1a3a2a 45%, #2d5016 100%)' }}>
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50Z' fill='none' stroke='%23c9a227' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '80px',
        }} />
        {/* Golden dhaka border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #c9a227, #e8c547, #c9a227, transparent)' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Left Column: Text Content */}
            <div className="max-w-xl flex flex-col justify-center">
              {/* Nepali name */}
              <p className="text-sm md:text-base mb-4 nepali-text font-semibold tracking-wide" style={{ color: '#d4af37' }}>
                श्री जीवन शक्ति माध्यमिक विद्यालय
              </p>
              
              <div className="mb-6">
                <h1 className="text-5xl md:text-7xl font-black leading-tight" style={{ fontFamily: 'Georgia, serif', color: 'rgb(253, 254, 255)' }}>
                  Shree Jiveen Shakti
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold -mt-2" style={{ fontFamily: 'Georgia, serif', color: '#d4af37' }}>
                  Secondary School
                </h2>
              </div>

              <p className="text-sm md:text-base mb-8 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Punarbas-9, Sitabasti, Kanchanpur, Nepal &nbsp;·&nbsp; Est. {siteSettings.established_year_bs || '2037'} BS
              </p>

              <p className="text-sm mb-10 max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Nurturing young minds with quality education rooted in Nepali values and global perspectives since {siteSettings.established_year_bs || '2037'} BS.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/admission" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90" style={{ background: '#d4af37', color: '#1a3a2a' }}>
                  Apply for Admission →
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                  About Our School
                </Link>
              </div>
            </div>

            {/* Right Column: Photo Slider */}
            <div className="w-full h-full mt-10 lg:mt-0">
              <HeroSlider slides={heroSlides} />
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs text-white tracking-widest uppercase">Scroll</span>
          <div className="w-0.5 h-10 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(201,162,39,1), transparent)' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 px-6" style={{ background: '#1a3a2a' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="py-6 px-4">
              <div className="text-4xl font-black mb-1" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>{s.value}</div>
              <div className="text-sm font-medium text-white opacity-80">{s.label_en}</div>
              <div className="text-xs mt-0.5 nepali-text opacity-60" style={{ color: '#c9a227' }}>{s.label_np}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── LATEST NOTICES + QUICK LINKS ── */}
        <section className="py-16 grid md:grid-cols-3 gap-10">
          {/* Notices */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#1a3a2a', fontFamily: 'Georgia, serif' }}>Latest Notices</h2>
                <p className="text-sm nepali-text" style={{ color: '#c9a227' }}>ताजा सूचनाहरू</p>
              </div>
              <Link href="/notices" className="text-sm font-medium px-4 py-2 rounded-lg transition hover:opacity-80" style={{ color: '#1a3a2a', border: '1.5px solid #1a3a2a' }}>
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {notices.length > 0 ? notices.map((n) => (
                <div key={n.id} className="group flex gap-4 p-4 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer" style={{ background: 'white', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <div className="flex-shrink-0 mt-0.5">
                    {n.is_pinned && <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: '#8b1a1a', color: 'white' }}>📌 Pinned</span>}
                    {!n.is_pinned && (
                      <span className="text-xs px-2 py-0.5 rounded font-semibold capitalize" style={{ background: `${categoryColors[n.category] || '#444'}22`, color: categoryColors[n.category] || '#444' }}>
                        {n.category}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug truncate" style={{ color: '#1a3a2a' }}>{n.title_en}</p>
                    <p className="text-xs mt-0.5 truncate nepali-text" style={{ color: '#666' }}>{n.title_np}</p>
                    <p className="text-xs mt-1" style={{ color: '#999' }}>{new Date(n.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              )) : (
                // Static fallback notices if DB not seeded yet
                [
                  { id: 1, title_en: 'Admission Open for Grade 1-10 (2081 BS)', title_np: 'कक्षा १-१० भर्ना खुला (२०८१ BS)', category: 'admission', is_pinned: true, published_at: new Date() },
                  { id: 2, title_en: 'SEE 2080 Results Published', title_np: 'SEE २०८० नतिजा प्रकाशित', category: 'results', is_pinned: false, published_at: new Date() },
                  { id: 3, title_en: 'Annual Sports Day - Ashad 15', title_np: 'वार्षिक खेलकुद दिवस - असार १५', category: 'event', is_pinned: false, published_at: new Date() },
                ].map((n) => (
                  <div key={n.id} className="flex gap-4 p-4 rounded-xl" style={{ background: 'white', border: '1px solid rgba(201,162,39,0.2)' }}>
                    <span className="text-xs px-2 py-0.5 rounded font-semibold capitalize h-fit" style={{ background: `${categoryColors[n.category] || '#444'}22`, color: categoryColors[n.category] || '#444' }}>{n.category}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#1a3a2a' }}>{n.title_en}</p>
                      <p className="text-xs nepali-text mt-0.5" style={{ color: '#666' }}>{n.title_np}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1a3a2a', fontFamily: 'Georgia, serif' }}>Quick Access</h2>
            <p className="text-sm nepali-text mb-6" style={{ color: '#c9a227' }}>द्रुत पहुँच</p>
            <div className="space-y-3">
              {quickLinks.map((link, i) => (
                <Link key={i} href={link.href} className="flex items-center gap-4 p-4 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md" style={{ background: link.color, color: 'white' }}>
                  <span className="text-2xl">{link.icon}</span>
                  <div>
                    <div className="font-semibold">{link.label_en}</div>
                    <div className="text-xs opacity-70 nepali-text">{link.label_np}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── DHAKA DIVIDER ── */}
        <div className="dhaka-divider" />

        {/* ── PRINCIPAL MESSAGE ── */}
        <section className="py-16 grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2 flex flex-col items-center md:items-start">
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black text-white mb-4 shadow-xl" style={{ background: 'linear-gradient(135deg, #1a3a2a, #2d5016)', border: '4px solid #c9a227' }}>
              प्र.रा.
            </div>
            <h3 className="font-bold text-lg text-center md:text-left" style={{ color: '#1a3a2a', fontFamily: 'Georgia, serif' }}>Prayag Raj Upadhyaya</h3>
            <p className="text-sm" style={{ color: '#c9a227' }}>Principal / प्रधानाध्यापक</p>
            <p className="text-xs mt-1" style={{ color: '#999' }}>M.Ed. (Education Management)</p>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1a3a2a', fontFamily: 'Georgia, serif' }}>Principal's Message</h2>
            <p className="text-sm nepali-text mb-4" style={{ color: '#c9a227' }}>प्रधानाध्यापकको सन्देश</p>
            <div className="p-6 rounded-2xl relative" style={{ background: 'white', border: '2px solid #c9a227', boxShadow: '6px 6px 0 #c9a22722' }}>
              <div className="text-6xl absolute -top-4 left-4 leading-none" style={{ color: '#c9a22733', fontFamily: 'Georgia, serif' }}>"</div>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: '#444', fontStyle: 'italic' }}>
                Welcome to Shree Jiveen Shakti Secondary School. Our mission is to nurture young minds with quality education rooted in Nepali values and global perspectives. We believe every child has immense potential, and our dedicated faculty strives to help each student realize their full capabilities.
              </p>
              <p className="text-sm leading-relaxed mt-3 nepali-text relative z-10" style={{ color: '#666' }}>
                श्री जीवन शक्ति माध्यमिक विद्यालयमा स्वागत छ। हाम्रो लक्ष्य नेपाली मूल्य र वैश्विक दृष्टिकोणमा आधारित गुणस्तरीय शिक्षाद्वारा युवा मनहरूलाई पोषण दिनु हो।
              </p>
            </div>
          </div>
        </section>

        {/* ── DHAKA DIVIDER ── */}
        <div className="dhaka-divider" />

        {/* ── UPCOMING EVENTS ── */}
        <section className="py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#1a3a2a', fontFamily: 'Georgia, serif' }}>Upcoming Events</h2>
              <p className="text-sm nepali-text" style={{ color: '#c9a227' }}>आगामी कार्यक्रमहरू</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayEvents.map((ev, i) => (
              <div key={i} className="p-5 rounded-xl transition-all hover:shadow-md" style={{ background: 'white', border: '1px solid rgba(26,58,42,0.1)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1a3a2a' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="text-xs font-bold nepali-text" style={{ color: '#c9a227' }}>{ev.date_bs}</p>
                    <p className="text-xs" style={{ color: '#999' }}>{ev.date_en}</p>
                  </div>
                </div>
                <p className="font-semibold text-sm" style={{ color: '#1a3a2a' }}>{ev.event_en}</p>
                <p className="text-xs mt-0.5 nepali-text" style={{ color: '#666' }}>{ev.event_np}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <iframe src="https://www.ashesh.com.np/calendar-widget/calendar.php?tithi=1&header_color=default&api=872156q120" frameBorder="0" scrolling="no" marginWidth={0} marginHeight={0} style={{ border: 'none', overflow: 'hidden', width: 370, height: 333, borderRadius: 5 }} allowtransparency={true} />
          </div>
          <div className="mt-12">
            <BSCalendar />
          </div>
        </section>

      </div>

      {/* ── FOOTER STRIP ── */}
      <footer className="py-10 mt-8 text-center" style={{ background: '#1a3a2a', color: 'rgba(255,255,255,0.6)' }}>
        <p className="text-sm font-medium text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Shree Jiveen Shakti Secondary School</p>
        <p className="text-xs nepali-text mb-2" style={{ color: '#c9a227' }}>श्री जीवन शक्ति माध्यमिक विद्यालय</p>
        <p className="text-xs">Punarbas-9, Sitabasti, Kanchanpur, Nepal &nbsp;|&nbsp; Principal: Prayag Raj Upadhyaya &nbsp;|&nbsp; Est. {siteSettings.established_year_bs || '2037'} BS</p>
        {/** EMIS from site settings (if configured) */}
        {siteSettings?.emis ? (
          <p className="text-xs mt-2" style={{ color: '#c9a227' }}>
            EMIS: {siteSettings.emis}
          </p>
        ) : null}
        <p className="text-xs mt-3 opacity-40">© 2081 BS · All rights reserved</p>
      </footer>

    </div>
  );
}
