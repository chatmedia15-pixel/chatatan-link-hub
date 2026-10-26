"use client";

import { useEffect } from "react";

export function ViewTracker({ brandId }: { brandId: string }) {
  useEffect(() => {
    // 1. Cek apakah brand ini sudah dicatat di sesi browser ini
    const storageKey = `viewed_${brandId}`;
    const lastViewed = sessionStorage.getItem(storageKey);

    if (lastViewed) {
      const timeDiff = Date.now() - parseInt(lastViewed, 10);
      const oneHour = 60 * 60 * 1000; // 1 jam dalam milidetik

      // Jika sudah dilihat kurang dari 1 jam yang lalu, jangan catat lagi
      if (timeDiff < oneHour) {
        return;
      }
    }

    // 2. Catat kunjungan ke API
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId }),
    })
      .then((res) => {
        if (res.ok) {
          // Simpan waktu kunjungan ke sessionStorage
          sessionStorage.setItem(storageKey, Date.now().toString());
        }
      })
      .catch((err) => console.error("Gagal mencatat kunjungan:", err));
  }, [brandId]);

  return null;
}
