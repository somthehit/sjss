"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Upload, X, ArrowLeft, Loader2 } from "lucide-react";

interface GalleryImage {
  id: number;
  album_id: number;
  url: string;
  caption_en?: string;
  caption_np?: string;
}

interface Album {
  id: number;
  title_en: string;
  title_np: string;
  cover_url: string;
  images?: GalleryImage[];
}

export default function GalleryManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loadingAlbum, setLoadingAlbum] = useState(false);
  
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [albumData, setAlbumData] = useState({ title_en: "", title_np: "", cover_url: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

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

  const fetchAlbumDetails = async (id: number) => {
    try {
      setLoadingAlbum(true);
      const res = await fetch(`/api/gallery/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSelectedAlbum(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAlbum(false);
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

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>, albumId: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading photo ${i + 1} of ${files.length}...`);
        const file = files[i];
        const data = new FormData();
        data.append("file", file);
        data.append("folder", `gallery/${albumId}`);
        
        const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
        const uploadJson = await uploadRes.json();
        
        if (uploadJson.success) {
          await fetch(`/api/gallery/${albumId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: uploadJson.url, caption_en: "New Photo", caption_np: "नयाँ फोटो" })
          });
        }
      }
      // Refresh the currently selected album details
      await fetchAlbumDetails(albumId);
      // Refresh general album counts
      fetchAlbums();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleDeleteAlbum = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open album
    if (!confirm("Are you sure you want to delete this album and all its photos? This cannot be undone.")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    fetchAlbums();
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!selectedAlbum) return;
    if (!confirm("Remove this image from the album?")) return;
    
    try {
      const res = await fetch(`/api/gallery/${selectedAlbum.id}?imageId=${imageId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchAlbumDetails(selectedAlbum.id);
        fetchAlbums();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Render detail view of an opened album
  if (selectedAlbum) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c9a227]/20 pb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedAlbum(null)}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              title="Back to Albums"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold font-serif text-[#1a3a2a]">{selectedAlbum.title_en}</h2>
              <p className="text-sm text-gray-500 font-medium font-serif mt-0.5">{selectedAlbum.title_np}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="bg-[#1a3a2a] text-white px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm hover:bg-[#2a5a4a] transition-all flex items-center gap-2 shadow-sm">
              <Upload className="w-4 h-4" /> Upload Photos
              <input 
                type="file" 
                multiple 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleUploadPhotos(e, selectedAlbum.id)} 
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {uploading && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold">{uploadProgress || "Uploading your photos..."}</span>
          </div>
        )}

        {loadingAlbum ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3a2a]" />
          </div>
        ) : (
          <div>
            {!selectedAlbum.images || selectedAlbum.images.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700">No photos inside this album yet</h3>
                <p className="text-sm text-gray-400 mt-1 mb-4">Upload some memories to make this album shine!</p>
                <label className="bg-[#1a3a2a]/10 hover:bg-[#1a3a2a]/20 text-[#1a3a2a] px-4 py-2 rounded-lg cursor-pointer font-semibold text-sm transition-colors inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Select Photos
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleUploadPhotos(e, selectedAlbum.id)} 
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedAlbum.images.map((image) => (
                  <div key={image.id} className="relative aspect-square group bg-black rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                    <img 
                      src={image.url} 
                      alt={image.caption_en || "Gallery image"} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-transform transform translate-y-2 group-hover:translate-y-0"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

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

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a2a]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div 
              key={album.id} 
              onClick={() => fetchAlbumDetails(album.id)}
              className="bg-white rounded-lg shadow-sm border border-[#c9a227]/20 overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
            >
              <div className="aspect-video bg-gray-100 relative group overflow-hidden">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.title_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white bg-black/60 px-4 py-2 rounded-full text-sm font-semibold">Open Album</span>
                </div>
              </div>
              
              <div className="p-4 flex justify-between items-center bg-white border-t border-gray-50 mt-auto">
                <div>
                  <h3 className="font-bold text-[#1a3a2a]">{album.title_en}</h3>
                  <p className="text-xs text-gray-500 font-serif mt-0.5">{album.title_np}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleDeleteAlbum(album.id, e)} 
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAlbumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-[#1a3a2a]">Create New Album</h3>
              <button onClick={() => setShowAlbumModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleCreateAlbum} className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Album Title (English) *</label>
                <input required value={albumData.title_en} onChange={e => setAlbumData({...albumData, title_en: e.target.value})} className="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Album Title (Nepali) *</label>
                <input required value={albumData.title_np} onChange={e => setAlbumData({...albumData, title_np: e.target.value})} className="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Cover Photo</label>
                <div className="flex gap-2 items-center mt-1">
                  <input type="text" value={albumData.cover_url} onChange={e => setAlbumData({...albumData, cover_url: e.target.value})} className="flex-1 border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" placeholder="URL or upload..." />
                  <label className="bg-gray-100 border px-3 py-2 rounded cursor-pointer hover:bg-gray-200">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadCover} disabled={uploading} />
                  </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1a3a2a] text-white py-2 rounded font-bold hover:bg-[#2a5a4a] transition-colors">Create Album</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
