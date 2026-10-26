"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  MessageCircle,
  MapPin,
  Globe,
  Link as LinkIcon,
  Home,
  Send,
  ExternalLink,
} from "lucide-react";
import type { BrandLink } from "@/types/brand";
import { cn } from "@/lib/utils";

const ICONS = {
  instagram: ImageIcon,
  whatsapp: MessageCircle,
  maps: MapPin,
  website: Globe,
  other: LinkIcon,
  home: Home,
} as const;

export function LinkButton({ link }: { link: BrandLink }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const type = (link.link_type || "other").toLowerCase().trim();
  const Icon = ICONS[type as keyof typeof ICONS] ?? LinkIcon;

  const isImage =
    link.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ||
    link.url.includes("supabase.co/storage");

  // --- FUNGSI UNTUK URL EMBED (IFRAME) ---
  const getMapsEmbedUrl = (url: string) => {
    if (url.includes("google.com/maps/embed")) return url;
    const query = encodeURIComponent(
      link.title + " " + (link.description || ""),
    );
    return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  // --- FUNGSI UNTUK URL EXTERNAL (TOMBOL BUKA) ---
  const getMapsExternalUrl = (url: string) => {
    if (url.includes("google.com/maps/embed")) {
      const query = encodeURIComponent(
        link.title + " " + (link.description || ""),
      );
      return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    return url;
  };

  const handleButtonClick = () => {
    if (
      type === "whatsapp" ||
      type === "maps" ||
      (isImage && (type === "other" || type === "website"))
    ) {
      setIsOpen(!isOpen);
    } else {
      window.open(link.url, "_blank");
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    let rawUrl = link.url;
    let phoneNumber = "";

    if (rawUrl.includes("wa.me/")) {
      phoneNumber = rawUrl.split("wa.me/")[1].split("?")[0];
    } else if (rawUrl.includes("api.whatsapp.com/send?phone=")) {
      const urlParams = new URLSearchParams(rawUrl.split("?")[1]);
      phoneNumber = urlParams.get("phone") || "";
    } else {
      phoneNumber = rawUrl.replace(/\D/g, "");
    }

    if (phoneNumber.startsWith("0")) {
      phoneNumber = "62" + phoneNumber.slice(1);
    }

    if (!phoneNumber) {
      alert("Nomor WhatsApp tidak valid di database. Hubungi admin.");
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const finalUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(finalUrl, "_blank");
    setIsOpen(false);
    setMessage("");
  };

  return (
    <div className="flex flex-col w-full shadow-lg rounded-2xl">
      <button
        onClick={handleButtonClick}
        className={cn(
          "group relative flex min-h-[60px] w-full items-center justify-center bg-white px-14 py-3 text-center transition-all z-10",
          isOpen ? "rounded-t-2xl" : "rounded-2xl",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950",
        )}
      >
        <div className="absolute left-4 flex h-8 w-8 items-center justify-center text-navy">
          <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[15px] font-semibold text-text-dark tracking-wide">
            {link.title}
          </span>
          {link.description && (
            <span className="mt-0.5 text-xs text-muted font-medium truncate max-w-[200px]">
              {link.description}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="w-full rounded-b-2xl bg-neutral-900 border-x border-b border-neutral-800 p-4 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* WhatsApp */}
          {type === "whatsapp" && (
            <form onSubmit={handleSendWhatsApp} className="flex flex-col gap-3">
              <label className="text-xs font-medium text-neutral-400">
                Tulis pesan Anda:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Halo, saya ingin bertanya tentang..."
                rows={3}
                required
                className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-800 p-3 text-sm text-white placeholder:text-neutral-500 focus:border-green-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
              >
                <Send size={16} /> Kirim ke WhatsApp
              </button>
            </form>
          )}

          {/* Maps */}
          {type === "maps" && (
            <div className="flex flex-col gap-3">
              <div className="h-48 w-full overflow-hidden rounded-xl border border-neutral-700">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={link.icon || getMapsEmbedUrl(link.url)} // Gunakan link.icon jika ada
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <a
                href={link.url} // Langsung gunakan link.url (URL Share)
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black transition hover:bg-gray-200"
              >
                Buka di Google Maps <ExternalLink size={16} />
              </a>
            </div>
          )}

          {/* Gambar / Website */}
          {(type === "website" || type === "instagram" || type === "other") && (
            <div className="flex flex-col gap-3">
              {isImage ? (
                <img
                  src={link.url}
                  alt={link.title}
                  className="w-full h-auto max-h-64 object-contain rounded-xl border border-neutral-700 bg-black"
                />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800 p-6 text-center">
                  <Globe size={32} className="mb-2 text-neutral-500" />
                  <p className="text-xs text-neutral-400 mb-4 line-clamp-2">
                    {link.url}
                  </p>
                </div>
              )}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black transition hover:bg-gray-200"
              >
                Buka Tautan / Gambar <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
