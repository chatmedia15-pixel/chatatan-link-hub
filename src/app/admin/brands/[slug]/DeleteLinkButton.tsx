"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export function DeleteLinkButton({
  id,
  brandSlug,
}: {
  id: string;
  brandSlug: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus tautan ini?")) return;

    setLoading(true);
    const { error } = await supabase.from("links").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus: " + error.message);
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
      title="Hapus Tautan"
    >
      <Trash2 size={16} />
    </button>
  );
}
