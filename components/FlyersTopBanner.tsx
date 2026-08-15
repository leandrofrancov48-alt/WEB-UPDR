"use client";

import React from "react";
import Image from "next/image";
import { Ticket, Calendar, MapPin, Sparkles, ChevronRight } from "lucide-react";

export interface FlyerShow {
  id: string;
  city: string;
  countryBadge: string;
  venue: string;
  dateStr: string;
  legend: string;
  imageSrc: string;
  ticketUrl: string;
  colorBorder: string;
  glowColor: string;
  badgeBg: string;
}

export const FEATURED_SHOWS: FlyerShow[] = [
  {
    id: "rosario",
    city: "ROSARIO",
    countryBadge: "🇦🇷 ROSARIO",
    venue: "Metropolitano Rosario",
    dateStr: "31 DE OCTUBRE 2026",
    legend: "ENTRADAS EN TURBO ENTRADA",
    imageSrc: "/flyers/rosario.png",
    ticketUrl: "https://www.turboentrada.com/landing/un-poco-de-ruido?idEspectaculoCartel=17259&cHashValidacion=705fa88aa2bea8d5c9a2b4e9018ab8c5b0e7329c",
    colorBorder: "border-amber-500/40 hover:border-amber-400",
    glowColor: "from-amber-500/15 via-orange-500/5 to-transparent",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "montevideo",
    city: "MONTEVIDEO",
    countryBadge: "🇺🇾 URUGUAY",
    venue: "Rural del Prado",
    dateStr: "7 DE NOVIEMBRE 2026",
    legend: "ENTRADAS EN REDTICKETS",
    imageSrc: "/flyers/montevideo.png",
    ticketUrl: "https://redtickets.uy/evento/UN-POCO-DE-RUIDO--PRADO/31887/",
    colorBorder: "border-cyan-500/40 hover:border-cyan-400",
    glowColor: "from-cyan-500/15 via-blue-500/5 to-transparent",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  },
  {
    id: "laplata",
    city: "LA PLATA",
    countryBadge: "🇦🇷 LA PLATA",
    venue: "Hipódromo de La Plata",
    dateStr: "28 DE NOVIEMBRE 2026",
    legend: "ENTRADAS EN LIVEPASS (4 cuotas sin interés)",
    imageSrc: "/flyers/laplata.png",
    ticketUrl: "https://livepass.com.ar/events/un-poco-de-ruido-en-el-hipodromo-de-la-plata",
    colorBorder: "border-emerald-500/40 hover:border-emerald-400",
    glowColor: "from-emerald-500/15 via-teal-500/5 to-transparent",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
];

export default function FlyersTopBanner() {
  const scrollToFechas = () => {
    const el = document.getElementById("fechas");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#030712] via-[#091024] to-[#050b1a] pt-24 md:pt-28 pb-10 px-4 md:px-8 border-b border-white/10 relative overflow-hidden">
      {/* Glow ambiental de fondo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[220px] bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center">
        
        {/* Encabezado Centrado y Despejado de la Barra de Navegación */}
        <div className="space-y-2">
          <span className="text-[11px] md:text-xs font-black tracking-[0.2em] uppercase text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" /> PRÓXIMAS GIRAS & SHOWS OFICIALES
          </span>
          <h2 className="text-2xl md:text-4xl font-black font-yellow text-white tracking-wide uppercase drop-shadow-md">
            ELEGÍ TU FECHA Y COMPRÁ ENTRADAS
          </h2>
          <p className="text-xs md:text-sm text-white/70 max-w-lg mx-auto font-medium">
            Rosario, Montevideo y La Plata. Hacé click en cualquier flyer para ir directo a la venta.
          </p>
        </div>

        {/* 3 Flyers Grid Centrados y Proporcionados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
          {FEATURED_SHOWS.map((show) => (
            <div
              key={show.id}
              onClick={scrollToFechas}
              className={`bg-[#0c1427]/90 backdrop-blur-md border ${show.colorBorder} rounded-3xl p-4 md:p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.02] shadow-2xl group cursor-pointer relative overflow-hidden`}
            >
              {/* Resplandor superior sutil */}
              <div className={`absolute top-0 inset-x-0 h-28 bg-gradient-to-b ${show.glowColor} pointer-events-none`}></div>

              {/* Fila Superior: Badge País & Fecha */}
              <div className="flex items-center justify-between gap-2 relative z-10 font-mono text-xs">
                <span className={`font-black border px-3 py-1 rounded-full ${show.badgeBg}`}>
                  {show.countryBadge}
                </span>
                <span className="font-bold text-white/90 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> {show.dateStr.split(" ")[0]} {show.dateStr.split(" ")[1]}
                </span>
              </div>

              {/* Contenedor de Imagen de Flyer Proporcionado */}
              <div className="relative w-full aspect-[4/5] max-h-[360px] md:max-h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:border-white/30 transition-all mx-auto">
                <Image
                  src={show.imageSrc}
                  alt={`Flyer ${show.city}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity"></div>

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-xs text-white/80 font-mono flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" /> {show.venue}
                  </span>
                  <h3 className="text-2xl font-black font-yellow text-white tracking-wide">
                    {show.city}
                  </h3>
                </div>
              </div>

              {/* Pie con Leyenda Oficial y Botón Directo */}
              <div className="space-y-3 relative z-10 text-left">
                <p className="text-xs text-white/80 font-mono font-medium line-clamp-1 bg-white/5 p-2 rounded-xl border border-white/10">
                  • {show.legend}
                </p>

                <button
                  type="button"
                  className="w-full bg-brand-yellow group-hover:bg-white text-black font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg group-hover:shadow-amber-500/20 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" /> VER FECHAS Y COMPRAR <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
