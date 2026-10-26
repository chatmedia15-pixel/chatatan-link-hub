import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-3 text-sm text-blue-gray">Halaman tidak ditemukan.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-navy transition hover:bg-blue-gray"
      >
        Kembali ke Home
      </Link>
    </main>
  );
}
