"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DhakaDivider from "@/components/DhakaDivider";
import {
  Sparkles,
  Image as ImageIcon,
  FolderOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

interface Album {
  id: string;
  titleEn: string;
  titleNp: string;
  coverInitials: string;
  photos: {
    urlInitials: string;
    captionEn: string;
    captionNp: string;
  }[];
}

export default function Gallery() {
  const { t } = useLanguage();
  const [activeAlbumId, setActiveAlbumId] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [albumsData, setAlbumsData] = useState<Array<any>>([]);
  const [albumPhotos, setAlbumPhotos] = useState<Array<any>>([]);

  // Fetch albums from API
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) return;
        const json = await res.json();
        setAlbumsData(json.data || []);
      } catch (err) {
        console.error('Failed to load albums', err);
      }
    };
    fetchAlbums();
  }, []);

  // Fetch photos for selected album
  useEffect(() => {
    if (activeAlbumId && activeAlbumId !== 'all') {
      const fetchAlbum = async () => {
        try {
          const res = await fetch(`/api/gallery/${activeAlbumId}`);
          if (!res.ok) return;
          const json = await res.json();
          setAlbumPhotos(json.data?.images || []);
        } catch (err) {
          console.error('Failed to load album images', err);
        }
      };
      fetchAlbum();
    } else {
      setAlbumPhotos([]);
    }
  }, [activeAlbumId]);

  // Handle photos and lightbox for selected album
  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? albumPhotos.length - 1 : lightboxIndex - 1);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === albumPhotos.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  // Keyboard navigation inside lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, albumPhotos]);

  const activeAlbumMeta = albumsData.find(a => String(a.id) === activeAlbumId);

  return (
    <div className="flex-1 flex flex-col py-10 px-6 max-w-5xl mx-auto w-full no-print">
      {/* Page Title */}
      <div className="text-center flex flex-col items-center mb-10">
        <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t("VISUAL CHRONICLES", "विद्यालयका गतिविधिहरू")}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-serif text-[#1a3a2a] mt-2">
          {t("Photo & Activity Gallery", "तस्विर तथा क्रियाकलाप सङ्ग्रह")}
        </h1>
        <p className="text-sm text-[#444444]/70 max-w-lg mt-2 font-sans">
          {t(
            "Capturing the vibrant moments, sports victories, Saraswati Puja celebrations, and exhibitions.",
            "वार्षिक खेलकुद, सांस्कृतिक पर्वहरू र शैक्षिक प्रदर्शनीका रङ्गीन यादहरू तस्विरमा।"
          )}
        </p>
      </div>

      {/* Album Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 font-sans text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveAlbumId("all")}
          className={`px-4 py-2 border rounded cursor-pointer transition-all ${
            activeAlbumId === "all"
              ? "bg-[#1a3a2a] text-[#c9a227] border-[#c9a227] shadow"
              : "bg-white border-[#c9a227]/30 text-[#444444]/80 hover:bg-[#1a3a2a]/5"
          }`}
        >
          {t("All Photos", "सम्पूर्ण तस्विरहरू")}
        </button>

        {albumsData.map((album: any) => (
          <button
            key={album.id}
            onClick={() => setActiveAlbumId(String(album.id))}
            className={`px-4 py-2 border rounded cursor-pointer transition-all flex items-center gap-1.5 ${
              activeAlbumId === String(album.id)
                ? "bg-[#1a3a2a] text-[#c9a227] border-[#c9a227] shadow"
                : "bg-white border-[#c9a227]/30 text-[#444444]/80 hover:bg-[#1a3a2a]/5"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{t(album.title_en, album.title_np)}</span>
          </button>
        ))}
      </div>

      {/* Photos Masonry / Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeAlbumId === 'all' ? (
          // show album covers
          albumsData.map((album: any) => (
            <div
              key={album.id}
              onClick={() => setActiveAlbumId(String(album.id))}
              className="group bg-white border border-[#c9a227]/30 rounded-lg p-3 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative cursor-pointer overflow-hidden"
            >
              <div className="w-full aspect-[4/3] rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                {album.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={album.cover_url} alt={album.title_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="p-4 text-center text-[#c9a227] font-bold">{album.title_en}</div>
                )}
              </div>
              <div className="mt-3.5 pl-1.5">
                <p className="text-xs font-bold text-[#1a3a2a] font-serif uppercase tracking-wider">{album.title_en}</p>
                <p className="text-[11px] text-[#444444]/80 leading-relaxed font-sans mt-0.5 line-clamp-2">{album.description_en}</p>
              </div>
            </div>
          ))
        ) : (
          albumPhotos.map((photo: any, index: number) => (
            <div
              key={index}
              onClick={() => setLightboxIndex(index)}
              className="group bg-white border border-[#c9a227]/30 rounded-lg p-3 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative cursor-pointer overflow-hidden parchment-glow"
            >
              {/* image if available */}
              <div className="w-full aspect-[4/3] rounded bg-gradient-to-br from-[#102419] to-[#1a3a2a] flex flex-col items-center justify-center p-4 border border-[#c9a227]/25 select-none relative overflow-hidden">
                {photo.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.url} alt={photo.caption_en || ''} className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <>
                    <span className="text-[10px] text-[#c9a227] font-semibold uppercase tracking-widest font-sans opacity-70">{albumPhotos.length && albumsData.find(a=>String(a.id)===activeAlbumId)?.title_en}</span>
                    <div className="h-[1px] bg-[#c9a227]/30 w-16 my-2" />
                    <span className="font-serif font-extrabold text-[#c9a227] text-sm text-center leading-tight tracking-wider">{photo.caption_en || photo.caption_np}</span>
                  </>
                )}
                <div className="absolute inset-0 bg-[#1a3a2a]/0 group-hover:bg-[#1a3a2a]/25 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Caption */}
              <div className="mt-3.5 pl-1.5">
                <p className="text-xs font-bold text-[#1a3a2a] font-serif uppercase tracking-wider">{albumsData.find(a=>String(a.id)===activeAlbumId)?.title_en}</p>
                <p className="text-[11px] text-[#444444]/80 leading-relaxed font-sans mt-0.5 line-clamp-2">{photo.caption_en || photo.caption_np}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FULL-SCREEN LIGHTBOX OVERLAY */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 select-none animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/5 cursor-pointer z-50 focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/5 cursor-pointer z-40 focus:outline-none hover:scale-105"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Core Graphic Representation Slide */}
          <div className="max-w-3xl w-full aspect-[4/3] max-h-[70vh] bg-gradient-to-br from-[#102419] to-[#1a3a2a] rounded-lg border-2 border-[#c9a227] flex flex-col items-center justify-center p-8 relative shadow-2xl">
            <span className="text-xs text-[#c9a227] font-semibold uppercase tracking-widest font-sans mb-3">
              {t(activeAlbumMeta?.title_en || '', activeAlbumMeta?.title_np || '')}
            </span>
            <div className="h-[1.5px] bg-[#c9a227] w-32 my-2" />
            <h2 className="font-serif font-extrabold text-[#c9a227] text-3xl md:text-4xl text-center leading-snug tracking-wider">
              {albumPhotos[lightboxIndex]?.caption_en || albumPhotos[lightboxIndex]?.caption_np || ''}
            </h2>
            <div className="absolute bottom-4 left-6 text-white/60 font-sans text-xs">
              {lightboxIndex + 1} / {albumPhotos.length}
            </div>
          </div>

          {/* Slide Caption Bottom */}
          <div className="max-w-2xl text-center mt-6 text-white px-4">
            <h4 className="text-sm font-bold font-serif text-[#c9a227] uppercase tracking-wider">
              {t(activeAlbumMeta?.title_en || '', activeAlbumMeta?.title_np || '')}
            </h4>
            <p className="text-sm md:text-base text-white/90 leading-relaxed font-sans mt-1">
              {t(albumPhotos[lightboxIndex]?.caption_en || '', albumPhotos[lightboxIndex]?.caption_np || '')}
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/5 cursor-pointer z-40 focus:outline-none hover:scale-105"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      <DhakaDivider />
    </div>
  );
}
