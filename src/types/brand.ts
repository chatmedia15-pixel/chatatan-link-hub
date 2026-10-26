export type LinkType = "instagram" | "whatsapp" | "maps" | "website" | "other";

export interface BrandLink {
  id: string;
  brand_id: string;
  title: string;
  description?: string | null;
  url: string;
  link_type: string;
  icon?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logo_url?: string | null;
  background_url?: string | null;
  primary_color: string;
  secondary_color: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  links?: BrandLink[]; // Relasi ke tabel links
}
