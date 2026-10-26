"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";

export function ShareButton({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleShare() {
    setError(null);
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");

    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(shareUrl);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Bagikan halaman ini"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {copied ? <Check size={18} /> : <Share2 size={18} />}
      </button>
      {error && (
        <div className="absolute right-0 top-12 z-20 w-64 rounded-lg bg-white p-3 text-xs text-text-dark shadow-card">
          <p className="mb-1 font-medium">Salin manual:</p>
          <input
            readOnly
            value={error}
            className="w-full rounded border px-2 py-1 text-[11px]"
          />
        </div>
      )}
    </div>
  );
}
