import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingWA() {
  // GANTI DENGAN NOMOR WHATSAPP CS CHATATAN GROUP
  const waNumber = "6287830080800";
  const waUrl = `https://wa.me/${waNumber}?text=Halo%20Chatatan%20Group,%20saya%20ingin%20bertanya.`;

  return (
    <Link
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
    >
      <MessageCircle size={28} />
    </Link>
  );
}
