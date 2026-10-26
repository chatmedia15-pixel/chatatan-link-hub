import Link from "next/link";
import { MessageCircle, Globe, Camera } from "lucide-react";

export function SiteFooter() {
  // GANTI URL DI BAWAH INI DENGAN KONTAK RESMI
  const contacts = [
    {
      id: "wa",
      label: "WhatsApp",
      url: "https://wa.me/6287830080800",
      icon: MessageCircle,
    },
    {
      id: "web",
      label: "Website",
      url: "https://chatatangroup.com",
      icon: Globe,
    },
    {
      id: "ig",
      label: "Instagram",
      url: "https://instagram.com/chatatan.group",
      icon: Camera,
    },
  ];

  return (
    <footer className="mt-12 pb-8 flex flex-col items-center gap-6 text-center text-xs text-neutral-500">
      {/* Bagian Contact Us */}
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-base font-bold text-white">Contact us</h2>
        <div className="flex items-center gap-4">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <Link
                key={contact.id}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contact.label}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-navy shadow-md transition-transform hover:scale-110 hover:bg-neutral-200"
              >
                <Icon size={22} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Garis Pemisah (Opsional) */}
      <div className="h-px w-24 bg-white/10" />

      {/* Teks Copyright */}
      <p>© {new Date().getFullYear()} Chatatan Group. All rights reserved.</p>
    </footer>
  );
}
