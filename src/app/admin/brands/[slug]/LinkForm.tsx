"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LinkImageUpload } from "@/components/admin/LinkImageUpload";

export function LinkForm({
  brandId,
  brandSlug,
}: {
  brandId: string;
  brandSlug: string;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [linkType, setLinkType] = useState("instagram");
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(""); // State untuk kode iframe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let finalUrl = url;
    let finalIcon = null;

    // Logika khusus untuk Maps
    if (linkType === "maps") {
      // 1. Validasi URL Share
      if (
        !url.includes("maps.app.goo.gl") &&
        !url.includes("goo.gl/maps") &&
        !url.includes("google.com/maps")
      ) {
        setError(
          "URL Share Google Maps tidak valid. Gunakan link yang diawali https://maps.app.goo.gl/...",
        );
        setLoading(false);
        return;
      }
      // 2. Ekstrak URL Embed dari kode iframe
      if (mapsEmbedUrl.includes("<iframe")) {
        const srcMatch = mapsEmbedUrl.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          finalIcon = srcMatch[1]; // Simpan URL embed di kolom icon
        }
      }
    }

    if (!finalUrl) {
      setError("URL atau Gambar wajib diisi.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("links").insert({
      brand_id: brandId,
      title,
      url: finalUrl,
      link_type: linkType,
      is_active: true,
      sort_order: 0,
      icon: finalIcon, // Simpan URL embed di sini
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setUrl("");
    setMapsEmbedUrl("");
    setLinkType("instagram");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Judul Tautan</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Instagram Resmi"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tipe</label>
          <select
            value={linkType}
            onChange={(e) => setLinkType(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
          >
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="maps">Google Maps</option>
            <option value="website">Website</option>
            <option value="other">Lainnya (Gambar)</option>
          </select>
        </div>
      </div>

      {linkType === "maps" ? (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium">
              URL Share Google Maps
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted">
              Link pendek dari tombol "Share" di Google Maps.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Kode Embed Google Maps
            </label>
            <textarea
              value={mapsEmbedUrl}
              onChange={(e) => setMapsEmbedUrl(e.target.value)}
              placeholder='Paste kode <iframe src="https://www.google.com/maps/embed?..."></iframe> di sini'
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted">
              Opsional. Jika diisi, peta akan muncul di dalam card.
            </p>
          </div>
        </>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium">URL Tujuan</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
          />
        </div>
      )}

      {/* Upload Gambar (Hanya muncul jika bukan Maps) */}
      {linkType !== "maps" && (
        <LinkImageUpload
          currentImageUrl={url}
          onUploadSuccess={(newUrl) => setUrl(newUrl)}
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-lg bg-navy py-2.5 text-sm font-semibold text-white transition hover:bg-navy/90 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan Tautan"}
      </button>
    </form>
  );
}
