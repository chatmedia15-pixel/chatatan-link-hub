"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";
import { ImageUpload } from "../../components/admin/ImageUpload";

export function BrandForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#152C46");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("brands").insert({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"), // otomatis format slug
      tagline,
      primary_color: primaryColor,
      is_published: isPublished,
      sort_order: 99, // Taruh di bawah sementara
    });

    if (error) {
      alert("Gagal menambah brand: " + error.message);
    } else {
      onClose();
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-dark">
            Tambah Brand Baru
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nama Brand</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Otomatis buat slug dari nama
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, ""),
                );
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 focus:border-navy"
            />
            <p className="text-xs text-muted mt-1">Halaman: /{slug}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy"
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Warna Utama
              </label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border p-1"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="publish"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="publish" className="text-sm font-medium">
                Langsung Publikasikan
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-navy py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Brand"}
          </button>
        </form>
      </div>
    </div>
  );
}
