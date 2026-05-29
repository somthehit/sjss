"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Upload, X, ArrowLeft, Loader2, Eye, Pencil } from "lucide-react";

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
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumData, setAlbumData] = useState({ title_en: "", title_np: "", cover_url: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Enhanced upload state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [captionEn, setCaptionEn] = useState("");
  const [captionNp, setCaptionNp] = useState("");

  // Lightbox state
  const [lightboxUrl, setLightboxUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setAlbumData({ title_en: album.title_en, title_np: album.title_np, cover_url: album.cover_url });
    setShowAlbumModal(true);
  };

  const handleUpdateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;
    try {
      const res = await fetch(`/api/gallery/${editingAlbum.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumData)
      });
      if (res.ok) {
        setShowAlbumModal(false);
        setEditingAlbum(null);
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

  // Handle file selection for batch upload
  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setPendingFiles(prev => [...prev, ...fileArray]);

    // Generate preview URLs
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPendingPreviews(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so re-selecting same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
    setPendingPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearPendingFiles = () => {
    setPendingFiles([]);
    setPendingPreviews([]);
    setCaptionEn("");
    setCaptionNp("");
  };

  const handleUploadPhotos = async (albumId: number) => {
    if (pendingFiles.length === 0) return;

    try {
      setUploading(true);
      for (let i = 0; i < pendingFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${pendingFiles.length}: ${pendingFiles[i].name}`);
        const file = pendingFiles[i];
        const data = new FormData();
        data.append("file", file);
        data.append("folder", `gallery/${albumId}`);

        const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
        const uploadJson = await uploadRes.json();

        if (uploadJson.success) {
          await fetch(`/api/gallery/${albumId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: uploadJson.url,
              caption_en: captionEn || `Photo`,
              caption_np: captionNp || `फोटो`
            })
          });
        }
      }
      clearPendingFiles();
      await fetchAlbumDetails(albumId);
      fetchAlbums();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleDeleteAlbum = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this album and all its photos? This cannot be undone.")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    fetchAlbums();
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!selectedAlbum) return;
    if (!confirm("Remove this image from the album?")) return;
    try {
      const res = await fetch(`/api/gallery/${selectedAlbum.id}?imageId=${imageId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchAlbumDetails(selectedAlbum.id);
        fetchAlbums();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Album detail view
  if (selectedAlbum) {
    const imageCount = selectedAlbum.images?.length || 0;
    return (
      <div className="space-y-6">
        {/* Header */}
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
            {uploading && <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />}
            <label className="bg-[#1a3a2a] text-white px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm hover:bg-[#2a5a4a] transition-all flex items-center gap-2 shadow-sm">
              <Upload className="w-4 h-4" /> Select Photos
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleSelectFiles}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Batch upload preview */}
        {pendingFiles.length > 0 && !uploading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-800">{pendingFiles.length} photo(s) selected</h4>
              <button onClick={clearPendingFiles} className="text-amber-600 hover:text-amber-800 text-sm font-semibold">Clear all</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {pendingPreviews.map((p, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-300 group">
                  <img src={p} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePendingFile(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={captionEn}
                onChange={e => setCaptionEn(e.target.value)}
                placeholder="Caption (English)"
                className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={captionNp}
                onChange={e => setCaptionNp(e.target.value)}
                placeholder="क्याप्सन (नेपाली)"
                className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => handleUploadPhotos(selectedAlbum.id)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Upload className="w-4 h-4" /> Upload All
              </button>
            </div>
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{uploadProgress}</p>
              <div className="mt-1.5 w-full bg-emerald-200 rounded-full h-1.5">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${pendingFiles.length > 0 ? Math.round(((pendingFiles.length - (pendingFiles.length)) / pendingFiles.length) * 100) : 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loadingAlbum ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3a2a]" />
          </div>
        ) : (
          <div>
            {imageCount === 0 ? (
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
                    onChange={handleSelectFiles}
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-3 font-medium">{imageCount} photo{imageCount !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedAlbum.images!.map((image) => (
                    <div key={image.id} className="relative aspect-square group bg-black rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img
                        src={image.url}
                        alt={image.caption_en || "Gallery image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                        onClick={() => setLightboxUrl(image.url)}
                      />
                      {image.caption_en && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-medium truncate">{image.caption_en}</p>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => setLightboxUrl(image.url)}
                          className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Lightbox */}
        {lightboxUrl && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxUrl("")}
          >
            <button
              onClick={() => setLightboxUrl("")}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxUrl}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  }

  // Album list view
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
      ) : albums.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No albums yet</h3>
          <p className="text-sm text-gray-400 mt-1 mb-4">Create your first photo album to get started!</p>
          <button
            onClick={() => setShowAlbumModal(true)}
            className="bg-[#1a3a2a] text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#2a5a4a] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => fetchAlbumDetails(album.id)}
              className="bg-white rounded-xl shadow-sm border border-[#c9a227]/20 overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col group"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.title_en} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white bg-black/50 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">Open Album →</span>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center bg-white border-t border-gray-50 mt-auto">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#1a3a2a] truncate">{album.title_en}</h3>
                  <p className="text-xs text-gray-500 font-serif mt-0.5 truncate">{album.title_np}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">
                    {album.images?.length || 0} photo{(album.images?.length || 0) !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditAlbum(album); }}
                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                    title="Edit Album"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteAlbum(album.id, e)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Album"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Album Modal */}
      {showAlbumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-[#1a3a2a]">{editingAlbum ? "Edit Album" : "Create New Album"}</h3>
              <button onClick={() => { setShowAlbumModal(false); setEditingAlbum(null); }} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={editingAlbum ? handleUpdateAlbum : handleCreateAlbum} className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Album Title (English) *</label>
                <input
                  required
                  value={albumData.title_en}
                  onChange={e => setAlbumData({ ...albumData, title_en: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1a3a2a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Album Title (Nepali) *</label>
                <input
                  required
                  value={albumData.title_np}
                  onChange={e => setAlbumData({ ...albumData, title_np: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1a3a2a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Cover Photo</label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="text"
                    value={albumData.cover_url}
                    onChange={e => setAlbumData({ ...albumData, cover_url: e.target.value })}
                    className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a] focus:border-transparent"
                    placeholder="URL or upload..."
                  />
                  <label className="bg-gray-100 border px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadCover} disabled={uploading} />
                  </label>
                </div>
                {uploading && <p className="text-xs text-emerald-600 mt-1 font-medium">Uploading cover...</p>}
              </div>
              {albumData.cover_url && (
                <div className="rounded-lg overflow-hidden border h-32 bg-gray-50">
                  <img src={albumData.cover_url} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAlbumModal(false); setEditingAlbum(null); }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1a3a2a] text-white py-2.5 rounded-lg font-bold hover:bg-[#2a5a4a] transition-colors"
                >
                  {editingAlbum ? "Save Changes" : "Create Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
