"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Trash2 } from "lucide-react";

export default function ManageBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const supabase = createClient();
  const router = useRouter();

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBanners(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/admin/login");
      else fetchBanners();
    };
    checkAuth();
  }, [supabase, router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!title.trim()) {
      alert("Isi Judul Banner terlebih dahulu sebelum memilih foto.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `banner-${Date.now()}.${fileExt}`;

    // Upload ke bucket brand-logos
    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(`banners/${fileName}`, file);

    if (uploadError) {
      alert("Gagal upload: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("brand-logos")
      .getPublicUrl(`banners/${fileName}`);

    // Simpan ke database
    const { error: dbError } = await supabase.from("banners").insert({
      title,
      image_url: data.publicUrl,
      target_url: targetUrl || null,
      is_active: true,
      sort_order: 0,
    });

    if (dbError) {
      alert("Gagal menyimpan ke database: " + dbError.message);
    } else {
      setTitle("");
      setTargetUrl("");
      fetchBanners();
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner ini?")) return;
    await supabase.from("banners").delete().eq("id", id);
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link href="/admin" className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-text-dark">
            Kelola Banner Promo
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-4xl px-6 space-y-8">
        {/* Form Upload Banner */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Tambah Banner Baru</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Judul Promo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Promo Ramadan 50%"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Link Tujuan (Opsional)
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://... atau /chatbox"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">
              Foto Banner (Rasio 16:9)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
              />
              <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-6 text-sm text-gray-600 hover:bg-gray-100">
                <UploadCloud size={20} />
                {uploading ? "Mengunggah..." : "Pilih Foto Banner"}
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Banner */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group relative overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-dark">{banner.title}</p>
                  {banner.target_url && (
                    <p className="text-xs text-muted truncate max-w-[200px]">
                      {banner.target_url}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
