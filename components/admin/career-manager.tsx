"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { CareerLogDocument, CareerLogType } from "@/types/firestore";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Save,
  X,
  GitCommit,
  GraduationCap,
  Briefcase,
  Trophy,
  Rocket,
} from "lucide-react";

const TYPES: { label: string; value: CareerLogType }[] = [
  { label: "Work Experience", value: "work" },
  { label: "Education", value: "education" },
  { label: "Achievement", value: "achievement" },
  { label: "Milestone", value: "milestone" },
];

export function CareerManager() {
  const [logs, setLogs] = useState<CareerLogDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingLog, setEditingLog] = useState<Partial<CareerLogDocument> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const fetchLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const db = getFirebaseDb();
      const q = query(collection(db, "careerLog"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: CareerLogDocument[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<CareerLogDocument, "id">) });
      });
      setLogs(list);
    } catch (err: any) {
      console.error("Error fetching career logs:", err);
      toast(err?.message || "Failed to load career logs.", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingLog({
      date: "",
      type: "work",
      title: "",
      description: "",
      order: logs.length + 1,
    });
  };

  const handleOpenEdit = (log: CareerLogDocument) => {
    setIsNew(false);
    setEditingLog({ ...log });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    setSaving(true);

    try {
      const db = getFirebaseDb();
      if (isNew) {
        await addDoc(collection(db, "careerLog"), {
          date: editingLog.date || "",
          type: editingLog.type || "work",
          title: editingLog.title || "",
          description: editingLog.description || "",
          order: Number(editingLog.order) || logs.length + 1,
          createdAt: new Date().toISOString(),
        });
        toast("Career log entry added!", "success");
      } else if (editingLog.id) {
        const docRef = doc(db, "careerLog", editingLog.id);
        await updateDoc(docRef, {
          date: editingLog.date,
          type: editingLog.type,
          title: editingLog.title,
          description: editingLog.description,
          order: Number(editingLog.order),
        });
        toast("Career log entry updated!", "success");
      }
      setEditingLog(null);
      await fetchLogs();
    } catch (err: any) {
      console.error("Save career log error:", err);
      toast(err?.message || "Failed to save career log.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this career log entry?")) return;
    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, "careerLog", id));
      toast("Career log entry removed.", "info");
      await fetchLogs();
    } catch (err: any) {
      toast(err?.message || "Failed to delete entry.", "error");
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= logs.length) return;

    const currentItem = logs[index];
    const targetItem = logs[targetIndex];
    if (!currentItem.id || !targetItem.id) return;

    try {
      const db = getFirebaseDb();
      const tempOrder = currentItem.order;
      await updateDoc(doc(db, "careerLog", currentItem.id), { order: targetItem.order });
      await updateDoc(doc(db, "careerLog", targetItem.id), { order: tempOrder });
      await fetchLogs();
    } catch (err: any) {
      toast("Failed to reorder items.", "error");
    }
  };

  const getLogIcon = (type: CareerLogType) => {
    switch (type) {
      case "education":
        return <GraduationCap className="w-4 h-4 text-cyan-400" />;
      case "work":
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case "achievement":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case "milestone":
        return <Rocket className="w-4 h-4 text-purple-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Career Log & Git Graph Timeline
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Manages events displayed in the `career.log` git timeline.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Log Entry</span>
        </button>
      </div>

      {/* Edit / Add Modal Form */}
      {editingLog && (
        <div className="p-6 rounded-xl border border-emerald-500/40 bg-white/90 dark:bg-zinc-950/90 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-emerald-500" />
              <span>{isNew ? "New Career Commit" : "Edit Career Commit"}</span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingLog(null)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">DATE (e.g. Aug 2026):</label>
              <input
                type="text"
                required
                value={editingLog.date || ""}
                onChange={(e) => setEditingLog({ ...editingLog, date: e.target.value })}
                placeholder="Aug 2026"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">TYPE:</label>
              <select
                value={editingLog.type || "work"}
                onChange={(e) =>
                  setEditingLog({ ...editingLog, type: e.target.value as CareerLogType })
                }
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">TITLE:</label>
              <input
                type="text"
                required
                value={editingLog.title || ""}
                onChange={(e) => setEditingLog({ ...editingLog, title: e.target.value })}
                placeholder="Software Engineering Intern @ CloudScale"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">DESCRIPTION:</label>
              <textarea
                rows={3}
                required
                value={editingLog.description || ""}
                onChange={(e) => setEditingLog({ ...editingLog, description: e.target.value })}
                placeholder="Architected real-time streaming pipelines processing 2M+ events/min..."
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">ORDER (Sort priority):</label>
              <input
                type="number"
                value={editingLog.order || 1}
                onChange={(e) => setEditingLog({ ...editingLog, order: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingLog(null)}
                className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Entry</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          <span>Loading career log entries...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
          No career logs found. Click &quot;Add Log Entry&quot; above to create your first commit.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-black/5 dark:bg-white/5 inline-flex items-center justify-center">
                    {getLogIcon(item.type)}
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-white">{item.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {item.type}
                  </span>
                </div>
                <div className="text-zinc-500 text-[11px] flex items-center gap-3 pl-6">
                  <span>Date: {item.date}</span>
                  <span>•</span>
                  <span>Order: #{item.order}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-sans text-xs pl-6">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => moveOrder(index, "up")}
                  disabled={index === 0}
                  className="p-2 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveOrder(index, "down")}
                  disabled={index === logs.length - 1}
                  className="p-2 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
