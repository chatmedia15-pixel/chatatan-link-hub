import Link from "next/link";
import { MessageCircle, Globe, Camera } from "lucide-react"; // Ganti Instagram dengan Camera

export function ContactUs() {
  // GANTI URL DI BAWAH INI DENGAN KONTAK RESMI CHATATAN GROUP
  const contacts = [
    {
      id: "wa",
      label: "WhatsApp",
      url: "https://wa.me/6287808003008", // Ganti nomor WA
      icon: MessageCircle,
    },
    {
      id: "web",
      label: "Website",
      url: "https://chatatangroup.com", // Ganti URL Website
      icon: Globe,
    },
    {
      id: "ig",
      label: "Instagram",
      url: "https://instagram.com/chatatan.group", // Ganti URL IG
      icon: Camera, // Gunakan Camera sebagai pengganti
    },
  ];

  return (
    <div className="mb-8 flex flex-col items-center">
      <h2 className="mb-4 text-lg font-bold text-white">Contact us</h2>

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
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-navy shadow-md transition-transform hover:scale-110"
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
