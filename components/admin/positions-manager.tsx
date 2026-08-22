"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { PositionDocument } from "@/types/firestore";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ShieldCheck,
  Loader2,
  Calendar,
} from "lucide-react";

export function PositionsManager() {
  const [positions, setPositions] = useState<PositionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<PositionDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchPositions = async () => {
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, "positions"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: PositionDocument[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<PositionDocument, "id">) });
      });
      setPositions(list);
    } catch (err: any) {
      console.error("Error loading positions:", err);
      toast("Failed to load positions from Firestore", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingItem({
      title: "",
      organization: "",
      duration: "",
      description: "",
      order: positions.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PositionDocument) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim() || !editingItem.organization.trim()) {
      toast("Title and Organization are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const db = getFirebaseDb();
      const docId = editingItem.id || `pos_${Date.now()}`;
      const docRef = doc(db, "positions", docId);

      const payload = {
        title: editingItem.title.trim(),
        organization: editingItem.organization.trim(),
        duration: editingItem.duration?.trim() || "",
        description: editingItem.description?.trim() || "",
        order: Number(editingItem.order) || 0,
        updatedAt: new Date().toISOString(),
        ...(editingItem.id ? {} : { createdAt: new Date().toISOString() }),
      };

      await setDoc(docRef, payload, { merge: true });
      toast(
        editingItem.id ? "Position updated successfully!" : "New leadership position added!",
        "success"
      );
      setIsModalOpen(false);
      setEditingItem(null);
      fetchPositions();
    } catch (err: any) {
      console.error("Save position error:", err);
      toast(err?.message || "Failed to save position entry.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete position "${title}"?`)) return;

    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, "positions", id));
      toast("Position deleted successfully.", "success");
      setPositions((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error("Delete position error:", err);
      toast("Failed to delete position.", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-zinc-400 font-mono text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        <span>Loading leadership positions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Bar / Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Positions of Responsibility &amp; Leadership</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Manage leadership roles displayed on `#positions`.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Positions List View */}
      <div className="space-y-3">
        {positions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-black/10 dark:border-white/10 rounded-xl text-zinc-400">
            No positions logged yet. Click &quot;Add Position&quot; to create one.
          </div>
        ) : (
          positions.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2 flex-grow">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    order: {item.order}
                  </span>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    @{item.organization}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.duration}</span>
                </div>

                <p className="font-sans text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300"
                  title="Edit Position"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id!, item.title)}
                  className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10"
                  title="Delete Position"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Position Modal Dialog */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111116] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{editingItem.id ? "Edit Position" : "Add Position Entry"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    ROLE_TITLE:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    placeholder="e.g. Lead Technical Coordinator"
                    className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    ORGANIZATION / CLUB:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, organization: e.target.value })
                    }
                    placeholder="e.g. IIT Roorkee Programming Society"
                    className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    DURATION:
                  </label>
                  <input
                    type="text"
                    value={editingItem.duration}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, duration: e.target.value })
                    }
                    placeholder="e.g. Aug 2024 - Present"
                    className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    SORT_ORDER:
                  </label>
                  <input
                    type="number"
                    value={editingItem.order}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                  RESPONSIBILITIES &amp; IMPACT:
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  placeholder="Describe your leadership contributions, events organized, mentorship, and key deliverables."
                  className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Position</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
