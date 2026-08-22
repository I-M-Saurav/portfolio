import React from "react";
import Link from "next/link";
import { Terminal, Home, ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-zinc-50 dark:bg-[#0a0a0e] text-zinc-900 dark:text-zinc-100 font-mono">
      <div className="w-full max-w-2xl">
        {/* Terminal Window Card */}
        <div className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#111116]/90 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Terminal Window Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-200/80 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
              <div className="ml-3 flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>404_not_found.sh</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              status: 404
            </span>
          </div>

          {/* Terminal Content Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-6 text-xs sm:text-sm">
            {/* Terminal Command Sequence */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <span className="text-emerald-500 font-bold">$</span>
                <span className="text-zinc-800 dark:text-zinc-200">cd /requested-resource</span>
              </div>

              <div className="text-red-600 dark:text-red-400 pl-4 border-l-2 border-red-500/40 py-1">
                bash: cd: /requested-resource: No such file or directory
              </div>

              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 pt-2">
                <span className="text-emerald-500 font-bold">$</span>
                <span className="text-zinc-800 dark:text-zinc-200">diagnose --error</span>
              </div>

              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">HTTP_STATUS: 404_PAGE_NOT_FOUND</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    The requested route does not exist or has been relocated to another memory address.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 pt-2">
                <span className="text-emerald-500 font-bold">$</span>
                <span className="text-zinc-800 dark:text-zinc-200">ls -la /available-sectors/</span>
              </div>

              <div className="pl-4 text-zinc-500 dark:text-zinc-400 text-xs space-y-1">
                <div>drwxr-xr-x  about/</div>
                <div>drwxr-xr-x  skills/</div>
                <div>drwxr-xr-x  experience/</div>
                <div>drwxr-xr-x  projects/</div>
                <div>drwxr-xr-x  contact/</div>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Return to Terminal Home (cd ~)</span>
              </Link>

              <Link
                href="/#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 active:scale-[0.98] transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-400" />
                <span>Transmit Bug Report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
