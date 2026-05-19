"use client";

import { Image as ImageIcon, Trophy, Music, BookOpen, ShieldAlert, ExternalLink } from "lucide-react";

export default function AdminPageClient() {
  const adminModules = [
    {
      title: "Gestión de Galería",
      description: "Cargá y organizá fotos oficiales de los shows de noviembre y diciembre para los fans.",
      icon: ImageIcon,
      link: "/control-updr-admin/galeria",
      badge: "Multimedia",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400"
    },
    {
      title: "Control del Prode",
      description: "Administrá partidos de fútbol, cargá resultados reales y computá puntos para todos los participantes.",
      icon: Trophy,
      link: "/control-updr-admin/prode",
      badge: "Torneo",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
    },
    {
      title: "Bandas Emergentes",
      description: "Moderá postulaciones de músicos y bandas independientes, escuchá sus temas y dales de alta.",
      icon: Music,
      link: "/control-updr-admin/emergentes",
      badge: "Moderación",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400"
    },
    {
      title: "Gestión de Álbum",
      description: "Supervisá el progreso de coleccionistas de figuritas y regalá sobres de regalo en vivo.",
      icon: BookOpen,
      link: "/control-updr-admin/album",
      badge: "Comunidad",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050b1a] text-white p-6 md:p-12 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Luces de fondo premium */}
      <div className="absolute -top-60 -left-60 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl md:text-5xl font-yellow text-brand-yellow tracking-wider uppercase">
              Panel de Control Admin
            </h1>
            <p className="text-neutral-400 text-xs md:text-sm mt-2">
              Bienvenido a la consola central. Seleccioná un submódulo para administrar las secciones públicas.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/30 px-4 py-2 rounded-full">
            <ShieldAlert className="w-4 h-4 text-brand-yellow" />
            <span className="text-[10px] tracking-widest font-black uppercase text-brand-yellow font-mono">
              Acceso Restringido
            </span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {adminModules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <a
                key={index}
                href={mod.link}
                className="bg-white/5 border border-white/10 hover:border-brand-yellow/50 rounded-3xl p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(232,212,63,0.05)] relative group overflow-hidden flex flex-col justify-between min-h-[220px]"
              >
                {/* Degradados de fondo con animación sutil */}
                <div className={`absolute -right-20 -bottom-20 w-44 h-44 rounded-full blur-3xl opacity-20 bg-gradient-to-tr ${mod.color} group-hover:scale-150 transition-transform duration-500`}></div>

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3.5 rounded-2xl bg-white/5 group-hover:bg-brand-yellow/10 group-hover:text-brand-yellow transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[9px] tracking-wider font-extrabold uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/55">
                      {mod.badge}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-brand-yellow transition-colors duration-300 flex items-center gap-2">
                    {mod.title}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed max-w-sm">
                    {mod.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 group-hover:text-brand-yellow transition-colors mt-6 font-sans">
                  Ingresar al módulo <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}
        </section>

        {/* Informacion de estado de la base de datos */}
        <footer className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-2">
          <span>Un Poco de Ruido © 2026 - Consola Centralizada de Operaciones</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono text-[10px]">Conectado a la base de datos</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
