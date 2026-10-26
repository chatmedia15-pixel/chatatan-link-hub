"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Pencil, X } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export function EditBrandButton({ brand }: { brand: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(brand.name);
  const [slug, setSlug] = useState(brand.slug);
  const [tagline, setTagline] = useState(brand.tagline || "");
  const [logoUrl, setLogoUrl] = useState(brand.logo_url || "");
  const [primaryColor, setPrimaryColor] = useState(
    brand.primary_color || "#152C46",
  );
  const [isPublished, setIsPublished] = useState(brand.is_published);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("brands")
      .update({
        name,
        slug,
        tagline,
        logo_url: logoUrl,
        primary_color: primaryColor,
        is_published: isPublished,
      })
      .eq("id", brand.id);

    if (error) {
      alert("Gagal menyimpan: " + error.message);
    } else {
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded p-2 text-blue-500 hover:bg-blue-50"
        title="Edit Brand"
      >
        <Pencil size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-dark">Edit Brand</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nama Brand
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
                />
              </div>

              {/* Komponen Upload Logo */}
              <ImageUpload
                currentImageUrl={logoUrl}
                onUploadSuccess={(url) => setLogoUrl(url)}
              />

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
                    id="publish-edit"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="publish-edit" className="text-sm font-medium">
                    Published
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-navy py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
