"use client";

import { useRef } from "react";
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    dragDistance.current = 0;
    // Desactivamos scroll-behavior durante el arrastre para mayor rapidez de respuesta
    containerRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (containerRef.current) {
      containerRef.current.style.scrollBehavior = "smooth";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // multiplicador de velocidad
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    dragDistance.current = Math.abs(x - startX.current);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    // Si se arrastró más de 10px, es un deslizamiento y no una intención de click
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
