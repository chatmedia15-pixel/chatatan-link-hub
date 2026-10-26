"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Pencil, X } from "lucide-react";
import { LinkImageUpload } from "@/components/admin/LinkImageUpload";

export function EditLinkButton({ link }: { link: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [linkType, setLinkType] = useState(link.link_type);
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(link.icon || ""); // Ambil dari kolom icon
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        alert("URL Share Google Maps tidak valid.");
        setLoading(false);
        return;
      }
      // 2. Ekstrak URL Embed dari kode iframe
      if (mapsEmbedUrl.includes("<iframe")) {
        const srcMatch = mapsEmbedUrl.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          finalIcon = srcMatch[1];
        }
      } else if (mapsEmbedUrl.includes("google.com/maps/embed")) {
        // Jika user hanya menempel URL embed tanpa tag iframe
        finalIcon = mapsEmbedUrl;
      }
    }

    const { error } = await supabase
      .from("links")
      .update({
        title,
        url: finalUrl,
        link_type: linkType,
        icon: finalIcon,
      })
      .eq("id", link.id);

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
        title="Edit Tautan"
      >
        <Pencil size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-dark">Edit Tautan</h2>
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
                  Judul Tautan
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Kode Embed Google Maps
                    </label>
                    <textarea
                      value={mapsEmbedUrl}
                      onChange={(e) => setMapsEmbedUrl(e.target.value)}
                      placeholder="Paste kode <iframe ...></iframe>"
                      rows={4}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:border-navy focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    URL Tujuan
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
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
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
