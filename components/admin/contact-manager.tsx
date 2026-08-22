"use client";

import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ProfileDocument, SocialLink } from "@/types/firestore";
import { useToast } from "@/components/ui/toast";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Globe,
  MessageSquare,
} from "lucide-react";

export function ContactManager() {
  const [contactData, setContactData] = useState<{
    phone: string;
    linkedinUrl: string;
    twitterUrl: string;
    contactMessage: string;
    socialLinks: SocialLink[];
  }>({
    phone: "",
    linkedinUrl: "",
    twitterUrl: "",
    contactMessage: "",
    socialLinks: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchContact() {
      try {
        const db = getFirebaseDb();
        const docRef = doc(db, "profile", "main");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as ProfileDocument;
          setContactData({
            phone: data.phone || "",
            linkedinUrl: data.linkedinUrl || "",
            twitterUrl: data.twitterUrl || "",
            contactMessage: data.contactMessage || "",
            socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
          });
        }
      } catch (err: any) {
        console.error("Error loading contact settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  const handleAddSocial = () => {
    setContactData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const handleRemoveSocial = (index: number) => {
    setContactData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateSocial = (index: number, field: "platform" | "url", val: string) => {
    setContactData((prev) => {
      const updated = [...prev.socialLinks];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, socialLinks: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, "profile", "main");

      const cleanSocialLinks = contactData.socialLinks.filter(
        (s) => s.platform.trim() !== "" && s.url.trim() !== ""
      );

      await setDoc(
        docRef,
        {
          phone: contactData.phone.trim(),
          linkedinUrl: contactData.linkedinUrl.trim(),
          twitterUrl: contactData.twitterUrl.trim(),
          contactMessage: contactData.contactMessage.trim(),
          socialLinks: cleanSocialLinks,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      toast("Contact and social channels updated successfully!", "success");
    } catch (err: any) {
      console.error("Save contact error:", err);
      toast(err?.message || "Failed to save contact settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-zinc-400 font-mono text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        <span>Loading contact configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 font-mono text-xs">
      {/* Top Bar / Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-500" />
            <span>Contact &amp; Social Channels</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
            Configure contact details and network links displayed on `#contact`.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Core Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            PHONE_NUMBER (Optional):
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={contactData.phone}
              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            LINKEDIN_URL:
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={contactData.linkedinUrl}
              onChange={(e) => setContactData({ ...contactData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
            TWITTER / X_URL (Optional):
          </label>
          <div className="relative">
            <Twitter className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={contactData.twitterUrl}
              onChange={(e) => setContactData({ ...contactData, twitterUrl: e.target.value })}
              placeholder="https://twitter.com/username"
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>CLOSING_CTA_MESSAGE:</span>
          </label>
          <textarea
            rows={3}
            value={contactData.contactMessage}
            onChange={(e) => setContactData({ ...contactData, contactMessage: e.target.value })}
            placeholder="e.g. Open to software engineering roles, distributed systems projects, and high-impact teams. Let's connect!"
            className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
          />
        </div>
      </div>

      {/* Dynamic Social Links Array */}
      <div className="p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Social Links &amp; Profiles</span>
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Rendered on `#contact` as clickable network cards with platform icons.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddSocial}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-2.5 pt-2">
          {contactData.socialLinks.length > 0 ? (
            contactData.socialLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Platform (e.g. GitHub, LinkedIn, Codeforces, Discord)"
                  value={link.platform}
                  onChange={(e) => handleUpdateSocial(idx, "platform", e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="url"
                  placeholder="URL (e.g. https://github.com/...)"
                  value={link.url}
                  onChange={(e) => handleUpdateSocial(idx, "url", e.target.value)}
                  className="flex-grow px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(idx)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  aria-label="Delete social link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-zinc-400 text-xs italic py-2">
              No additional social links added yet.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
