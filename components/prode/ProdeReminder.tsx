"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProdeReminder() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the reminder
    const isDismissed = localStorage.getItem("prode_reminder_16avos_dismissed");
    if (!isDismissed) {
      // Show the reminder after a small delay for better entrance effect
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("prode_reminder_16avos_dismissed", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-6 right-6 sm:left-auto sm:max-w-md z-[100] bg-[#050b1a]/95 border-2 border-brand-yellow/50 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_50px_rgba(255,204,0,0.2)] flex gap-4 overflow-hidden"
        >
          {/* Glowing background highlights */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-brand-yellow/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-brand-orange/10 rounded-full blur-xl pointer-events-none" />

          {/* Icon section */}
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 relative">
            <Trophy className="w-6 h-6 text-brand-yellow animate-bounce" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-orange"></span>
            </span>
          </div>

          {/* Content section */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-yellow tracking-widest uppercase mb-1">
              <Calendar className="w-3 h-3" />
              ¡LLEGAN LOS 16AVOS!
            </div>
            
            <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-1.5">
              No te olvides de jugar al Prode
            </h4>
            
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Comenzó la fase eliminatoria del Mundial. Completá tus pronósticos ahora y competí por un par de entradas para el show en Vélez 🎫.
            </p>

            <div className="flex gap-2">
              <Link
                href="/prode"
                onClick={handleDismiss}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-brand-yellow to-brand-orange text-black font-bold text-[10px] tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-yellow/10"
              >
                PRONOSTICAR AHORA
              </Link>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-[10px] tracking-wider font-semibold text-white/70"
              >
                MÁS TARDE
              </button>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss reminder"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
