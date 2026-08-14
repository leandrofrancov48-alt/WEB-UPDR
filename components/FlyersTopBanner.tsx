"use client";

import React from "react";
import Image from "next/image";
import { Ticket, Calendar, MapPin, Sparkles } from "lucide-react";

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
    colorBorder: "border-amber-400/60 hover:border-amber-400",
    glowColor: "from-amber-500/20 to-orange-500/10",
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
    colorBorder: "border-cyan-400/60 hover:border-cyan-400",
    glowColor: "from-cyan-500/20 to-blue-500/10",
  },
  {
    id: "laplata",
    city: "LA PLATA",
    countryBadge: "🇦🇷 LA PLATA",
    venue: "Hipódromo de La Plata",
    dateStr: "28 DE NOVIEMBRE 2026",
    legend: "ENTRADAS EN LIVEPASS (4 cuotas sin interés Banco Provincia)",
    imageSrc: "/flyers/laplata.png",
    ticketUrl: "https://livepass.com.ar/events/un-poco-de-ruido-en-el-hipodromo-de-la-plata",
    colorBorder: "border-emerald-400/60 hover:border-emerald-400",
    glowColor: "from-emerald-500/20 to-teal-500/10",
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
    <section className="w-full bg-gradient-to-b from-[#030712] via-[#0b1329] to-[#050b1a] pt-4 pb-6 px-4 border-b border-white/10 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-4">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-black tracking-widest text-brand-yellow uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-yellow" /> PRÓXIMAS GIRAS & SHOWS OFICIALES
            </span>
          </div>
          <button
            onClick={scrollToFechas}
            className="text-xs font-mono font-bold text-white/70 hover:text-brand-yellow transition-colors underline cursor-pointer"
          >
            Ver todas las fechas y links ↓
          </button>
        </div>

        {/* 3 Flyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {FEATURED_SHOWS.map((show) => (
            <div
              key={show.id}
              onClick={scrollToFechas}
              className={`bg-[#0f172a]/90 backdrop-blur-md border ${show.colorBorder} rounded-3xl p-4 flex flex-col justify-between space-y-3.5 transition-all duration-300 hover:scale-[1.02] shadow-2xl group cursor-pointer relative overflow-hidden`}
            >
              {/* Card top gradient glow */}
              <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${show.glowColor} opacity-50 pointer-events-none`}></div>

              {/* Top Badge & Venue */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <span className="text-[11px] font-black bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white tracking-wider">
                  {show.countryBadge}
                </span>
                <span className="text-[11px] font-mono font-bold text-brand-yellow flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {show.dateStr.split(" ")[0]} {show.dateStr.split(" ")[1]} {show.dateStr.split(" ")[2]}
                </span>
              </div>

              {/* Flyer Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:shadow-amber-500/20 transition-all">
                <Image
                  src={show.imageSrc}
                  alt={`Flyer ${show.city}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-xs text-white/70 font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-yellow" /> {show.venue}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black font-yellow text-white tracking-wide">
                    {show.city}
                  </h3>
                </div>
              </div>

              {/* Bottom Caption / Ticket Button */}
              <div className="space-y-2 relative z-10 text-left">
                <p className="text-[11px] text-white/80 font-mono line-clamp-1">
                  • {show.legend}
                </p>
                <div className="w-full bg-brand-yellow group-hover:bg-white text-black font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md">
                  <Ticket className="w-4 h-4" /> VER FECHAS Y COMPRAR
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
