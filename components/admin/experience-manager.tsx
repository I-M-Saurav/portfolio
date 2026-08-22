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
import { ExperienceDocument } from "@/types/firestore";
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
  Briefcase,
  Layers,
} from "lucide-react";

export function ExperienceManager() {
  const [experiences, setExperiences] = useState<ExperienceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingExp, setEditingExp] = useState<{
    id?: string;
    company: string;
    role: string;
    duration: string;
    location: string;
    description: string[];
    techStackInput: string;
    order: number;
  } | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const fetchExperiences = React.useCallback(async () => {
    try {
      setLoading(true);
      const db = getFirebaseDb();
      const q = query(collection(db, "experience"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: ExperienceDocument[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ExperienceDocument, "id">) });
      });
      setExperiences(list);
    } catch (err: any) {
      console.error("Error fetching experiences:", err);
      toast(err?.message || "Failed to load experiences.", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingExp({
      company: "",
      role: "",
      duration: "Jun 2025 - Aug 2025",
      location: "",
      description: [""],
      techStackInput: "TypeScript, React, Node.js",
      order: experiences.length + 1,
    });
  };

  const handleOpenEdit = (exp: ExperienceDocument) => {
    setIsNew(false);
    setEditingExp({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      duration: exp.duration,
      location: exp.location,
      description: exp.description && exp.description.length > 0 ? [...exp.description] : [""],
      techStackInput: (exp.techStack || []).join(", "),
      order: exp.order || 1,
    });
  };

  const addBullet = () => {
    if (!editingExp) return;
    setEditingExp({ ...editingExp, description: [...editingExp.description, ""] });
  };

  const removeBullet = (index: number) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      description: editingExp.description.filter((_, i) => i !== index),
    });
  };

  const updateBullet = (index: number, val: string) => {
    if (!editingExp) return;
    const updated = [...editingExp.description];
    updated[index] = val;
    setEditingExp({ ...editingExp, description: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);

    try {
      const db = getFirebaseDb();
      const techStack = editingExp.techStackInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const description = editingExp.description
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      if (isNew) {
        await addDoc(collection(db, "experience"), {
          company: editingExp.company,
          role: editingExp.role,
          duration: editingExp.duration,
          location: editingExp.location,
          description,
          techStack,
          order: Number(editingExp.order) || experiences.length + 1,
          createdAt: new Date().toISOString(),
        });
        toast("Experience item added!", "success");
      } else if (editingExp.id) {
        const docRef = doc(db, "experience", editingExp.id);
        await updateDoc(docRef, {
          company: editingExp.company,
          role: editingExp.role,
          duration: editingExp.duration,
          location: editingExp.location,
          description,
          techStack,
          order: Number(editingExp.order),
        });
        toast("Experience item updated!", "success");
      }
      setEditingExp(null);
      await fetchExperiences();
    } catch (err: any) {
      console.error("Save experience error:", err);
      toast(err?.message || "Failed to save experience.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this experience record?")) return;
    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, "experience", id));
      toast("Experience record removed.", "info");
      await fetchExperiences();
    } catch (err: any) {
      toast(err?.message || "Failed to delete experience.", "error");
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const currentItem = experiences[index];
    const targetItem = experiences[targetIndex];
    if (!currentItem.id || !targetItem.id) return;

    try {
      const db = getFirebaseDb();
      const tempOrder = currentItem.order;
      await updateDoc(doc(db, "experience", currentItem.id), { order: targetItem.order });
      await updateDoc(doc(db, "experience", targetItem.id), { order: tempOrder });
      await fetchExperiences();
    } catch (err: any) {
      toast("Failed to reorder experiences.", "error");
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Experience Manager
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Manages jobs, internships, and roles on the public `experience --list` section.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Edit / Add Modal Form */}
      {editingExp && (
        <div className="p-6 rounded-xl border border-emerald-500/40 bg-white/90 dark:bg-zinc-950/90 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>{isNew ? "New Experience Entry" : "Edit Experience Entry"}</span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingExp(null)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">COMPANY_NAME:</label>
              <input
                type="text"
                required
                value={editingExp.company}
                onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                placeholder="Google / CloudScale"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">ROLE / TITLE:</label>
              <input
                type="text"
                required
                value={editingExp.role}
                onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                placeholder="Software Engineering Intern"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">DURATION:</label>
              <input
                type="text"
                required
                value={editingExp.duration}
                onChange={(e) => setEditingExp({ ...editingExp, duration: e.target.value })}
                placeholder="Jun 2025 - Aug 2025"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">LOCATION:</label>
              <input
                type="text"
                value={editingExp.location}
                onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                placeholder="San Francisco, CA / Remote"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                TECH_STACK (comma-separated):
              </label>
              <input
                type="text"
                value={editingExp.techStackInput}
                onChange={(e) => setEditingExp({ ...editingExp, techStackInput: e.target.value })}
                placeholder="TypeScript, React, Node.js, Docker"
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Bullet Points */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-zinc-600 dark:text-zinc-400 font-semibold">
                  DESCRIPTION BULLET POINTS:
                </label>
                <button
                  type="button"
                  onClick={addBullet}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-400 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bullet</span>
                </button>
              </div>

              {editingExp.description.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">❯</span>
                  <input
                    type="text"
                    required
                    value={bullet}
                    onChange={(e) => updateBullet(bIdx, e.target.value)}
                    placeholder="Key accomplishment or project responsibility..."
                    className="flex-grow px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans text-xs"
                  />
                  {editingExp.description.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(bIdx)}
                      className="p-2 text-zinc-400 hover:text-red-500"
                      aria-label="Remove bullet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1">ORDER:</label>
              <input
                type="number"
                value={editingExp.order || 1}
                onChange={(e) => setEditingExp({ ...editingExp, order: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingExp(null)}
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
                <span>Save Experience</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          <span>Loading experience records...</span>
        </div>
      ) : experiences.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
          No experience records found. Click &quot;Add Experience&quot; to create your first record.
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-zinc-900 dark:text-white">{item.role}</span>
                  <span className="text-zinc-400">@</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {item.company}
                  </span>
                </div>
                <div className="text-zinc-500 text-[11px] flex items-center gap-3">
                  <span>Duration: {item.duration}</span>
                  <span>•</span>
                  <span>Location: {item.location || "N/A"}</span>
                  <span>•</span>
                  <span>Order: #{item.order}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.techStack &&
                    item.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
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
                  disabled={index === experiences.length - 1}
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
