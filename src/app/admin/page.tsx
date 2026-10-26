"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { BrandForm } from "./BrandForm";
import { EditBrandButton } from "./brands/EditBrandButton";
import { DeleteBrandButton } from "./brands/DeleteBrandButton";

export default function AdminDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      setUserEmail(user.email || "");

      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Gagal mengambil data brand:", error.message);
      } else if (data) {
        setBrands(data);
      }
    };
    fetchData();
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-dark">
              Admin Dashboard
            </h1>
            <p className="text-xs text-muted">{userEmail}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
              <LogOut size={16} />
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-dark">Daftar Brand</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/brands/sort"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Atur Urutan
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Statistik
              </Link>
              <Link
                href="/admin/banners"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Kelola Banner
              </Link>
              {/* ... tombol Tambah Brand ... */}
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy/90"
            >
              <Plus size={16} />
              Tambah Brand
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Nama Brand</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brands.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Belum ada data brand.
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-text-dark">
                      {brand.name}
                    </td>
                    <td className="px-4 py-3 text-muted">/{brand.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          brand.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {brand.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="flex items-center justify-end gap-2 px-4 py-3">
                      <EditBrandButton brand={brand} />
                      <DeleteBrandButton id={brand.id} name={brand.name} />
                      <Link
                        href={`/admin/brands/${brand.slug}`}
                        className="inline-flex items-center gap-1 rounded bg-navy/5 px-3 py-1.5 text-xs font-medium text-navy transition hover:bg-navy/10"
                      >
                        Kelola Tautan
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isFormOpen && <BrandForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
