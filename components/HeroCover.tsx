"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroCover() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoTranslate = Math.max(-220, -scrollY * 0.42);
  const logoRotateX = Math.min(26, scrollY * 0.045);
  const logoScale = Math.max(0.66, 1 - scrollY * 0.00055);
  const logoOpacity = Math.max(0.08, 1 - scrollY * 0.0018);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <Image src="/hero-updr.png" alt="Un Poco De Ruido" fill className="object-cover object-center" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/20 to-transparent" />

      <div className="section-shell relative z-10 min-h-screen flex items-end pb-14 md:pb-20">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] text-brand-yellow mb-4">PROGRAMA OFICIAL</p>

          <div className="relative h-[140px] md:h-[190px] mb-3" style={{ perspective: "1200px" }}>
            <Image
              src="/logo.png"
              alt="UPDR Logo"
              width={520}
              height={220}
              className="w-auto h-full object-contain drop-shadow-[0_16px_45px_rgba(0,0,0,0.55)]"
              style={{
                transform: `translate3d(0, ${logoTranslate}px, 0) rotateX(${logoRotateX}deg) scale(${logoScale})`,
                transformOrigin: "center bottom",
                opacity: logoOpacity,
                transition: "transform 120ms linear, opacity 120ms linear",
              }}
              priority
            />
          </div>

          <h1 className="font-yellow text-brand-yellow text-5xl md:text-7xl leading-[0.9]">UN POCO DE RUIDO</h1>
          <p className="text-white/80 max-w-xl mt-5 text-sm md:text-base">
            Streaming argentino, música en vivo y cultura popular. Una comunidad que crece en cada transmisión y explota en cada show.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#en-vivo" className="px-6 py-3 rounded-full bg-brand-yellow text-black font-bold text-sm hover:bg-white transition-colors">Ver en vivo</a>
            <Link href="/galeria" className="px-6 py-3 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors">Ver galería</Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#070709]" />
    </section>
  );
}
