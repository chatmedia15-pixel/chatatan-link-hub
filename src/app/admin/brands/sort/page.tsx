"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GripVertical, Save } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function SortBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchBrands = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data } = await supabase
        .from("brands")
        .select("id, name, slug, sort_order")
        .order("sort_order", { ascending: true });

      if (data) setBrands(data);
      setLoading(false);
    };
    fetchBrands();
  }, [supabase, router]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(brands);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBrands(items);
  };

  const handleSave = async () => {
    setSaving(true);

    // Update sort_order untuk setiap brand berdasarkan posisi barunya
    const updates = brands.map((brand, index) =>
      supabase
        .from("brands")
        .update({ sort_order: index + 1 })
        .eq("id", brand.id),
    );

    await Promise.all(updates);

    setSaving(false);
    alert("Urutan brand berhasil disimpan!");
    router.push("/admin");
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link href="/admin" className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-text-dark">
            Atur Urutan Brand
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-2xl px-6">
        <p className="mb-6 text-sm text-gray-500">
          Geser (drag & drop) kartu di bawah ini untuk mengubah urutan tampil di
          halaman utama. Brand paling atas akan muncul pertama kali.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="brands-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-3"
              >
                {brands.map((brand, index) => (
                  <Draggable
                    key={brand.id}
                    draggableId={brand.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm"
                      >
                        <GripVertical size={20} className="text-gray-400" />
                        <div className="flex-1">
                          <p className="font-semibold text-text-dark">
                            {brand.name}
                          </p>
                          <p className="text-xs text-muted">/{brand.slug}</p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/5 text-sm font-bold text-navy">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-sm font-semibold text-white transition hover:bg-navy/90 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Menyimpan..." : "Simpan Urutan"}
        </button>
      </main>
    </div>
  );
}
