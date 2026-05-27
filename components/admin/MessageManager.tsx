"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Loader2,
  CheckCircle,
  Clock,
  Phone,
  User,
  MessageSquare,
  Eye,
  Download,
  Search,
  Filter,
} from "lucide-react";

interface Message {
  id: number;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  admin_notes: string | null;
  submitted_at: string;
}

export default function MessageManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read" | "replied">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages");
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateMessage = async (id: number, data: Record<string, unknown>) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...json.data } : m))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Delete this message permanently?")) return;
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: number) => {
    await updateMessage(id, { admin_notes: notesInput });
  };

  const handleExportCSV = () => {
    const headers = "ID,Name,Email,Phone,Message,Status,Submitted At\n";
    const rows = messages
      .map(
        (m) =>
          `${m.id},"${m.sender_name}","${m.sender_email}","${m.sender_phone || ""}","${m.message.replace(/"/g, '""')}",${m.is_replied ? "Replied" : m.is_read ? "Read" : "Unread"},${new Date(m.submitted_at).toLocaleDateString()}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "JSSS_Messages.csv";
    link.click();
  };

  const filteredMessages = messages.filter((m) => {
    if (filterStatus === "unread" && m.is_read) return false;
    if (filterStatus === "read" && (!m.is_read || m.is_replied)) return false;
    if (filterStatus === "replied" && !m.is_replied) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.sender_name.toLowerCase().includes(q) ||
        m.sender_email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c9a227]/20 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Messages</div>
          <div className="text-2xl font-bold text-[#1a3a2a] mt-1">{messages.length}</div>
        </div>
        <div className="bg-white border border-[#8b1a1a]/20 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Unread</div>
          <div className="text-2xl font-bold text-[#8b1a1a] mt-1">{unreadCount}</div>
        </div>
        <div className="bg-white border border-[#c9a227]/20 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Read</div>
          <div className="text-2xl font-bold text-[#444444] mt-1">
            {messages.filter((m) => m.is_read && !m.is_replied).length}
          </div>
        </div>
        <div className="bg-white border border-[#1a3a2a]/20 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Replied</div>
          <div className="text-2xl font-bold text-[#1a3a2a] mt-1">
            {messages.filter((m) => m.is_replied).length}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-[#c9a227]/20 p-4 rounded-lg shadow-sm">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#c9a227]/30 rounded text-sm bg-[#fdf6e3]/30 focus:outline-none focus:border-[#1a3a2a]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            {(["all", "unread", "read", "replied"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded text-xs font-bold capitalize transition-colors ${
                  filterStatus === f
                    ? "bg-[#1a3a2a] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-[#8b1a1a] text-white rounded-full text-[9px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-[#c9a227] text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-[#b08d22]"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#1a3a2a] animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-medium">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No messages found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white border rounded-lg shadow-sm transition-all overflow-hidden ${
                !msg.is_read
                  ? "border-l-4 border-l-[#8b1a1a] border-[#8b1a1a]/20"
                  : msg.is_replied
                  ? "border-l-4 border-l-[#1a3a2a] border-[#1a3a2a]/20"
                  : "border-[#c9a227]/20"
              }`}
            >
              {/* Message Header Row */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#fdf6e3]/30 transition-colors"
                onClick={() => {
                  const newId = expandedId === msg.id ? null : msg.id;
                  setExpandedId(newId);
                  if (newId && !msg.is_read) {
                    updateMessage(msg.id, { is_read: true });
                  }
                  if (newId) {
                    setNotesInput(msg.admin_notes || "");
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Status Icon */}
                  <div className="shrink-0">
                    {msg.is_replied ? (
                      <CheckCircle className="w-5 h-5 text-[#1a3a2a]" />
                    ) : msg.is_read ? (
                      <MailOpen className="w-5 h-5 text-[#c9a227]" />
                    ) : (
                      <Mail className="w-5 h-5 text-[#8b1a1a]" />
                    )}
                  </div>

                  {/* Sender Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#1a3a2a]">{msg.sender_name}</span>
                      {!msg.is_read && (
                        <span className="px-1.5 py-0.5 bg-[#8b1a1a] text-white text-[9px] font-bold rounded-full uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{msg.message}</p>
                  </div>

                  {/* Date */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.submitted_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(msg.submitted_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === msg.id && (
                <div className="border-t border-[#c9a227]/20 p-5 bg-[#fdf6e3]/20">
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-[#c9a227]" />
                      <span className="font-bold text-[#1a3a2a]">{msg.sender_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-[#c9a227]" />
                      <a href={`mailto:${msg.sender_email}`} className="text-blue-700 underline">
                        {msg.sender_email}
                      </a>
                    </div>
                    {msg.sender_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-[#c9a227]" />
                        <a href={`tel:${msg.sender_phone}`} className="text-blue-700 underline">
                          {msg.sender_phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Full Message */}
                  <div className="bg-white border border-[#c9a227]/20 rounded-lg p-4 mb-4">
                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-2">Full Message</div>
                    <p className="text-sm text-[#444444] whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  </div>

                  {/* Admin Notes */}
                  <div className="mb-4">
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Admin Notes</label>
                    <textarea
                      rows={2}
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Add internal notes about this message..."
                      className="w-full p-2.5 border border-[#c9a227]/30 rounded text-sm bg-white focus:outline-none focus:border-[#1a3a2a]"
                    />
                    <button
                      onClick={() => handleSaveNotes(msg.id)}
                      disabled={updatingId === msg.id}
                      className="mt-2 px-4 py-1.5 bg-[#1a3a2a] text-white rounded text-xs font-bold hover:bg-[#102419]"
                    >
                      {updatingId === msg.id ? "Saving..." : "Save Notes"}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 border-t border-[#c9a227]/20 pt-4">
                    {!msg.is_read && (
                      <button
                        onClick={() => updateMessage(msg.id, { is_read: true })}
                        disabled={updatingId === msg.id}
                        className="px-3 py-1.5 bg-[#c9a227] text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-[#b08d22]"
                      >
                        <Eye className="w-3 h-3" /> Mark as Read
                      </button>
                    )}
                    {!msg.is_replied && (
                      <button
                        onClick={() => updateMessage(msg.id, { is_replied: true, is_read: true })}
                        disabled={updatingId === msg.id}
                        className="px-3 py-1.5 bg-[#1a3a2a] text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-[#102419]"
                      >
                        <Reply className="w-3 h-3" /> Mark as Replied
                      </button>
                    )}
                    {msg.is_replied && (
                      <button
                        onClick={() => updateMessage(msg.id, { is_replied: false })}
                        disabled={updatingId === msg.id}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-bold flex items-center gap-1 hover:bg-gray-300"
                      >
                        Undo Replied
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      disabled={updatingId === msg.id}
                      className="px-3 py-1.5 bg-[#8b1a1a] text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-[#721515] ml-auto"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
