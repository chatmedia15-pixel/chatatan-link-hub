"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud } from "lucide-react";

interface Props {
  currentImageUrl: string | null;
  onUploadSuccess: (url: string) => void;
}

export function ImageUpload({ currentImageUrl, onUploadSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar (JPG, PNG, dll).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2MB.");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // Upload ke Supabase
    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, file);

    if (uploadError) {
      alert("Gagal upload: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Ambil URL Publik
    const { data } = supabase.storage
      .from("brand-logos")
      .getPublicUrl(filePath);

    setPreview(data.publicUrl);
    onUploadSuccess(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Logo Brand</label>

      {/* Preview Gambar */}
      {preview && (
        <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {/* Tombol Pilih File */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
        />
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-3 text-sm text-gray-600 hover:bg-gray-100">
          <UploadCloud size={16} />
          {uploading ? "Mengunggah..." : "Pilih Foto Logo"}
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">Format: JPG, PNG. Maks: 2MB.</p>
    </div>
  );
}
