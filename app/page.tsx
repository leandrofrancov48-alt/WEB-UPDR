"use client";

import { useState, useEffect } from "react";
import PhotoGallery from "../components/PhotoGallery";
import Image from "next/image";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      
      {/* HEADER INTELIGENTE */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 flex items-center h-20 px-6 transition-all duration-300 ease-in-out
          ${isScrolled 
            ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg" 
            : "bg-transparent border-b border-transparent"
          }
        `}
      >
        {/* 1. IZQUIERDA: LOGO 
            AGREGUÉ "top-6" PARA BAJARLO UN POCO DEL BORDE SUPERIOR
        */}
        <div className="absolute left-6 top-6 flex items-center">
          <div className={`relative transition-all duration-300 ${isScrolled ? "w-10 h-10" : "w-16 h-16 md:w-20 md:h-20"}`}>
             <Image 
               src="/logo.png" 
               alt="Logo" 
               fill
               className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
               priority
             />
          </div>
        </div>

        {/* 2. CENTRO: TÍTULO EN LA BARRA */}
        <div 
          className={`absolute left-0 right-0 mx-auto flex flex-col items-center justify-center transition-all duration-300
            ${isScrolled 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 -translate-y-2 pointer-events-none"
            }
          `}
        >
          <span className="text-brand-yellow font-yellow text-xl tracking-wide leading-none text-center">
            UN POCO DE RUIDO
          </span>
          <span className="text-white/60 text-[9px] uppercase tracking-[0.2em] font-sans text-center mt-1">
            Galería Oficial
          </span>
        </div>

       
      </header>

      {/* HERO SECTION */}
      <div className="relative h-[80vh] flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="text-[5rem] md:text-[9rem] lg:text-[12rem] leading-[0.8] font-yellow text-brand-yellow select-none animate-fade-in drop-shadow-[0_0_25px_rgba(232,212,63,0.3)]">
          UN POCO DE RUIDO
        </h1>
        
        <div className="text-white font-sans text-sm md:text-xl tracking-[0.5em] md:tracking-[1em] mt-6 uppercase opacity-80 font-bold drop-shadow-md">
          Galería Oficial de la Comunidad Cumbiera
        </div>
        
        <div className="absolute bottom-10 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
        
      {/* Galería */}
      <div className="relative z-20 min-h-screen pb-20 bg-gradient-to-b from-transparent to-black/80">
        <PhotoGallery />
      </div>
    
    </main>
  );
}