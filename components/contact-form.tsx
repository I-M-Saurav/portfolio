"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { Send, Loader2, CheckCircle2, AlertCircle, Terminal, User, Mail, FileText, MessageSquare } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hpField, setHpField] = useState(""); // Honeypot spam trap
  const [formTimestamp, setFormTimestamp] = useState<number>(0);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Name cannot exceed 100 characters.";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (trimmedEmail.length > 255) {
      newErrors.email = "Email cannot exceed 255 characters.";
    }

    const trimmedSubject = subject.trim();
    if (!trimmedSubject) {
      newErrors.subject = "Subject is required.";
    } else if (trimmedSubject.length < 2) {
      newErrors.subject = "Subject must be at least 2 characters.";
    } else if (trimmedSubject.length > 200) {
      newErrors.subject = "Subject cannot exceed 200 characters.";
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      newErrors.message = "Message is required.";
    } else if (trimmedMessage.length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (trimmedMessage.length > 5000) {
      newErrors.message = "Message cannot exceed 5000 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          hp_field: hpField,
          form_timestamp: formTimestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch email. Please try again.");
      }

      setSubmitSuccess(true);
      toast("Message sent — I'll get back to you soon", "success");

      // Clear the form fields on success
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setHpField("");
      setErrors({});
      setFormTimestamp(Date.now());
    } catch (err: any) {
      console.error("Contact submission error:", err);
      const errMsg = err?.message || "Failed to send message. Please try again or reach out directly.";
      setServerError(errMsg);
      toast(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-left rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/30 backdrop-blur-sm overflow-hidden p-4 sm:p-6 md:p-8">
      {/* Form Subheader */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-zinc-900 dark:text-white">send_transmission.exe</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">REST API &bull; RESEND</span>
      </div>

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="mb-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-xs flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Transmission dispatched successfully!</p>
            <p className="text-zinc-600 dark:text-zinc-300 font-sans text-xs">
              Message sent — I&apos;ll get back to you soon. Thanks for reaching out!
            </p>
          </div>
        </div>
      )}

      {/* Server Error Notification Banner */}
      {serverError && (
        <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 font-mono text-xs flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Transmission delivery failure:</p>
            <p className="font-sans text-xs">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4 font-mono text-xs">
        {/* Hidden Honeypot field for bot suppression */}
        <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
          <label htmlFor="hp_field">Do not fill this field</label>
          <input
            id="hp_field"
            type="text"
            name="hp_field"
            tabIndex={-1}
            autoComplete="off"
            value={hpField}
            onChange={(e) => setHpField(e.target.value)}
          />
        </div>

        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label htmlFor="contact-name" className="block text-zinc-700 dark:text-zinc-300 mb-1.5 font-medium">
              SENDER_NAME <span className="text-emerald-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                  if (submitSuccess) setSubmitSuccess(false);
                }}
                placeholder="Ada Lovelace"
                className={`w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-lg border transition-all font-mono text-xs focus:outline-none focus:ring-1 ${
                  errors.name
                    ? "border-red-500 bg-red-500/[0.03] focus:ring-red-500 text-red-900 dark:text-red-200"
                    : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-emerald-500 focus:border-emerald-500/50"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="contact-email" className="block text-zinc-700 dark:text-zinc-300 mb-1.5 font-medium">
              EMAIL_ADDRESS <span className="text-emerald-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                  if (submitSuccess) setSubmitSuccess(false);
                }}
                placeholder="ada@domain.com"
                className={`w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-lg border transition-all font-mono text-xs focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 bg-red-500/[0.03] focus:ring-red-500 text-red-900 dark:text-red-200"
                    : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-emerald-500 focus:border-emerald-500/50"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="contact-subject" className="block text-zinc-700 dark:text-zinc-300 mb-1.5 font-medium">
            SUBJECT_LINE <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="contact-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors({ ...errors, subject: undefined });
                if (submitSuccess) setSubmitSuccess(false);
              }}
              placeholder="Collaboration Opportunity / Architecture Discussion"
              className={`w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-lg border transition-all font-mono text-xs focus:outline-none focus:ring-1 ${
                errors.subject
                  ? "border-red-500 bg-red-500/[0.03] focus:ring-red-500 text-red-900 dark:text-red-200"
                  : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-emerald-500 focus:border-emerald-500/50"
              }`}
            />
          </div>
          {errors.subject && (
            <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
              <span>⚠</span> {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="contact-message" className="block text-zinc-700 dark:text-zinc-300 font-medium">
              MESSAGE_PAYLOAD <span className="text-emerald-500">*</span>
            </label>
            <span className="text-[10px] text-zinc-400 font-mono">
              {message.length}/5000 chars
            </span>
          </div>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors({ ...errors, message: undefined });
                if (submitSuccess) setSubmitSuccess(false);
              }}
              placeholder="Hi Saurav, I'd love to connect regarding..."
              className={`w-full pl-9 pr-3 py-3 rounded-lg border transition-all font-sans text-xs sm:text-sm focus:outline-none focus:ring-1 resize-y min-h-[120px] ${
                errors.message
                  ? "border-red-500 bg-red-500/[0.03] focus:ring-red-500 text-red-900 dark:text-red-200"
                  : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-emerald-500 focus:border-emerald-500/50"
              }`}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
              <span>⚠</span> {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[46px] px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>TRANSMITTING MESSAGE...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>SEND TRANSMISSION</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
