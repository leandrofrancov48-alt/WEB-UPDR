"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

type YoutubeVideo = {
  id: string;
  title: string;
  published?: string;
};

export default function VideoCarousel({ videos }: { videos: YoutubeVideo[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);
  
  // Variables para la inercia (momentum scroll)
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Limpieza del frame de animación al desmontar
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    dragDistance.current = 0;
    
    // Cancelar cualquier animación de inercia previa activa
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    
    // Desactivamos el comportamiento smooth nativo durante el arrastre para mayor inmediatez
    containerRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseLeave = () => {
    if (isDown.current) {
      isDown.current = false;
      startMomentumScroll();
    }
  };

  const handleMouseUp = () => {
    if (isDown.current) {
      isDown.current = false;
      startMomentumScroll();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Sensibilidad de arrastre
    
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    dragDistance.current = Math.abs(x - startX.current);
    
    // Cálculo de velocidad instantánea
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastTime.current;
    if (timeElapsed > 0) {
      const deltaX = e.pageX - lastX.current;
      velocity.current = deltaX / timeElapsed; // píxeles por milisegundo
    }
    
    lastX.current = e.pageX;
    lastTime.current = currentTime;
  };

  const startMomentumScroll = () => {
    if (!containerRef.current) return;
    
    let vel = velocity.current;
    // Solo aplicamos inercia si el "flick" (deslizamiento rápido) fue significativo
    if (Math.abs(vel) < 0.15) {
      if (containerRef.current) {
        containerRef.current.style.scrollBehavior = "smooth";
      }
      return;
    }
    
    const container = containerRef.current;
    container.style.scrollBehavior = "auto";

    const momentumLoop = () => {
      // Factor de fricción/desaceleración (0.95 frena de a 5% por frame)
      vel *= 0.95;
      
      // Mover la barra de scroll (escalado por ~16.6ms promedio de frame de renderizado)
      container.scrollLeft -= vel * 16;
      
      // Si sigue habiendo velocidad apreciable, continuamos el frame
      if (Math.abs(vel) > 0.05) {
        animationFrameId.current = requestAnimationFrame(momentumLoop);
      } else {
        container.style.scrollBehavior = "smooth";
      }
    };
    
    animationFrameId.current = requestAnimationFrame(momentumLoop);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    // Si se arrastró más de 10px, asumimos intención de scroll y prevenimos navegación
    if (dragDistance.current > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="custom-scrollbar flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            onDragStart={(e) => e.preventDefault()}
            className="glass-card p-3 min-w-[86%] md:min-w-[58%] xl:min-w-[42%] snap-start hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full overflow-hidden rounded-xl border border-white/10 pointer-events-none" style={{ paddingTop: "56.25%" }}>
              <Image
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                fill
                draggable={false}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 hover:bg-black/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-black/60 border border-white/30 text-white text-xs tracking-widest">VER VIDEO</span>
              </div>
            </div>
            <p className="mt-4 text-white/90 text-sm md:text-base pointer-events-none">{video.title}</p>
          </a>
        ))}
      </div>
      <p className="text-white/50 text-xs mt-3">Mantené presionado y arrastrá para deslizar lateralmente →</p>
    </div>
  );
}
