"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud } from "lucide-react";

interface Props {
  currentImageUrl: string | null;
  onUploadSuccess: (url: string) => void;
}

export function LinkImageUpload({ currentImageUrl, onUploadSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar (JPG, PNG, dll).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `link-${Date.now()}.${fileExt}`;
    const filePath = `links/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("brand-logos") // Kita pakai bucket yang sama
      .upload(filePath, file);

    if (uploadError) {
      alert("Gagal upload: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("brand-logos")
      .getPublicUrl(filePath);

    setPreview(data.publicUrl);
    onUploadSuccess(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        Gambar Tautan (Opsional)
      </label>

      {preview && (
        <div className="mb-3 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-contain"
          />
        </div>
      )}

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
          {uploading ? "Mengunggah..." : "Pilih Gambar"}
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">Format: JPG, PNG. Maks: 5MB.</p>
    </div>
  );
}
