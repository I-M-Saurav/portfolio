"use client";

import React, { useState } from "react";
import { ProfileDocument, SocialLink } from "@/types/firestore";
import { useToast } from "@/components/ui/toast";
import { ContactForm } from "@/components/contact-form";
import {
  Terminal,
  Mail,
  Copy,
  Check,
  Download,
  Phone,
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Code2,
  MessageSquare,
} from "lucide-react";

interface ContactSectionProps {
  profile: ProfileDocument;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast(`Copied ${profile.email} to clipboard`, "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy email to clipboard", "error");
    }
  };

  const getPlatformIcon = (platformName: string) => {
    const p = platformName.toLowerCase();
    if (p.includes("github")) return <Github className="w-4 h-4" />;
    if (p.includes("linkedin")) return <Linkedin className="w-4 h-4" />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter className="w-4 h-4" />;
    if (p.includes("codeforces") || p.includes("code")) return <Code2 className="w-4 h-4" />;
    if (p.includes("mail") || p.includes("email")) return <Mail className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const contactMessage =
    profile.contactMessage ||
    "I'm always open to discussing distributed systems, backend architectures, performance optimizations, and high-impact engineering roles. Feel free to send a transmission or reach out directly!";

  return (
    <section id="contact" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
          Get In Touch &amp; Connect
        </h2>
        <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-grow ml-4 max-w-md hidden sm:block" />
      </div>

      {/* Terminal Window Card Container */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Terminal Top Window Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-2 sm:ml-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] sm:text-xs">contact --dispatch</span>
            </div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 font-mono text-[10px] sm:text-[11px]">
            gateway ready
          </div>
        </div>

        {/* Contact Content Body */}
        <div className="p-4 sm:p-6 md:p-12 space-y-8 max-w-3xl mx-auto text-center">
          {/* Prompt heading */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>initiate_handshake()</span>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">
              Let&apos;s Build Something Resilient
            </h3>
            <p className="font-sans text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              {contactMessage}
            </p>
          </div>

          {/* Interactive Contact Form */}
          <ContactForm />

          {/* Alternative Direct Channels */}
          <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400">
              DIRECT_CHANNELS
            </span>

            {/* Action Buttons: Copy Email, Resume, Phone */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
              {profile.email && (
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[44px] px-5 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900 hover:bg-black/5 dark:hover:bg-white/10 font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500 ml-1 shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400 ml-1 shrink-0" />
                  )}
                </button>
              )}

              {profile.resumeUrl && profile.resumeUrl !== "#" && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download Resume</span>
                </a>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-900/60 hover:bg-black/5 dark:hover:bg-white/10 font-mono text-xs text-zinc-700 dark:text-zinc-300 transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>{profile.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Social Links Grid */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400">
                EXTERNAL_NETWORKS
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
                {profile.socialLinks.map((social: SocialLink, idx: number) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[40px] px-3.5 sm:px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900/80 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 font-mono text-xs text-zinc-700 dark:text-zinc-300 transition-all shadow-sm group"
                  >
                    {getPlatformIcon(social.platform)}
                    <span>{social.platform}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

