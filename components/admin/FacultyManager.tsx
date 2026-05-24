"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Upload, X } from "lucide-react";

interface Staff {
  id: number;
  name_en: string;
  name_np: string;
  role_en: string;
  role_np: string;
  department: string;
  qualification: string | null;
  photo_url: string | null;
  is_active: boolean;
  display_order: number;
}

export default function FacultyManager() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState({
    name_en: "",
    name_np: "",
    role_en: "",
    role_np: "",
    department: "general",
    qualification: "",
    photo_url: "",
    display_order: 0,
    is_active: true
  });
  
  const [uploading, setUploading] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff");
      if (res.ok) {
        const json = await res.json();
        setStaff(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "faculty");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setFormData(prev => ({ ...prev, photo_url: json.url }));
      } else {
        alert("Upload failed: " + json.error);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : "/api/staff";
      const method = editingStaff ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchStaff();
        setEditingStaff(null);
        setFormData({
          name_en: "", name_np: "", role_en: "", role_np: "", department: "general", qualification: "", photo_url: "", display_order: 0, is_active: true
        });
      } else {
        alert("Failed to save staff");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) fetchStaff();
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      name_en: s.name_en,
      name_np: s.name_np,
      role_en: s.role_en,
      role_np: s.role_np,
      department: s.department,
      qualification: s.qualification || "",
      photo_url: s.photo_url || "",
      display_order: s.display_order,
      is_active: s.is_active
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif text-[#1a3a2a]">Faculty & Staff Manager</h2>
        <button 
          onClick={() => {
            setEditingStaff(null);
            setFormData({ name_en: "", name_np: "", role_en: "", role_np: "", department: "general", qualification: "", photo_url: "", display_order: 0, is_active: true });
            setShowModal(true);
          }}
          className="bg-[#1a3a2a] text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#2a5a4a] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((s) => (
          <div key={s.id} className="bg-white rounded shadow p-4 border border-[#c9a227]/20 flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
              {s.photo_url ? (
                <img src={s.photo_url} alt={s.name_en} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1a3a2a] truncate">{s.name_en}</h3>
              <p className="text-sm text-gray-600 truncate">{s.role_en}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(s)} className="text-[#c9a227] hover:text-[#a08020]"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold font-serif">{editingStaff ? "Edit Staff" : "Add New Staff"}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Name (English) *</label>
                  <input required value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Name (Nepali) *</label>
                  <input required value={formData.name_np} onChange={e => setFormData({...formData, name_np: e.target.value})} className="w-full border rounded p-2 font-sans" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Role (English) *</label>
                  <input required value={formData.role_en} onChange={e => setFormData({...formData, role_en: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Role (Nepali) *</label>
                  <input required value={formData.role_np} onChange={e => setFormData({...formData, role_np: e.target.value})} className="w-full border rounded p-2 font-sans" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-semibold">Avatar / Photo URL</label>
                <div className="flex gap-4 items-center">
                  {formData.photo_url && (
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border"><img src={formData.photo_url} className="w-full h-full object-cover" /></div>
                  )}
                  <div className="flex-1">
                    <input type="text" value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="URL or upload..." />
                  </div>
                  <label className="bg-[#1a3a2a] text-white px-3 py-2 rounded cursor-pointer hover:bg-[#2a5a4a] text-sm shrink-0 flex items-center gap-1">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload"}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-[#c9a227] text-white px-4 py-2 rounded font-bold hover:bg-[#b08d20]">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
