import React from "react";
import { BootSequence } from "@/components/boot-sequence";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Boot sequence animation on first load */}
      <BootSequence />

      {/* Sticky top navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section id="hero">
          <Hero />
        </section>

        {/* Placeholder anchor targets for navigation links (Phase 2 content) */}
        <div className="sr-only">
          <div id="about" />
          <div id="experience" />
          <div id="education" />
          <div id="projects" />
          <div id="positions" />
          <div id="profiles" />
          <div id="contact" />
        </div>
      </main>

      {/* Minimalistic Terminal Footer */}
      <footer className="w-full border-t border-black/10 dark:border-white/10 py-8 px-6 md:px-12 text-center font-mono text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Alex Developer. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>sys_status: operational</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
