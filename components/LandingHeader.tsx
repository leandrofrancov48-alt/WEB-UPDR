"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeaderUser = { nombre: string; apellido: string } | null;

const sectionLinks = [
  { href: "#en-vivo", label: "En vivo" },
  { href: "#fechas", label: "Fechas" },
  { href: "#merch", label: "Merch" },
  { href: "#bio", label: "Bio" },
  { href: "#videos", label: "Videos" },
];

export default function LandingHeader({ user }: { user: HeaderUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  }

  const name = user ? `${user.nombre} ${user.apellido}`.trim() : "";

  return (
    <>
      <div className={`fixed top-5 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "opacity-0 pointer-events-none -translate-y-2" : "opacity-100"}`}>
        <nav className="mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between text-white/95">
          <div className="hidden md:flex md:items-center md:gap-6">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href} className="font-yellow text-lg hover:text-brand-yellow transition-all duration-200 hover:scale-105">{link.label}</a>
            ))}
            <Link href="/galeria" className="font-yellow text-lg hover:text-brand-yellow transition-all duration-200 hover:scale-105">Galería</Link>
          </div>

          <div className="md:hidden flex items-center justify-between w-full">
            <Image src="/logo.png" alt="UPDR" width={34} height={34} />
            <button onClick={() => setOpen((v) => !v)} className="rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-lg">{open ? "✕" : "☰"}</button>
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            {user ? (
              <>
                <Link href="/perfil" className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:text-brand-yellow transition-colors">Mi perfil</Link>
                <button onClick={logout} className="rounded-full border border-brand-yellow/40 px-3 py-1 text-brand-yellow hover:bg-brand-yellow hover:text-black transition-colors">Salir</button>
              </>
            ) : (
              <Link href="/login" className="rounded-full border border-brand-yellow/40 px-3 py-1 text-brand-yellow hover:bg-brand-yellow hover:text-black transition-colors">Login</Link>
            )}
          </div>
        </nav>
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050b1a]/78 backdrop-blur-md transition-all duration-300 ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"}`}>
        <div className="section-shell h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="UPDR" width={32} height={32} />
            <span className="hidden md:inline text-xs tracking-[0.2em] font-semibold text-white/80">UN POCO DE RUIDO</span>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-xs md:text-sm text-white/75">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href} className="font-yellow text-base hover:text-brand-yellow transition-all duration-200 hover:scale-105">{link.label}</a>
            ))}
            <Link href="/galeria" className="font-yellow text-base hover:text-brand-yellow transition-all duration-200 hover:scale-105">Galería</Link>
            {user ? (
              <>
                <Link href="/perfil" className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:text-brand-yellow transition-colors">Mi perfil</Link>
                <button onClick={logout} className="rounded-full border border-brand-yellow/40 px-3 py-1 text-brand-yellow hover:bg-brand-yellow hover:text-black transition-colors">Salir</button>
              </>
            ) : (
              <Link href="/login" className="rounded-full border border-brand-yellow/40 px-3 py-1 text-brand-yellow hover:bg-brand-yellow hover:text-black transition-colors">Login</Link>
            )}
          </nav>

          <button onClick={() => setOpen((v) => !v)} className="md:hidden rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-lg">{open ? "✕" : "☰"}</button>
        </div>
      </header>

      {open ? (
        <div className="fixed top-16 left-0 right-0 z-50 md:hidden border-b border-white/10 bg-[#050b1a]/95 backdrop-blur p-4">
          <div className="flex flex-col gap-3">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-yellow text-xl text-white/90">{link.label}</a>
            ))}
            <Link href="/galeria" onClick={() => setOpen(false)} className="font-yellow text-xl text-white/90">Galería</Link>
            {user ? (
              <>
                <Link href="/perfil" onClick={() => setOpen(false)} className="font-yellow text-xl text-brand-yellow">Mi perfil ({name})</Link>
                <button onClick={logout} className="w-fit rounded-full border border-brand-yellow/40 px-4 py-1 text-brand-yellow">Salir</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="font-yellow text-xl text-brand-yellow">Login</Link>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
