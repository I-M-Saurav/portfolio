"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Terminal, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark flex flex-col justify-between p-6">
      {/* Top Navbar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>return to public site</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-mono text-xs font-medium transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Placeholder */}
      <main className="w-full max-w-2xl mx-auto my-auto">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#111116]/90 shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-200/70 dark:bg-zinc-900/80 border-b border-black/10 dark:border-white/10 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-500" />
                admin_console.sh
              </span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              AUTHENTICATED
            </span>
          </div>

          {/* Body */}
          <div className="p-8 text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <Terminal className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
                Admin Dashboard — Coming in Phase 2
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-2 max-w-md mx-auto leading-relaxed">
                Authentication and session management are active. Firestore project management,
                live editing, and analytics will be configured in Phase 2.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-6 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-mono text-xs font-semibold inline-flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span>Terminate Session (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs font-mono text-zinc-400 py-2">
        <span>Session active &bull; Next.js 14 App Router</span>
      </footer>
    </div>
  );
}
