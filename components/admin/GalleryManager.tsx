"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";

interface Album {
  id: number;
  title_en: string;
  title_np: string;
  cover_url: string;
  images?: any[];
}

export default function GalleryManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [activeAlbumId, setActiveAlbumId] = useState<number | null>(null);
  
  const [albumData, setAlbumData] = useState({ title_en: "", title_np: "", cover_url: "" });
  const [uploading, setUploading] = useState(false);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const json = await res.json();
        setAlbums(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumData)
      });
      if (res.ok) {
        setShowAlbumModal(false);
        setAlbumData({ title_en: "", title_np: "", cover_url: "" });
        fetchAlbums();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "gallery/covers");
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) setAlbumData(prev => ({ ...prev, cover_url: json.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeAlbumId) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append("file", file);
        data.append("folder", `gallery/${activeAlbumId}`);
        
        const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
        const uploadJson = await uploadRes.json();
        
        if (uploadJson.success) {
          await fetch(`/api/gallery/${activeAlbumId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: uploadJson.url, caption_en: "New Photo", caption_np: "नयाँ फोटो" })
          });
        }
      }
      fetchAlbums();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    if (!confirm("Delete this album?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    fetchAlbums();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif text-[#1a3a2a]">Photo Gallery Manager</h2>
        <button 
          onClick={() => setShowAlbumModal(true)}
          className="bg-[#1a3a2a] text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#2a5a4a] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Album
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="bg-white rounded shadow border border-[#c9a227]/20 overflow-hidden">
            <div className="aspect-video bg-gray-100 relative group">
              {album.cover_url ? (
                <img src={album.cover_url} alt={album.title_en} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <label className="bg-[#c9a227] text-white px-3 py-1.5 rounded cursor-pointer text-sm font-semibold hover:bg-[#b08d20]">
                  <Upload className="w-4 h-4 inline mr-1" /> Add Photos
                  <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => { setActiveAlbumId(album.id); handleUploadPhotos(e); }} />
                </label>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#1a3a2a]">{album.title_en}</h3>
                <p className="text-sm text-gray-500">{album.images?.length || 0} photos</p>
              </div>
              <button onClick={() => handleDeleteAlbum(album.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAlbumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">Create New Album</h3>
              <button onClick={() => setShowAlbumModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleCreateAlbum} className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold">Album Title (English) *</label>
                <input required value={albumData.title_en} onChange={e => setAlbumData({...albumData, title_en: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-semibold">Album Title (Nepali) *</label>
                <input required value={albumData.title_np} onChange={e => setAlbumData({...albumData, title_np: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-semibold">Cover Photo</label>
                <div className="flex gap-2 items-center mt-1">
                  <input type="text" value={albumData.cover_url} onChange={e => setAlbumData({...albumData, cover_url: e.target.value})} className="flex-1 border rounded p-2 text-sm" placeholder="URL or upload..." />
                  <label className="bg-gray-100 border px-3 py-2 rounded cursor-pointer hover:bg-gray-200">
                    <Upload className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadCover} disabled={uploading} />
                  </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1a3a2a] text-white py-2 rounded font-bold hover:bg-[#2a5a4a]">Create Album</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
