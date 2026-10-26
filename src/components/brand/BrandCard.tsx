import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Brand } from "@/types/brand";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/${brand.slug}`}
      className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {/* Area Logo / Huruf Depan */}
      {brand.logo_url && brand.logo_url.trim() !== "" ? (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800">
          <img
            src={brand.logo_url}
            alt={`Logo ${brand.name}`}
            className="h-full w-full object-contain p-1.5"
          />
        </div>
      ) : (
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ backgroundColor: brand.primary_color || "#152C46" }}
          aria-hidden="true"
        >
          {brand.name.charAt(0)}
        </div>
      )}

      {/* Area Teks */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-text-dark">
          {brand.name}
        </p>
        {brand.tagline && (
          <p className="truncate text-xs text-muted">{brand.tagline}</p>
        )}
      </div>

      {/* Ikon Panah */}
      <ChevronRight
        size={18}
        className="shrink-0 text-muted transition group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
