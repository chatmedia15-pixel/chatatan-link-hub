"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export function DeleteBrandButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    // Konfirmasi Ganda
    const isConfirmed = window.confirm(
      `PERINGATAN!\n\nAnda akan menghapus brand "${name}" beserta SELURUH TAUTAN di dalamnya.\n\nTindakan ini tidak dapat dibatalkan. Lanjutkan?`,
    );

    if (!isConfirmed) return;

    setLoading(true);

    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus brand: " + error.message);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
      title="Hapus Brand"
    >
      <Trash2 size={16} />
    </button>
  );
}
