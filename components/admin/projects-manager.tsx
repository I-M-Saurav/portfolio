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
import { ProjectDocument } from "@/types/firestore";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  FolderGit2,
  Sparkles,
  Github,
  ExternalLink,
  Loader2,
  Tag,
} from "lucide-react";

export function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, "projects"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: ProjectDocument[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ProjectDocument, "id">) });
      });
      setProjects(list);
    } catch (err: any) {
      console.error("Error loading projects:", err);
      toast("Failed to load projects from Firestore", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingProject({
      title: "",
      description: "",
      techStack: [],
      githubUrl: "",
      liveUrl: "",
      featured: false,
      order: projects.length + 1,
    });
    setTagInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectDocument) => {
    setEditingProject({ ...project });
    setTagInput("");
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !editingProject) return;
    const newTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !editingProject.techStack.includes(t));

    setEditingProject({
      ...editingProject,
      techStack: [...editingProject.techStack, ...newTags],
    });
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      techStack: editingProject.techStack.filter((_, i) => i !== index),
    });
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    // Validate Title & Description
    if (!editingProject.title.trim()) {
      toast("Project title is required.", "error");
      return;
    }

    if (!editingProject.description.trim()) {
      toast("Project description is required.", "error");
      return;
    }

    // Validate GitHub URL
    if (!editingProject.githubUrl.trim()) {
      toast("GitHub repository URL is required.", "error");
      return;
    }

    if (!isValidUrl(editingProject.githubUrl.trim())) {
      toast("Please enter a valid GitHub URL (must start with https://).", "error");
      return;
    }

    // Validate Live URL if provided
    if (editingProject.liveUrl && editingProject.liveUrl.trim() !== "") {
      if (!isValidUrl(editingProject.liveUrl.trim())) {
        toast("Please enter a valid Live Demo URL (must start with https://).", "error");
        return;
      }
    }

    setSaving(true);
    try {
      const db = getFirebaseDb();
      const docId = editingProject.id || `proj_${Date.now()}`;
      const docRef = doc(db, "projects", docId);

      const payload = {
        title: editingProject.title.trim(),
        description: editingProject.description.trim(),
        techStack: editingProject.techStack || [],
        githubUrl: editingProject.githubUrl.trim(),
        liveUrl: editingProject.liveUrl?.trim() || "",
        featured: !!editingProject.featured,
        order: Number(editingProject.order) || 0,
        updatedAt: new Date().toISOString(),
        ...(editingProject.id ? {} : { createdAt: new Date().toISOString() }),
      };

      await setDoc(docRef, payload, { merge: true });
      toast(
        editingProject.id ? "Project updated successfully!" : "New project added successfully!",
        "success"
      );
      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err: any) {
      console.error("Save project error:", err);
      toast(err?.message || "Failed to save project.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, "projects", id));
      toast("Project deleted successfully.", "success");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error("Delete project error:", err);
      toast("Failed to delete project.", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-zinc-400 font-mono text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        <span>Loading projects catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Bar / Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-500" />
            <span>Projects &amp; Systems Catalog</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Manage projects displayed on the public `#projects` section.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List View */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-black/10 dark:border-white/10 rounded-xl text-zinc-400">
            No projects added yet. Click &quot;Add Project&quot; above to create one.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`p-4 sm:p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                project.featured
                  ? "border-emerald-500/40 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.15]"
                  : "border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40"
              }`}
            >
              <div className="space-y-2 flex-grow">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    order: {project.order}
                  </span>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <Sparkles className="w-3 h-3" />
                      <span>FEATURED</span>
                    </span>
                  )}
                </div>

                <p className="font-sans text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech stack tags */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links summary */}
                <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-1">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-500 inline-flex items-center gap-1"
                  >
                    <Github className="w-3 h-3" />
                    <span>repo</span>
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-emerald-500 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>demo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(project)}
                  className="p-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id!, project.title)}
                  className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Project Modal Dialog */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111116] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-emerald-500" />
                <span>{editingProject.id ? "Edit Project" : "Add New Project"}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    PROJECT_TITLE:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    placeholder="e.g. Distributed Stream Engine"
                    className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    SORT_ORDER:
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProject.order}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                  DESCRIPTION (Full multi-sentence overview):
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  placeholder="Explain what the project does, key architectural decisions, performance metrics, etc."
                  className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    GITHUB_URL (Required):
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      value={editingProject.githubUrl}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/username/repo"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                    LIVE_DEMO_URL (Optional):
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={editingProject.liveUrl || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, liveUrl: e.target.value })
                      }
                      placeholder="https://project-demo.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tech Stack Tag Input */}
              <div className="space-y-2">
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium">
                  TECH_STACK (Comma-separated or press Add):
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="e.g. Next.js, Go, Kafka, Redis"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-black/10 font-semibold shrink-0"
                  >
                    Add Tag
                  </button>
                </div>

                {editingProject.techStack && editingProject.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editingProject.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Toggle Switch */}
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/30 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Featured Project</span>
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Pinned to the top with a distinct glowing badge on the public site.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Form Action Buttons */}
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
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
