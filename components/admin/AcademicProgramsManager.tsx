"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Edit, Trash2, Plus, RefreshCw, GripVertical, X } from "lucide-react";

export default function AcademicProgramsManager() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [levelEn, setLevelEn] = useState("");
  const [levelNp, setLevelNp] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descNp, setDescNp] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [subjectsList, setSubjectsList] = useState<{ name_en: string; name_np: string }[]>([]);
  const [newSubjectEn, setNewSubjectEn] = useState("");
  const [newSubjectNp, setNewSubjectNp] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academic-programs");
      if (res.ok) {
        const json = await res.json();
        setPrograms(json.data || []);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      level_en: levelEn,
      level_np: levelNp,
      description_en: descEn,
      description_np: descNp,
      subjects: subjectsList,
      is_active: isActive,
      display_order: displayOrder
    };

    try {
      if (isEditing && editingId) {
        const res = await fetch(`/api/academic-programs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          alert("Program updated!");
          resetForm();
          fetchPrograms();
        } else {
          alert("Failed to update program");
        }
      } else {
        const res = await fetch("/api/academic-programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          alert("Program added!");
          resetForm();
          fetchPrograms();
        } else {
          alert("Failed to add program");
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  const handleEdit = (p: any) => {
    setIsEditing(true);
    setEditingId(p.id);
    setLevelEn(p.level_en);
    setLevelNp(p.level_np);
    setDescEn(p.description_en);
    setDescNp(p.description_np);
    setIsActive(p.is_active);
    setDisplayOrder(p.display_order);
    setSubjectsList(p.subjects || []);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`/api/academic-programs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPrograms();
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addSubject = () => {
    if (!newSubjectEn.trim()) return;
    setSubjectsList([...subjectsList, { name_en: newSubjectEn.trim(), name_np: newSubjectNp.trim() || newSubjectEn.trim() }]);
    setNewSubjectEn("");
    setNewSubjectNp("");
  };

  const removeSubject = (index: number) => {
    setSubjectsList(subjectsList.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setLevelEn("");
    setLevelNp("");
    setDescEn("");
    setDescNp("");
    setIsActive(true);
    setDisplayOrder(0);
    setSubjectsList([]);
    setNewSubjectEn("");
    setNewSubjectNp("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#c9a227]/30 overflow-hidden">
      <div className="bg-[#1a3a2a] p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#c9a227]" />
          Academic Programs Manager
        </h2>
        <button
          onClick={fetchPrograms}
          className="p-2 hover:bg-[#c9a227]/20 rounded-full transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-[#1a3a2a] mb-4 flex items-center gap-2">
              {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? "Edit Program" : "Add New Program"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Level (English)</label>
                <input required value={levelEn} onChange={e => setLevelEn(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="e.g. Primary (Grades 1-8)" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Level (Nepali)</label>
                <input required value={levelNp} onChange={e => setLevelNp(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="e.g. आधारभूत तह (कक्षा १-८)" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (English)</label>
                <textarea required rows={3} value={descEn} onChange={e => setDescEn(e.target.value)} className="w-full border rounded p-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (Nepali)</label>
                <textarea required rows={3} value={descNp} onChange={e => setDescNp(e.target.value)} className="w-full border rounded p-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subjects</label>
                {subjectsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {subjectsList.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-[#1a3a2a]/5 text-[#1a3a2a] border border-[#1a3a2a]/15 text-[11px] font-semibold px-2 py-1 rounded-md">
                        {s.name_en}
                        <button type="button" onClick={() => removeSubject(i)} className="text-red-500 hover:text-red-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-1">
                  <input value={newSubjectEn} onChange={e => setNewSubjectEn(e.target.value)} placeholder="Subject (EN)" className="flex-1 border rounded p-2 text-xs" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubject())} />
                  <input value={newSubjectNp} onChange={e => setNewSubjectNp(e.target.value)} placeholder="(NP)" className="w-20 border rounded p-2 text-xs" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubject())} />
                  <button type="button" onClick={addSubject} className="bg-[#1a3a2a] text-white px-2.5 py-1.5 rounded text-xs font-bold hover:bg-[#2a5a4a] whitespace-nowrap">+ Add</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Order</label>
                  <input type="number" value={displayOrder} onChange={e => setDisplayOrder(parseInt(e.target.value))} className="w-full border rounded p-2 text-sm" />
                </div>
                <div className="flex items-center mt-6">
                  <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="mr-2" />
                  <label htmlFor="isActive" className="text-sm">Is Active?</label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#1a3a2a] text-white py-2 rounded font-bold hover:bg-[#102419]">
                  {isEditing ? "Update" : "Save"}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="px-4 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading programs...</div>
          ) : programs.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded border border-dashed">
              No academic programs found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map((p) => (
                <div key={p.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white shadow-sm hover:border-[#c9a227]/50 transition-colors">
                  <div className="text-gray-300 cursor-move pt-1">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#1a3a2a]">{p.level_en}</h4>
                        <h5 className="text-sm text-gray-600 mb-2">{p.level_np}</h5>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs mt-2">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500">Order: {p.display_order}</span>
                      <span className="text-gray-500">{p.subjects?.length || 0} subjects</span>
                    </div>
                    {p.subjects && p.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.subjects.map((s: any, i: number) => {
                          const label = typeof s === 'string' ? s : (s.name_en || s.name_np || '');
                          return (
                            <span key={i} className="bg-[#1a3a2a]/5 text-[#1a3a2a] border border-[#1a3a2a]/15 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
