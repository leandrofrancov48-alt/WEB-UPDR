"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* TOP: solo links flotando, sin barra/contendor */}
      <div
        className={`fixed top-5 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "opacity-0 pointer-events-none -translate-y-2" : "opacity-100"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between text-sm md:text-base text-white/95">
          <a href="#en-vivo" className="hover:text-brand-yellow transition-colors [text-shadow:0_0_16px_rgba(232,212,63,0.3)]">En vivo</a>
          <a href="#fechas" className="hover:text-brand-yellow transition-colors [text-shadow:0_0_16px_rgba(232,212,63,0.3)]">Fechas</a>
          <a href="#merch" className="hover:text-brand-yellow transition-colors [text-shadow:0_0_16px_rgba(232,212,63,0.3)]">Merch</a>
          <a href="#bio" className="hover:text-brand-yellow transition-colors [text-shadow:0_0_16px_rgba(232,212,63,0.3)]">Bio</a>
          <a href="#videos" className="hover:text-brand-yellow transition-colors [text-shadow:0_0_16px_rgba(232,212,63,0.3)]">Videos</a>
          <Link href="/galeria" className="hover:text-brand-yellow transition-colors [text-shadow:0_0_16px_rgba(232,212,63,0.3)]">Galería</Link>
        </nav>
      </div>

      {/* SCROLL: recién acá aparece header clásico */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050b1a]/78 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <div className="section-shell h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="UPDR" width={32} height={32} />
            <span className="text-xs md:text-sm tracking-[0.2em] font-semibold text-white/80">UN POCO DE RUIDO</span>
          </div>

          <nav className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-white/75">
            <a href="#en-vivo" className="hover:text-brand-yellow transition-colors">En vivo</a>
            <a href="#fechas" className="hover:text-brand-yellow transition-colors">Fechas</a>
            <a href="#merch" className="hover:text-brand-yellow transition-colors">Merch</a>
            <a href="#bio" className="hover:text-brand-yellow transition-colors">Bio</a>
            <a href="#videos" className="hover:text-brand-yellow transition-colors">Videos</a>
            <Link href="/galeria" className="hover:text-brand-yellow transition-colors">Galería</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
