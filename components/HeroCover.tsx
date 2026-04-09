"use client";

import Image from "next/image";
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
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050b1a]">
      <div className="h-16 md:h-20" />

      <div className="absolute left-0 right-0 top-14 md:top-16 bottom-0">
        <Image
          src="/hero-updr.png"
          alt="Un Poco De Ruido"
          fill
          className="object-cover object-[center_18%] md:object-[center_24%]"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/30 to-black/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a] via-black/10 to-transparent" />
      </div>

      <div className="section-shell relative z-10 min-h-screen flex items-center justify-center">
        <div className="relative h-[140px] md:h-[220px]" style={{ perspective: "1200px" }}>
          <Image
            src="/logo.png"
            alt="UPDR Logo"
            width={620}
            height={260}
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
      </div>

      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#050b1a]" />
    </section>
  );
}
