"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { siteContent } from "@/lib/content";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 w-full transition-colors duration-200 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Left: Terminal Logo */}
        <Link
          href="/"
          className="group flex items-center gap-1 font-mono text-sm sm:text-base font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors focus:outline-none"
          id="nav-logo"
        >
          <span className="text-zinc-400 dark:text-zinc-500 mr-0.5">$</span>
          <span>{siteContent.navLogo}</span>
          <span className="inline-block w-2 h-4 bg-emerald-500 dark:bg-emerald-400 ml-1 animate-cursor-blink" />
        </Link>

        {/* Center / Right: Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-mono text-zinc-600 dark:text-zinc-400">
          {siteContent.navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 py-1 font-medium"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right side controls: Theme Toggle + Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-9 h-9 rounded-lg border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Opens full-width BELOW navbar) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0e0e14]/95 backdrop-blur-xl shadow-xl overflow-hidden"
            id="mobile-nav-dropdown"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col space-y-1">
              {siteContent.navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg font-mono text-sm text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 transition-all duration-150 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-600 font-mono">→</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
