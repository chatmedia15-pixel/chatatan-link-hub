"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState(0);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      // Ambil semua brand
      const { data: brands } = await supabase
        .from("brands")
        .select("id, name, slug");

      // Ambil semua kunjungan
      const { data: views } = await supabase
        .from("brand_views")
        .select("brand_id");

      if (brands && views) {
        // Hitung total per brand
        const counts: Record<string, number> = {};
        views.forEach((v) => {
          counts[v.brand_id] = (counts[v.brand_id] || 0) + 1;
        });

        const formattedStats = brands
          .map((brand) => ({
            ...brand,
            views: counts[brand.id] || 0,
          }))
          .sort((a, b) => b.views - a.views);

        setStats(formattedStats);
        setTotalViews(views.length);
      }
    };
    fetchStats();
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link href="/admin" className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-text-dark">
            Statistik Kunjungan
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-4xl px-6 space-y-8">
        {/* Ringkasan Total */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Kunjungan (Semua Brand)
              </p>
              <p className="text-3xl font-bold text-text-dark">
                {totalViews}{" "}
                <span className="text-base font-normal text-gray-500">
                  klik
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Statistik per Brand */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Nama Brand</th>
                <th className="px-4 py-3 text-right">Jumlah Kunjungan</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.map((stat, index) => (
                <tr key={stat.id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-500">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-text-dark">
                      {stat.name}
                    </div>
                    <div className="text-xs text-muted">/{stat.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-navy">
                    {stat.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
