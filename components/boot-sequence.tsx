"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "> BIOS POST... OK",
  "> Loading kernel modules...",
  "> Initializing network stack... done",
  "> Mounting /dev/portfolio...",
];

export function BootSequence() {
  const [showBoot, setShowBoot] = useState<boolean | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if session has already booted
    try {
      const hasBooted = sessionStorage.getItem("portfolio_boot_completed");
      if (hasBooted) {
        setShowBoot(false);
        return;
      }
    } catch {
      // In case sessionStorage is restricted
      setShowBoot(false);
      return;
    }

    setShowBoot(true);

    // Sequential line reveals
    const timeouts: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(index + 1);
      }, (index + 1) * 450);
      timeouts.push(timeout);
    });

    // After all lines have printed, wait ~2 seconds then fade out
    const finishTimeout = setTimeout(() => {
      setIsCompleted(true);
      try {
        sessionStorage.setItem("portfolio_boot_completed", "true");
      } catch {
        // ignore
      }
      const closeTimeout = setTimeout(() => {
        setShowBoot(false);
      }, 700);
      timeouts.push(closeTimeout);
    }, (BOOT_LINES.length + 1) * 450 + 1500);

    timeouts.push(finishTimeout);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  // During SSR or if already booted, don't show overlay
  if (showBoot === null || showBoot === false) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isCompleted && (
        <motion.div
          key="boot-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0e] text-zinc-300 font-mono flex items-center justify-center p-6 select-none"
        >
          <div className="w-full max-w-lg bg-zinc-950/80 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10 text-xs text-zinc-500">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-zinc-400">system_boot.sh</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-emerald-400/90 leading-relaxed font-mono min-h-[120px]">
              {BOOT_LINES.slice(0, currentLineIndex).map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <span>{line}</span>
                </motion.div>
              ))}

              {currentLineIndex > 0 && (
                <div className="flex items-center text-emerald-300">
                  <span className="text-zinc-500 mr-2">&gt;</span>
                  <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-cursor-blink align-middle" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
