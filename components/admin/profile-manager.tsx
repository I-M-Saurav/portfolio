"use client";

import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ProfileDocument } from "@/types/firestore";
import { siteContent } from "@/lib/content";
import { useToast } from "@/components/ui/toast";
import {
  Save,
  Upload,
  Plus,
  Trash2,
  Loader2,
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  MapPin,
  Github,
  Code2,
  FileText,
  ExternalLink,
} from "lucide-react";

export function ProfileManager() {
  const [profile, setProfile] = useState<ProfileDocument>({
    name: siteContent.name,
    tagline: siteContent.identity,
    location: "San Francisco, CA / Remote",
    bio: siteContent.bio,
    email: "alex.developer@example.com",
    degree: "B.S. in Computer Science",
    year: "Class of 2025",
    focus: "Distributed Systems & Web Performance",
    resumeUrl: "",
    photoUrl: "",
    quickFacts: [
      { key: "degree", value: "B.S. in Computer Science" },
      { key: "year", value: "Class of 2025" },
      { key: "focus", value: "Distributed Systems & Modern Web" },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const db = getFirebaseDb();
        const docRef = doc(db, "profile", "main");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfile(snap.data() as ProfileDocument);
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, "profile", "main");
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date().toISOString(),
      });
      toast("Profile updated successfully in Firestore!", "success");
    } catch (err: any) {
      console.error("Save profile error:", err);
      toast(err?.message || "Failed to save profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast("Image size must be less than 5MB.", "error");
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "photo");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload photo to Cloudinary.");
      }

      const uploadedUrl = data.secure_url;
      setProfile((prev) => ({ ...prev, photoUrl: uploadedUrl }));

      // Automatically persist to Firestore
      const db = getFirebaseDb();
      const docRef = doc(db, "profile", "main");
      await setDoc(
        docRef,
        { photoUrl: uploadedUrl, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      toast("Photo uploaded and saved to Cloudinary!", "success");
    } catch (err: any) {
      console.error("Photo upload error:", err);
      toast(err?.message || "Failed to upload photo.", "error");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast("Please select a PDF document.", "error");
      return;
    }

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast("Resume file size must be less than 10MB.", "error");
      return;
    }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "resume");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload resume to Cloudinary.");
      }

      const uploadedUrl = data.secure_url;
      setProfile((prev) => ({ ...prev, resumeUrl: uploadedUrl }));

      // Automatically persist to Firestore
      const db = getFirebaseDb();
      const docRef = doc(db, "profile", "main");
      await setDoc(
        docRef,
        { resumeUrl: uploadedUrl, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      toast("Resume uploaded and saved to Cloudinary!", "success");
      if (data.warning) {
        toast(data.warning, "info");
      }
    } catch (err: any) {
      console.error("Resume upload error:", err);
      toast(err?.message || "Failed to upload resume.", "error");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  const addQuickFact = () => {
    setProfile((prev) => ({
      ...prev,
      quickFacts: [...(prev.quickFacts || []), { key: "", value: "" }],
    }));
  };

  const removeQuickFact = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      quickFacts: prev.quickFacts.filter((_, i) => i !== index),
    }));
  };

  const updateQuickFact = (index: number, field: "key" | "value", val: string) => {
    setProfile((prev) => {
      const updated = [...prev.quickFacts];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, quickFacts: updated };
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-zinc-400 font-mono text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        <span>Loading profile data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 font-mono text-xs">
      {/* Top Banner / Submit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Profile & About Configuration
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Manages data displayed on the public hero & `about.md` tab.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 min-h-[40px] px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Photo Upload Section */}
      <div className="p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 space-y-4">
        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-500" />
          <span>Profile Photo (Cloudinary)</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-xl border-2 border-emerald-500/30 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 shadow-inner">
            {profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-zinc-400" />
            )}
          </div>

          <div className="space-y-2 text-left w-full">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 cursor-pointer shadow-sm active:scale-[0.98] transition-all">
                {uploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <Upload className="w-4 h-4 text-emerald-500" />
                )}
                <span>{uploadingPhoto ? "Uploading to Cloudinary..." : "Upload New Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
              {profile.photoUrl && (
                <a
                  href={profile.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-zinc-500 hover:text-emerald-500 text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Original</span>
                </a>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Uploads to Cloudinary (`portfolio/profile`) and links secure HTTPS download URL.
            </p>
          </div>
        </div>
      </div>

      {/* Core Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            FULL_NAME:
          </label>
          <input
            type="text"
            required
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            TAGLINE / TITLE:
          </label>
          <input
            type="text"
            required
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            CONTACT_EMAIL:
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            LOCATION:
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={profile.location || ""}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="City, State / Remote"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            GITHUB_USERNAME:
          </label>
          <div className="relative">
            <Github className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={profile.githubUsername || ""}
              onChange={(e) => setProfile({ ...profile, githubUsername: e.target.value })}
              placeholder="e.g. torvalds"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            CODEFORCES_HANDLE:
          </label>
          <div className="relative">
            <Code2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={profile.codeforcesHandle || ""}
              onChange={(e) => setProfile({ ...profile, codeforcesHandle: e.target.value })}
              placeholder="e.g. tourist"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Resume PDF & URL Manager */}
        <div className="sm:col-span-2 p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 space-y-4">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Resume PDF & Download Link (Cloudinary)</span>
            </div>
            {profile.resumeUrl && profile.resumeUrl !== "#" && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
              >
                <span>Preview Document</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium text-[11px]">
                RESUME_URL (Auto-filled on upload or enter external Drive / Docs URL):
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={profile.resumeUrl || ""}
                  onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or https://drive.google.com/..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium text-[11px]">
                UPLOAD PDF:
              </label>
              <label className="inline-flex items-center justify-center gap-2 w-full min-h-[42px] px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 cursor-pointer shadow-sm active:scale-[0.98] transition-all font-semibold">
                {uploadingResume ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <Upload className="w-4 h-4 text-emerald-500" />
                )}
                <span>{uploadingResume ? "Uploading PDF..." : "Upload Resume PDF"}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Uploads directly to Cloudinary (`portfolio/resume`), auto-populates the URL field, and saves to Firestore.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            BIO_PARAGRAPH:
          </label>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
          />
        </div>
      </div>

      {/* Dynamic Quick Facts Editor */}
      <div className="p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Quick Facts (Terminal Key-Value Pairs)
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Rendered on the `about.md` tab as `key: value`.
            </p>
          </div>
          <button
            type="button"
            onClick={addQuickFact}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="space-y-2.5 pt-2">
          {profile.quickFacts && profile.quickFacts.length > 0 ? (
            profile.quickFacts.map((fact, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="key (e.g. degree)"
                  value={fact.key}
                  onChange={(e) => updateQuickFact(idx, "key", e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="value (e.g. B.Tech CS)"
                  value={fact.value}
                  onChange={(e) => updateQuickFact(idx, "value", e.target.value)}
                  className="flex-grow px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => removeQuickFact(idx)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label="Delete row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-zinc-400 text-xs italic py-2">No quick facts added yet.</div>
          )}
        </div>
      </div>
    </form>
  );
}
