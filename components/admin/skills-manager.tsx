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
import { SkillDocument, SkillCategory } from "@/types/firestore";
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
  Cpu,
  Layers,
} from "lucide-react";

const CATEGORIES: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps",
  "Cloud",
  "Tools",
];

export function SkillsManager() {
  const [skills, setSkills] = useState<SkillDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillDocument> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const fetchSkills = React.useCallback(async () => {
    try {
      setLoading(true);
      const db = getFirebaseDb();
      const q = query(collection(db, "skills"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: SkillDocument[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<SkillDocument, "id">) });
      });
      setSkills(list);
    } catch (err: any) {
      console.error("Error fetching skills:", err);
      toast(err?.message || "Failed to load skills.", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleOpenNew = (defaultCategory?: SkillCategory) => {
    setIsNew(true);
    setEditingSkill({
      name: "",
      category: defaultCategory || "Languages",
      proficiency: 85,
      order: skills.length + 1,
    });
  };

  const handleOpenEdit = (skill: SkillDocument) => {
    setIsNew(false);
    setEditingSkill({ ...skill });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setSaving(true);

    try {
      const db = getFirebaseDb();
      if (isNew) {
        await addDoc(collection(db, "skills"), {
          name: editingSkill.name || "",
          category: editingSkill.category || "Languages",
          proficiency: Number(editingSkill.proficiency) || 0,
          order: Number(editingSkill.order) || skills.length + 1,
        });
        toast("Skill added!", "success");
      } else if (editingSkill.id) {
        const docRef = doc(db, "skills", editingSkill.id);
        await updateDoc(docRef, {
          name: editingSkill.name,
          category: editingSkill.category,
          proficiency: Number(editingSkill.proficiency),
          order: Number(editingSkill.order),
        });
        toast("Skill updated!", "success");
      }
      setEditingSkill(null);
      await fetchSkills();
    } catch (err: any) {
      console.error("Save skill error:", err);
      toast(err?.message || "Failed to save skill.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this skill?")) return;
    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, "skills", id));
      toast("Skill removed.", "info");
      await fetchSkills();
    } catch (err: any) {
      toast(err?.message || "Failed to delete skill.", "error");
    }
  };

  const moveOrder = async (
    categorySkills: SkillDocument[],
    index: number,
    direction: "up" | "down"
  ) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categorySkills.length) return;

    const currentItem = categorySkills[index];
    const targetItem = categorySkills[targetIndex];
    if (!currentItem.id || !targetItem.id) return;

    try {
      const db = getFirebaseDb();
      const tempOrder = currentItem.order;
      await updateDoc(doc(db, "skills", currentItem.id), { order: targetItem.order });
      await updateDoc(doc(db, "skills", targetItem.id), { order: tempOrder });
      await fetchSkills();
    } catch (err: any) {
      toast("Failed to reorder skills.", "error");
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Skills & Competency Arsenal
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Manages technical categories, chips, and proficiency indicators.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenNew()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Edit / Add Modal Form */}
      {editingSkill && (
        <div className="p-6 rounded-xl border border-emerald-500/40 bg-white/90 dark:bg-zinc-950/90 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>{isNew ? "New Technical Skill" : "Edit Technical Skill"}</span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">SKILL_NAME:</label>
              <input
                type="text"
                required
                value={editingSkill.name || ""}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                placeholder="TypeScript / Docker / PostgreSQL"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">CATEGORY:</label>
              <select
                value={editingSkill.category || "Languages"}
                onChange={(e) =>
                  setEditingSkill({ ...editingSkill, category: e.target.value as SkillCategory })
                }
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-600 dark:text-zinc-400">PROFICIENCY (0-100%):</label>
                <span className="text-emerald-500 font-bold">{editingSkill.proficiency || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editingSkill.proficiency ?? 80}
                onChange={(e) =>
                  setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })
                }
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">ORDER:</label>
              <input
                type="number"
                value={editingSkill.order || 1}
                onChange={(e) => setEditingSkill({ ...editingSkill, order: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
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
                <span>Save Skill</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categorized Skills View */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          <span>Loading skills...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((cat) => {
            const catSkills = skills
              .filter((s) => s.category === cat)
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            return (
              <div
                key={cat}
                className="p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span>{cat}</span>
                    <span className="text-zinc-400 text-[11px] font-normal">
                      ({catSkills.length} skills)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenNew(cat)}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-400 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to {cat}</span>
                  </button>
                </div>

                {catSkills.length === 0 ? (
                  <div className="text-zinc-400 italic py-2 text-xs">No skills in this category.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                    {catSkills.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 flex items-center justify-between gap-2 group hover:border-emerald-500/40 transition-all shadow-sm"
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="font-bold text-zinc-900 dark:text-white truncate">
                            {item.name}
                          </div>
                          {typeof item.proficiency === "number" && (
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                              <div className="w-12 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500"
                                  style={{ width: `${item.proficiency}%` }}
                                />
                              </div>
                              <span>{item.proficiency}%</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveOrder(catSkills, index, "up")}
                            disabled={index === 0}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveOrder(catSkills, index, "down")}
                            disabled={index === catSkills.length - 1}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 rounded text-zinc-400 hover:text-emerald-400"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded text-zinc-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
