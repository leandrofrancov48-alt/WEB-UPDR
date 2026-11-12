"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, ArrowRight } from "lucide-react";

export default function StaffGlobalIndicator() {
  const pathname = usePathname();
  const [isStaff, setIsStaff] = useState(false);
  const [sector, setSector] = useState<string | null>(null);
  const [isAdminPagos, setIsAdminPagos] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkStaff() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.isStaff) {
          setIsStaff(true);
          setSector(data.staffSector);
          setIsAdminPagos(Boolean(data.isAdminPagos));
        }
      } catch (err) {
        // Silencioso
      }
    }

    checkStaff();
    return () => {
      isMounted = false;
    };
  }, []);

  // Si no es staff, no renderizamos absolutamente NADA
  if (!isStaff) return null;

  // Si ya está en la sección de staff o en el admin, no mostramos el botón flotante
  if (pathname?.startsWith("/staff") || pathname?.startsWith("/control-updr-admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <Link
        href={isAdminPagos ? "/control-updr-admin/jornadas" : "/staff"}
        className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0b1329]/95 border border-brand-yellow/60 text-brand-yellow font-bold text-xs shadow-[0_4px_25px_rgba(232,212,63,0.3)] hover:bg-brand-yellow hover:text-black transition-all duration-300 hover:scale-105 backdrop-blur-md"
        title={isAdminPagos ? "Acceso directo a la revisión y aprobación de jornadas extras" : "Acceso exclusivo a tu panel de jornadas y liquidaciones"}
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
        </span>
        <Briefcase className="w-4 h-4 stroke-[2.5]" />
        <span>{isAdminPagos ? "Staff Admin Extras" : "Solapa Staff"}</span>
        {isAdminPagos ? (
          <span className="hidden sm:inline text-[10px] font-mono uppercase bg-brand-yellow/20 text-brand-yellow px-2 py-0.5 rounded-full font-bold">
            👑 Admin
          </span>
        ) : sector ? (
          <span className="hidden sm:inline text-[10px] font-mono uppercase bg-brand-yellow/15 group-hover:bg-black/20 text-brand-yellow group-hover:text-black px-2 py-0.5 rounded-full transition-colors">
            {sector}
          </span>
        ) : null}
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
