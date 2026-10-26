import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/layout/ShareButton";
import { LinkButton } from "@/components/links/LinkButton";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import type { BrandLink } from "@/types/brand";

interface Props {
  params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("name, tagline")
    .eq("slug", slug)
    .single();

  if (!brand) return { title: "Brand tidak ditemukan" };

  return {
    title: `${brand.name} | Official Links`,
    description: brand.tagline ?? `Tautan resmi ${brand.name}`,
    openGraph: {
      title: `${brand.name} | Official Links`,
      description: brand.tagline ?? `Tautan resmi ${brand.name}`,
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand: slug } = await params;
  const supabase = await createClient();

  const { data: brand, error } = await supabase
    .from("brands")
    .select(
      `
      *,
      links (*)
    `,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!brand || error) {
    notFound();
  }

  const activeLinks = (brand.links as BrandLink[])
    .filter((l) => l.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* 1. Tekstur Grid Halus di Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 2. Efek Cahaya Samar di Tengah */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Konten Utama */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-hub flex-col px-4 py-8 sm:py-12">
        {/* Back + share */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Home
          </Link>
          <ShareButton title={`${brand.name} | Official Links`} />
        </div>

        {/* Profile & Logo */}
        <div className="mb-8 text-center">
          {brand.logo_url && brand.logo_url.trim() !== "" ? (
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img
                src={brand.logo_url}
                alt={`Logo ${brand.name}`}
                className="h-auto w-auto max-h-24 max-w-[200px] object-contain"
              />
            </div>
          ) : (
            <div
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white shadow-md"
              style={{ backgroundColor: brand.primary_color || "#152C46" }}
            >
              {brand.name.charAt(0)}
            </div>
          )}

          <h1 className="text-xl font-bold text-white sm:text-2xl">
            {brand.name}
          </h1>
          {brand.tagline && (
            <p className="mt-1 text-sm text-neutral-400 uppercase tracking-widest">
              {brand.tagline}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          {activeLinks.length === 0 ? (
            <p className="rounded-2xl bg-white/10 p-6 text-center text-sm text-white/70">
              Belum ada tautan aktif.
            </p>
          ) : (
            activeLinks.map((link) => <LinkButton key={link.id} link={link} />)
          )}
        </div>

        {/* Back to home (bottom) */}
        <div className="mt-8">
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-3 text-sm text-white backdrop-blur-md transition hover:bg-white/10"
          >
            ← Back to Home
          </Link>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
