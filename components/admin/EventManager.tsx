"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Calendar, Loader2, Save, X, Table, List } from "lucide-react";

interface Event {
  id: number;
  title_en: string;
  title_np: string;
  date_bs: string;
  date_en: string;
  description_en?: string;
  description_np?: string;
  display_order: number;
}

interface CalendarMonth {
  id: number;
  month_name: string;
  month_index: number;
  days: string[];
}

export default function EventManager() {
  const [activeTab, setActiveTab] = useState<"list" | "wall">("list");
  
  // Events State
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventForm, setEventForm] = useState({
    title_en: "", title_np: "", date_bs: "", date_en: "", description_en: "", description_np: "", display_order: "0",
  });

  // Calendar State
  const [months, setMonths] = useState<CalendarMonth[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [savingCalendar, setSavingCalendar] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState("२०८३");
  const [savingYear, setSavingYear] = useState(false);

  useEffect(() => {
    if (activeTab === "list") {
      fetchEvents();
    } else {
      fetchCalendar();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await fetch("/api/events");
      if (res.ok) {
        const json = await res.json();
        setEvents(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchCalendar = async () => {
    try {
      setLoadingCalendar(true);
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const json = await res.json();
        setMonths(json.data || []);
      }
      // Also fetch the calendar year setting
      const settingsRes = await fetch("/api/settings");
      if (settingsRes.ok) {
        const settingsJson = await settingsRes.json();
        if (settingsJson.data?.calendar_year) {
          setCalendarYear(settingsJson.data.calendar_year);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCalendar(false);
    }
  };

  const saveCalendarYear = async () => {
    try {
      setSavingYear(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendar_year: calendarYear }),
      });
      if (res.ok) {
        alert("Calendar year updated successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingYear(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title_en || !eventForm.title_np || !eventForm.date_bs || !eventForm.date_en) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSavingEvent(true);
      const url = editingEventId ? `/api/events/${editingEventId}` : "/api/events";
      const method = editingEventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });

      if (res.ok) {
        setEventForm({ title_en: "", title_np: "", date_bs: "", date_en: "", description_en: "", description_np: "", display_order: "0" });
        setEditingEventId(null);
        fetchEvents();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDayChange = (monthIndex: number, dayIndex: number, val: string) => {
    setMonths(months.map(m => {
      if (m.month_index === monthIndex) {
        const newDays = [...m.days];
        newDays[dayIndex] = val;
        return { ...m, days: newDays };
      }
      return m;
    }));
  };

  const saveMonthRow = async (monthIndex: number, days: string[]) => {
    try {
      setSavingCalendar(monthIndex);
      const res = await fetch('/api/calendar', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month_index: monthIndex, days }),
      });
      if (!res.ok) alert("Failed to save row");
    } catch (error) {
      console.error(error);
    } finally {
      setSavingCalendar(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#c9a227]/20 pb-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#1a3a2a]">Calendar & Events Manager</h2>
          <p className="text-sm text-gray-500 font-sans mt-1">
            Manage upcoming highlighted events or directly edit the BS School Wall Chart grid.
          </p>
        </div>
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-colors ${activeTab === 'list' ? 'bg-white text-[#1a3a2a] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <List className="w-4 h-4" /> Highlighted Events
          </button>
          <button
            onClick={() => setActiveTab("wall")}
            className={`px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-colors ${activeTab === 'wall' ? 'bg-white text-[#1a3a2a] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Table className="w-4 h-4" /> BS Wall Chart Grid
          </button>
        </div>
      </div>

      {activeTab === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white border border-[#c9a227]/30 rounded-lg p-6 shadow-md parchment-glow lg:col-span-1">
            <h3 className="text-lg font-bold font-serif text-[#1a3a2a] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#c9a227]" />
              {editingEventId ? "Edit Highlights" : "Add Highlight"}
            </h3>

            <form onSubmit={handleEventSubmit} className="space-y-4 text-sm">
              <input required type="text" placeholder="Title (EN) *" value={eventForm.title_en} onChange={(e) => setEventForm({ ...eventForm, title_en: e.target.value })} className="w-full border rounded p-2.5 bg-[#fdf6e3]/10 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              <input required type="text" placeholder="Title (NP) *" value={eventForm.title_np} onChange={(e) => setEventForm({ ...eventForm, title_np: e.target.value })} className="w-full border rounded p-2.5 bg-[#fdf6e3]/10 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="BS Date *" value={eventForm.date_bs} onChange={(e) => setEventForm({ ...eventForm, date_bs: e.target.value })} className="w-full border rounded p-2.5 bg-[#fdf6e3]/10 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
                <input required type="date" value={eventForm.date_en} onChange={(e) => setEventForm({ ...eventForm, date_en: e.target.value })} className="w-full border rounded p-2 bg-[#fdf6e3]/10 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              </div>

              <textarea rows={2} placeholder="Description (EN)" value={eventForm.description_en} onChange={(e) => setEventForm({ ...eventForm, description_en: e.target.value })} className="w-full border rounded p-2.5 bg-[#fdf6e3]/10 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              <textarea rows={2} placeholder="Description (NP)" value={eventForm.description_np} onChange={(e) => setEventForm({ ...eventForm, description_np: e.target.value })} className="w-full border rounded p-2.5 bg-[#fdf6e3]/10 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={savingEvent} className="flex-1 bg-[#1a3a2a] text-white py-2.5 rounded font-bold flex items-center justify-center gap-2 hover:bg-black">
                  {savingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#c9a227]" />}
                  <span>Save</span>
                </button>
                {editingEventId && <button type="button" onClick={() => { setEditingEventId(null); setEventForm({ title_en: "", title_np: "", date_bs: "", date_en: "", description_en: "", description_np: "", display_order: "0" }); }} className="bg-gray-100 border px-4 rounded"><X className="w-4 h-4" /></button>}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {loadingEvents ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" />
            ) : events.map((ev) => (
              <div key={ev.id} className="bg-white p-5 rounded-lg border border-[#c9a227]/25 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="font-bold text-base text-[#1a3a2a]">{ev.title_en}</h4>
                    <span className="text-xs font-bold text-[#c9a227]">({ev.date_bs})</span>
                  </div>
                  <p className="text-xs text-gray-500 font-sans">{ev.title_np}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => {
                    setEditingEventId(ev.id);
                    setEventForm({ title_en: ev.title_en, title_np: ev.title_np, date_bs: ev.date_bs, date_en: ev.date_en, description_en: ev.description_en || "", description_np: ev.description_np || "", display_order: String(ev.display_order) });
                  }} className="p-2 text-gray-600 hover:text-emerald-700 border rounded-full"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 text-red-600 hover:text-red-800 border rounded-full"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "wall" && (
        <div className="bg-white rounded-lg shadow-sm border border-[#c9a227]/20 p-6 overflow-x-auto">
          <div className="mb-4">
            <h3 className="font-bold font-serif text-lg text-[#1a3a2a]">BS Calendar Grid Editor</h3>

            {/* Calendar Year Setting */}
            <div className="bg-[#1a3a2a]/5 p-3 border border-[#1a3a2a]/20 rounded-lg flex items-center gap-3 my-3">
              <label className="text-xs font-bold text-[#1a3a2a] whitespace-nowrap">शैक्षिक सत्र (Academic Year):</label>
              <input
                type="text"
                value={calendarYear}
                onChange={(e) => setCalendarYear(e.target.value)}
                placeholder="e.g. २०८३"
                className="border border-[#c9a227]/40 p-1.5 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1a3a2a] w-28 text-center font-bold"
              />
              <button
                onClick={saveCalendarYear}
                disabled={savingYear}
                className="bg-[#1a3a2a] hover:bg-black text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                {savingYear ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 text-[#c9a227]" />} Save Year
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">Edit the cells below. Type 📖 for regular study days, शनि for Saturday, आइत for Sunday.</p>

            {/* Bulk Fill / Indicator Creator */}
            <div className="bg-[#fdf6e3]/50 p-4 border border-[#c9a227]/30 rounded-lg flex flex-col md:flex-row gap-4 items-end mb-6 shadow-sm">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#1a3a2a] mb-1">Month</label>
                <select 
                  className="w-full border p-2 rounded text-sm bg-white border-[#c9a227]/40 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]"
                  id="bulkMonth"
                >
                  {months.map(m => <option key={m.id} value={m.month_index}>{m.month_name}</option>)}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs font-bold text-[#1a3a2a] mb-1">Start Day</label>
                <input type="number" id="bulkStart" min="1" max="32" defaultValue="1" className="w-full border p-2 rounded text-sm bg-white border-[#c9a227]/40 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              </div>
              <div className="w-24">
                <label className="block text-xs font-bold text-[#1a3a2a] mb-1">End Day</label>
                <input type="number" id="bulkEnd" min="1" max="32" defaultValue="1" className="w-full border p-2 rounded text-sm bg-white border-[#c9a227]/40 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#1a3a2a] mb-1">Indicator Text (e.g., विदा)</label>
                <input type="text" id="bulkText" placeholder="Indicator" className="w-full border p-2 rounded text-sm bg-white border-[#c9a227]/40 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]" />
              </div>
              <button 
                onClick={() => {
                  const mId = parseInt((document.getElementById("bulkMonth") as HTMLSelectElement).value);
                  const s = parseInt((document.getElementById("bulkStart") as HTMLInputElement).value);
                  const e = parseInt((document.getElementById("bulkEnd") as HTMLInputElement).value);
                  const txt = (document.getElementById("bulkText") as HTMLInputElement).value;
                  if (!txt) return alert("Please provide an indicator text");
                  if (s > e || s < 1 || e > 32) return alert("Invalid date range");
                  
                  setMonths(months.map(m => {
                    if (m.month_index === mId) {
                      const newDays = [...m.days];
                      for (let i = s - 1; i < e; i++) {
                        newDays[i] = txt;
                      }
                      return { ...m, days: newDays };
                    }
                    return m;
                  }));
                }}
                className="bg-[#c9a227] hover:bg-[#b08d22] text-white px-4 py-2 rounded text-sm font-bold shadow-sm whitespace-nowrap h-[38px]"
              >
                Apply to Grid
              </button>
            </div>
          </div>

          {loadingCalendar ? (
            <Loader2 className="w-8 h-8 animate-spin mx-auto my-12 text-[#1a3a2a]" />
          ) : (
            <div className="min-w-[1200px]">
              <table className="w-full text-sm text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#1a3a2a] text-white">
                    <th className="p-3 border">Month</th>
                    <th className="p-3 border w-24 text-center">Action</th>
                    {Array.from({ length: 32 }).map((_, i) => (
                      <th key={i} className="p-2 border text-center text-xs">{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {months.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 border font-bold text-[#1a3a2a] bg-gray-50">{m.month_name}</td>
                      <td className="p-2 border text-center bg-gray-50">
                        <button
                          onClick={() => saveMonthRow(m.month_index, m.days)}
                          disabled={savingCalendar === m.month_index}
                          className="px-3 py-1 bg-[#1a3a2a] hover:bg-black text-white text-xs font-bold rounded flex justify-center items-center gap-1 w-full"
                        >
                          {savingCalendar === m.month_index ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 text-[#c9a227]" />} Save
                        </button>
                      </td>
                      {Array.from({ length: 32 }).map((_, i) => (
                        <td key={i} className="p-0 border">
                          <input
                            type="text"
                            value={m.days[i] || ""}
                            onChange={(e) => handleDayChange(m.month_index, i, e.target.value)}
                            className="w-full h-10 px-1 text-center text-[10px] sm:text-xs focus:ring-2 focus:ring-[#c9a227] focus:outline-none focus:bg-[#fdf6e3] transition-colors"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
