"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Lock, Mail, Terminal, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Authenticate with Firebase Client SDK
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Exchange ID Token for server-side httpOnly Session Cookie
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to establish admin session.");
      }

      // 3. Redirect to Admin Dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error("Login failed:", err);
      let message = "Authentication failed. Please verify your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Invalid email or password.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed login attempts. Please try again later.";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>return to site</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-auto">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#111116]/90 shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-200/70 dark:bg-zinc-900/80 border-b border-black/10 dark:border-white/10 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-500" />
                admin_auth.sh
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">RESTRICTED</span>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-lg font-mono font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <span>[ Administrator Login ]</span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                Authenticate with authorized credentials to access console.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
                  EMAIL_ADDRESS:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
                  PASSWORD:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <span>AUTHENTICATE</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center text-xs font-mono text-zinc-400 py-4">
        <span>authorized access only &bull; session is monitored</span>
      </div>
    </div>
  );
}
