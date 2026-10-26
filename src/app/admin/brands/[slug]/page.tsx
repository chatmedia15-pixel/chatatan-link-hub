import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { LinkForm } from "./LinkForm";
import { DeleteLinkButton } from "./DeleteLinkButton";
import { EditLinkButton } from "./EditLinkButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ManageBrandLinks({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Cek Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Ambil data brand berdasarkan slug
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!brand) notFound();

  // Ambil semua links milik brand ini
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("brand_id", brand.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="rounded-lg p-2 hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-text-dark">
                Kelola Tautan: {brand.name}
              </h1>
              <p className="text-xs text-muted">/{brand.slug}</p>
            </div>
          </div>

          {/* TOMBOL BARU DI SINI */}
          <Link
            href={`/admin/brands/${slug}/sort`}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Atur Urutan Tautan
          </Link>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-4xl px-6">
        {/* Daftar Link */}
        <div className="mb-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-4 py-3 font-medium text-gray-700">
            Daftar Tautan
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {links?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Belum ada tautan. Silakan tambah di bawah.
                  </td>
                </tr>
              ) : (
                links?.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-text-dark">
                      {link.title}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted">
                      {link.url}
                    </td>
                    <td className="px-4 py-3 capitalize">{link.link_type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${link.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {link.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="flex items-center justify-end gap-2 px-4 py-3">
                      <EditLinkButton link={link} />
                      <DeleteLinkButton id={link.id} brandSlug={slug} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Form Tambah Link */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-text-dark">
            Tambah Tautan Baru
          </h2>
          <LinkForm brandId={brand.id} brandSlug={slug} />
        </div>
      </main>
    </div>
  );
}
