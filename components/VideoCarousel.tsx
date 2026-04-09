"use client";

import Image from "next/image";
import { useRef } from "react";

type YoutubeVideo = {
  id: string;
  title: string;
  published?: string;
};

export default function VideoCarousel({ videos }: { videos: YoutubeVideo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startScrollRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !draggingRef.current) return;

    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 5) movedRef.current = true;

    el.scrollLeft = startScrollRef.current - delta * 1.1;
  };

  const endDrag = () => {
    const el = trackRef.current;
    draggingRef.current = false;
    if (el) el.style.cursor = "grab";
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab select-none scroll-smooth"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (movedRef.current) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            onDragStart={(e) => e.preventDefault()}
            className="glass-card p-3 min-w-[86%] md:min-w-[58%] xl:min-w-[42%] snap-start hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
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
            <p className="mt-4 text-white/90 text-sm md:text-base">{video.title}</p>
          </a>
        ))}
      </div>
      <p className="text-white/50 text-xs mt-2">Arrastrá con el mouse y soltá para seguir viendo →</p>
    </div>
  );
}
