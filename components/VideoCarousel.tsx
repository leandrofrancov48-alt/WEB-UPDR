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
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  };

  const onMouseLeave = () => {
    const el = trackRef.current;
    isDownRef.current = false;
    if (el) el.style.cursor = "grab";
  };

  const onMouseUp = () => {
    const el = trackRef.current;
    isDownRef.current = false;
    if (el) el.style.cursor = "grab";
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!isDownRef.current || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.15;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab select-none"
        style={{ scrollbarWidth: "none" }}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-3 min-w-[86%] md:min-w-[58%] xl:min-w-[42%] snap-start hover:border-brand-yellow/50 transition-colors"
          >
            <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
              <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-black/60 border border-white/30 text-white text-xs tracking-widest">VER VIDEO</span>
              </div>
            </div>
            <p className="mt-4 text-white/90 text-sm md:text-base">{video.title}</p>
          </a>
        ))}
      </div>
      <p className="text-white/50 text-xs mt-2">Arrastrá con el mouse o deslizá para ver más videos →</p>
    </div>
  );
}
