import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingWA } from "@/components/layout/FloatingWA";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Chatatan Group | Explore Our Brands",
    template: "%s | Chatatan Group",
  },
  description:
    "Pusat tautan resmi lima brand di bawah ekosistem Chatatan Group: Chatbox.id, CHTTN Basic, ChatBarber, Chat Shoe Treatment, dan Ratingin.id.",
  openGraph: {
    title: "Chatatan Group Apps",
    description: "Explore Our Brands - Temukan tautan resmi layanan kami.",
    url: "https://chatatan.com", // Ganti dengan domain nanti
    siteName: "Chatatan Group",
    images: [
      {
        url: "/images/og-image.jpg", // Buat gambar banner ukuran 1200x630px dan taruh di public/images/
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <FloatingWA />
      </body>
    </html>
  );
}
