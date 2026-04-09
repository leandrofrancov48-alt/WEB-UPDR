"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingHeader() {
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBrand(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#070709]/60 backdrop-blur-md">
      <div className="section-shell h-16 flex items-center justify-between">
        <div className={`flex items-center gap-3 transition-all duration-300 ${showBrand ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <Image src="/logo.png" alt="UPDR" width={32} height={32} />
          <span className="text-xs md:text-sm tracking-[0.2em] font-semibold text-white/80">UN POCO DE RUIDO</span>
        </div>

        <nav className="ml-auto flex items-center gap-5 md:gap-7 text-xs md:text-sm text-white/70">
          <a href="#en-vivo" className="hover:text-brand-yellow transition-colors">En vivo</a>
          <a href="#fechas" className="hover:text-brand-yellow transition-colors">Fechas</a>
          <a href="#merch" className="hover:text-brand-yellow transition-colors">Merch</a>
          <a href="#bio" className="hover:text-brand-yellow transition-colors">Bio</a>
          <a href="#videos" className="hover:text-brand-yellow transition-colors">Videos</a>
          <Link href="/galeria" className="hover:text-brand-yellow transition-colors">Galería</Link>
        </nav>
      </div>
    </header>
  );
}
