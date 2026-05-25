"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Upload, X, User, ChevronDown } from "lucide-react";

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

const DEPARTMENTS = [
  "general",
  "Science",
  "Mathematics",
  "English",
  "Nepali",
  "Social Studies",
  "Computer Science",
  "HPE",
  "Administration",
  "Support Staff",
];

const inputCls = "w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#1a3a2a] focus:ring-1 focus:ring-[#1a3a2a]/20 transition-all bg-white";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

export default function FacultyManager() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const emptyForm = {
    name_en: "",
    name_np: "",
    role_en: "",
    role_np: "",
    department: "general",
    qualification: "",
    photo_url: "",
    display_order: 0,
    is_active: true,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const set = (k: string, v: any) => setFormData(p => ({ ...p, [k]: v }));

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

  useEffect(() => { fetchStaff(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "faculty");
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) set("photo_url", json.url);
      else alert("Upload failed: " + json.error);
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
        body: JSON.stringify({ ...formData, display_order: Number(formData.display_order) }),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingStaff(null);
        setFormData(emptyForm);
        fetchStaff();
      } else {
        const err = await res.json();
        alert("Failed to save: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this staff member?")) return;
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) fetchStaff();
    } catch (error) { console.error(error); }
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
      is_active: s.is_active,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif text-[#1a3a2a]">Faculty & Staff Manager</h2>
        <button
          onClick={() => { setEditingStaff(null); setFormData(emptyForm); setShowModal(true); }}
          className="bg-[#1a3a2a] text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#2a5a4a] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {loading && <p className="text-center text-gray-400 py-8">Loading staff...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((s) => (
          <div key={s.id} className="bg-white rounded-lg shadow-sm p-4 border border-[#c9a227]/20 flex gap-4 items-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
              {s.photo_url ? (
                <img src={s.photo_url} alt={s.name_en} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1a3a2a] truncate">{s.name_en}</h3>
              <p className="text-sm text-gray-500 truncate">{s.role_en}</p>
              <span className="inline-block text-xs bg-[#fdf6e3] text-[#c9a227] border border-[#c9a227]/30 rounded px-2 py-0.5 mt-1">{s.department}</span>
              {!s.is_active && <span className="ml-1 inline-block text-xs bg-gray-100 text-gray-400 rounded px-2 py-0.5">Inactive</span>}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => openEdit(s)} className="text-[#c9a227] hover:text-[#a08020] p-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!loading && staff.length === 0 && (
          <div className="col-span-3 text-center text-gray-400 py-12">No staff members yet. Click "Add Staff Member" to get started!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold font-serif text-[#1a3a2a]">
                  {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Fill in all required fields (*)</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* ── Photo Section ─────────────────────────────────────── */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-[#c9a227]/40 bg-white flex items-center justify-center shadow-sm">
                  {formData.photo_url ? (
                    <img src={formData.photo_url} className="w-full h-full object-cover" alt="Staff preview" />
                  ) : (
                    <User className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className={labelCls}>Photo / Avatar</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.photo_url}
                      onChange={e => set("photo_url", e.target.value)}
                      className={`${inputCls} flex-1`}
                      placeholder="Paste an image URL or click Upload →"
                    />
                    <label className="bg-[#1a3a2a] text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-[#2a5a4a] text-sm shrink-0 flex items-center gap-1.5 font-semibold transition-colors whitespace-nowrap">
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading…" : "Upload"}
                      <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Name ─────────────────────────────────────────────── */}
              <fieldset className="space-y-2">
                <legend className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>English *</label>
                    <input
                      required
                      value={formData.name_en}
                      onChange={e => set("name_en", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Ram Prasad Sharma"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Nepali (नेपाली) *</label>
                    <input
                      required
                      value={formData.name_np}
                      onChange={e => set("name_np", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. राम प्रसाद शर्मा"
                    />
                  </div>
                </div>
              </fieldset>

              {/* ── Role / Position ───────────────────────────────────── */}
              <fieldset className="space-y-2">
                <legend className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role / Position</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>English *</label>
                    <input
                      required
                      value={formData.role_en}
                      onChange={e => set("role_en", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Science Teacher"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Nepali (नेपाली) *</label>
                    <input
                      required
                      value={formData.role_np}
                      onChange={e => set("role_np", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. विज्ञान शिक्षक"
                    />
                  </div>
                </div>
              </fieldset>

              {/* ── Department & Qualification ─────────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Department *</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.department}
                      onChange={e => set("department", e.target.value)}
                      className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Qualification</label>
                  <input
                    value={formData.qualification}
                    onChange={e => set("qualification", e.target.value)}
                    className={inputCls}
                    placeholder="e.g. M.Ed., B.Sc., MBA"
                  />
                </div>
              </div>

              {/* ── Display Order & Active Status ─────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={e => set("display_order", e.target.value)}
                    className={inputCls}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower number = shown first on the website</p>
                </div>
                <div>
                  <label className={labelCls}>Active Status</label>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => set("is_active", !formData.is_active)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none shadow-inner ${
                        formData.is_active ? "bg-[#1a3a2a]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          formData.is_active ? "translate-x-8" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-semibold ${formData.is_active ? "text-[#1a3a2a]" : "text-gray-400"}`}>
                      {formData.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Inactive staff won't appear publicly</p>
                </div>
              </div>

              {/* ── Form Actions ──────────────────────────────────────── */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c9a227] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#b08d20] text-sm transition-colors shadow-sm"
                >
                  {editingStaff ? "Update Staff" : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
