"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FEATURED_SHOWS } from "./FlyersTopBanner";
import { X, Ticket, Calendar, MapPin, Sparkles, ChevronRight } from "lucide-react";

export default function UpcomingShowModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Abrir popup apenas entra a la página
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFlyerClick = (ticketUrl: string) => {
    setIsOpen(false);
    const el = document.getElementById("fechas");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Modal Container Centrado y Proporcionado */}
      <div className="relative bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#030712] border-2 border-brand-yellow/80 rounded-3xl p-5 md:p-8 max-w-4xl w-full shadow-[0_0_80px_rgba(245,158,11,0.35)] my-auto space-y-5 text-center animate-scaleUp">
        
        {/* Botón de Cierre "X" */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer z-20"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del Modal */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-black tracking-[0.2em] uppercase text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-4 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Novedad: Próximos Shows
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-yellow text-white tracking-wide uppercase drop-shadow-md">
            UN POCO DE RUIDO EN VIVO
          </h2>
          <p className="text-xs md:text-sm text-white/75 max-w-md mx-auto">
            Seleccioná tu show preferido para consultar fechas y conseguir entradas oficiales.
          </p>
        </div>

        {/* Grid de 3 Flyers en Modal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-1">
          {FEATURED_SHOWS.map((show) => (
            <div
              key={show.id}
              onClick={() => handleFlyerClick(show.ticketUrl)}
              className="bg-[#141d33] border border-white/15 hover:border-brand-yellow rounded-2xl p-3.5 space-y-3 transition-all duration-300 hover:scale-[1.03] shadow-xl cursor-pointer group flex flex-col justify-between"
            >
              {/* Badge País & Fecha */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-black bg-white/10 text-white px-2.5 py-0.5 rounded-md border border-white/15">
                  {show.countryBadge}
                </span>
                <span className="font-mono text-brand-yellow font-bold">
                  {show.dateStr.split(" ")[0]} {show.dateStr.split(" ")[1]}
                </span>
              </div>

              {/* Imagen del Flyer */}
              <div className="relative w-full aspect-[4/5] max-h-[260px] md:max-h-[280px] rounded-xl overflow-hidden border border-white/10 mx-auto">
                <Image
                  src={show.imageSrc}
                  alt={show.city}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info y Leyenda */}
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white group-hover:text-brand-yellow transition-colors font-yellow">
                  {show.city}
                </h4>
                <p className="text-xs text-white/80 font-mono font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" /> {show.venue}
                </p>
                <p className="text-[11px] text-brand-yellow/90 font-mono font-bold line-clamp-1 bg-brand-yellow/10 p-1.5 rounded-lg border border-brand-yellow/20">
                  • {show.legend}
                </p>
              </div>

              {/* Botón */}
              <div className="pt-1">
                <button
                  type="button"
                  className="w-full bg-brand-yellow group-hover:bg-white text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" /> IR A ENTRADAS <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pie de Modal */}
        <div className="pt-1">
          <button
            onClick={handleClose}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-8 py-2.5 rounded-full border border-white/20 transition-colors cursor-pointer"
          >
            CERRAR Y CONTINUAR EN LA WEB
          </button>
        </div>

      </div>
    </div>
  );
}
