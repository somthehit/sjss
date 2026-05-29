import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import PopupNotice from "@/components/PopupNotice";
import DesktopIconRail from "@/components/DesktopIconRail";
import OrbitalNavigation from "@/components/OrbitalNavigation";

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Shree Jiveen Shakti Secondary School",
    default: "Shree Jiveen Shakti Secondary School | Kanchanpur, Nepal",
  },
  description: "Official website of Shree Jiveen Shakti Secondary School. Punarbas-9, Sitabasti, Kanchanpur, Nepal. Established in 2037 BS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdf6e3]">
        <LanguageProvider>
          {/* Top Announcement Bar Ticker */}
          <AnnouncementBar />
          
          <div className="flex flex-1 flex-col md:flex-row w-full min-h-screen">
            {/* Left navigation rail on desktop */}
            <DesktopIconRail />
            
            {/* Main content body panel */}
            <main className="flex-1 flex flex-col w-full md:pl-[72px] transition-all duration-300">
              {children}
            </main>
          </div>

          {/* Floating Navigation Trigger and Overlay Drawer */}
          <OrbitalNavigation />
          <PopupNotice />
        </LanguageProvider>
      </body>
    </html>
  );
}
