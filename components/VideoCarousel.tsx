"use client";

import Image from "next/image";

type YoutubeVideo = {
  id: string;
  title: string;
  published?: string;
};

export default function VideoCarousel({ videos }: { videos: YoutubeVideo[] }) {
  return (
    <div className="relative">
      <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
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
