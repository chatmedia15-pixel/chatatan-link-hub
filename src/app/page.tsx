import { BrandCard } from "@/components/brand/BrandCard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PromoBanner } from "@/components/brand/PromoBanner";
import { createClient } from "@/lib/supabase/server";
import type { Brand } from "@/types/brand";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Pesan Error:", error.message);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Tekstur Grid Halus di Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Efek Cahaya Samar di Tengah */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Konten Utama (Flexbox untuk Sticky Footer) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-hub flex-col px-4 pt-8 pb-0 sm:pt-12">
        {/* Title & Logo Utama */}
        <div className="mt-4 mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center">
            <Image
              src="/images/logo-cg.png"
              alt="Logo Chatatan Group"
              width={300}
              height={150}
              className="h-auto w-auto max-h-36 max-w-[280px] object-contain sm:max-h-44 sm:max-w-[320px]"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            CHATATAN GROUP APPS
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Multiple Brand Under One Group
          </p>
        </div>

        {/* Tombol Download Aplikasi */}
        <div className="mb-8 flex flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="https://play.google.com/store/apps/details?id=com.chatatangroup.chatatangroup"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img
              src="/images/play-store.png"
              alt="Get it on Google Play"
              className="h-16 w-auto object-contain sm:h-20"
            />
          </Link>

          <Link
            href="https://apps.apple.com/id/app/chatatan-group/id6740983529?l=id"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img
              src="/images/app-store.png"
              alt="Download on the App Store"
              className="h-16 w-auto object-contain sm:h-20"
            />
          </Link>
        </div>

        {/* --- GARIS PEMISAH 1 --- */}
        <div className="mb-10 h-[1px] w-full bg-white/20" />

        {/* 1. Brand List */}
        <div className="flex flex-col gap-3 mb-10">
          {brands?.map((brand) => (
            <BrandCard key={brand.id} brand={brand as Brand} />
          ))}
        </div>

        {/* --- GARIS PEMISAH 2 --- */}
        <div className="mb-10 h-[1px] w-full bg-white/20" />

        {/* 2. Promo Banner */}
        <PromoBanner />

        {/* 3. Footer */}
        <div className="mt-auto w-full">
          <SiteFooter />
        </div>
      </div>
    </main>
  );
}
