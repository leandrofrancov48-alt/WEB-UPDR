"use client";

import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
      <nav className="pointer-events-auto mx-auto w-fit flex items-center gap-3 md:gap-4 rounded-full bg-black/30 backdrop-blur-sm px-4 md:px-6 py-2 border border-white/15 text-xs md:text-sm text-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <a href="#en-vivo" className="hover:text-brand-yellow transition-colors">En vivo</a>
        <a href="#fechas" className="hover:text-brand-yellow transition-colors">Fechas</a>
        <a href="#merch" className="hover:text-brand-yellow transition-colors">Merch</a>
        <a href="#bio" className="hover:text-brand-yellow transition-colors">Bio</a>
        <a href="#videos" className="hover:text-brand-yellow transition-colors">Videos</a>
        <Link href="/galeria" className="hover:text-brand-yellow transition-colors">Galería</Link>
      </nav>
    </header>
  );
}
