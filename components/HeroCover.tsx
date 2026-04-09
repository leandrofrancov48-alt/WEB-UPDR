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

  const logoTranslate = Math.max(-180, -scrollY * 0.36);
  const logoRotateX = Math.min(20, scrollY * 0.04);
  const logoScale = Math.max(0.74, 1 - scrollY * 0.00045);
  const logoOpacity = Math.max(0.14, 1 - scrollY * 0.0015);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050b1a]">
      <div className="absolute inset-0">
        <Image
          src="/hero-updr.png"
          alt="Un Poco De Ruido"
          fill
          className="object-cover object-[center_22%] md:object-[center_24%]"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/28 to-black/16" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a] via-black/8 to-transparent" />
      </div>

      <div className="section-shell relative z-10 min-h-screen flex items-start justify-center pt-36 md:pt-44">
        <div className="relative h-[105px] md:h-[160px]" style={{ perspective: "1200px" }}>
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

      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050b1a]" />
    </section>
  );
}
