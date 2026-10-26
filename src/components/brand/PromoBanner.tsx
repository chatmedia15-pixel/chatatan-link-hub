"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export function PromoBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (data) setBanners(data);
    };
    fetchBanners();
  }, [supabase]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const containerWidth = current.clientWidth;

        if (activeIndex === banners.length - 1) {
          current.scrollTo({ left: 0, behavior: "smooth" });
          setActiveIndex(0);
        } else {
          current.scrollBy({ left: containerWidth, behavior: "smooth" });
          setActiveIndex((prev) => prev + 1);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [banners, activeIndex]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollPosition = current.scrollLeft;
      const width = current.clientWidth;
      const newIndex = Math.round(scrollPosition / width);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative mb-8 w-full">
      <div className="overflow-hidden rounded-3xl bg-white/5 p-2 backdrop-blur-sm border border-white/10 shadow-xl">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex snap-x snap-mandatory gap-0 overflow-x-auto rounded-2xl touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {banners.map((banner) => (
            <a
              key={banner.id}
              href={banner.target_url || "#"}
              target={banner.target_url ? "_blank" : "_self"}
              className="relative w-full shrink-0 snap-center overflow-hidden rounded-xl aspect-[4/5]"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="h-full w-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-bold tracking-wide sm:text-base drop-shadow-md">
                  {banner.title}
                </p>
              </div>
            </a>
          ))}
        </div>

        {banners.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-3 mb-1">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
