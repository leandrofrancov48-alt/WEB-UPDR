import Image from "next/image";
import Link from "next/link";

const upcomingDates = [
  {
    city: "Buenos Aires",
    venue: "Estadio José Amalfitani (Vélez)",
    date: "26 SEP 2026",
    status: "PREVENTA HOY 16:00 · GENERAL VIERNES",
    soldOut: false,
    ticketUrl: "https://www.allaccess.com.ar/event/un-poco-de-ruido",
  },
];

const merchItems = [
  {
    name: "La Tumbita del AMOR",
    image: "/logo.png",
    url: "https://unpocoderuido2.mitiendanube.com/productos/la-tumbita-del-amor-5id9o/",
  },
  {
    name: "Las Jarras de AMOR",
    image: "/logo.png",
    url: "https://unpocoderuido2.mitiendanube.com/productos/las-jarras-de-amor-s13kg/",
  },
  {
    name: "La NEGRA de UPDR",
    image: "/logo.png",
    url: "https://unpocoderuido2.mitiendanube.com/productos/la-negra-de-updr/",
  },
  {
    name: "La BLANCA de UPDR",
    image: "/logo.png",
    url: "https://unpocoderuido2.mitiendanube.com/productos/la-blanca-de-updr/",
  },
  {
    name: "Piluso Piola",
    image: "/logo.png",
    url: "https://unpocoderuido2.mitiendanube.com/productos/piluso-piola/",
  },
  {
    name: "Tienda completa",
    image: "/logo.png",
    url: "https://unpocoderuido2.mitiendanube.com/",
  },
];

const youtubeVideos = ["sxeHgJxt6Gg", "udkhJz5nvAM", "TLufJODPElo"];
const YOUTUBE_CHANNEL_ID = "UCg6kTB4vw1XYFBR4TtHaBuQ";

async function getLiveVideoId() {
  try {
    const html = await fetch("https://www.youtube.com/@Updr/live", {
      next: { revalidate: 60 },
    }).then((r) => r.text());

    const canonical = html.match(/<link rel=\"canonical\" href=\"([^\"]+)/)?.[1];
    const watchId = canonical?.match(/[?&]v=([\w-]{11})/)?.[1];

    return watchId ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const liveVideoId = await getLiveVideoId();

  return (
    <div className="bg-[#070709]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070709]/90 backdrop-blur-md">
        <div className="section-shell h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="UPDR" width={36} height={36} />
            <span className="text-sm tracking-[0.2em] font-semibold text-white/80">UN POCO DE RUIDO</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#en-vivo" className="hover:text-brand-yellow transition-colors">En vivo</a>
            <a href="#fechas" className="hover:text-brand-yellow transition-colors">Fechas</a>
            <a href="#merch" className="hover:text-brand-yellow transition-colors">Merch</a>
            <a href="#bio" className="hover:text-brand-yellow transition-colors">Bio</a>
            <a href="#videos" className="hover:text-brand-yellow transition-colors">Videos</a>
            <Link href="/galeria" className="hover:text-brand-yellow transition-colors">Galería</Link>
          </nav>
        </div>
      </header>

      <section className="relative min-h-screen w-full overflow-hidden">
        <Image src="/hero-updr.png" alt="Un Poco De Ruido" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

        <div className="section-shell relative z-10 min-h-screen flex items-end pb-14 md:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] text-brand-yellow mb-4">PROGRAMA OFICIAL</p>
            <h1 className="font-yellow text-brand-yellow text-5xl md:text-7xl leading-[0.9]">UN POCO DE RUIDO</h1>
            <p className="text-white/80 max-w-xl mt-5 text-sm md:text-base">
              Streaming argentino, música en vivo y cultura popular. Una comunidad que crece en cada transmisión y explota en cada show.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#en-vivo" className="px-6 py-3 rounded-full bg-brand-yellow text-black font-bold text-sm hover:bg-white transition-colors">Ver en vivo</a>
              <Link href="/galeria" className="px-6 py-3 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors">Ver galería</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="en-vivo" className="section-shell pb-16 md:pb-24">
        <div className="glass-card p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl">EN VIVO</h2>
              <p className="text-white/70 mt-2">Cuando el programa esté al aire, se ve directo desde acá.</p>
            </div>
            <a href="https://www.youtube.com/@Updr" target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full border border-white/25 text-white/90 text-xs tracking-widest hover:bg-white/10 transition-colors">IR AL CANAL</a>
          </div>
          {liveVideoId ? (
            <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${liveVideoId}`}
                title="UPDR En Vivo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center">
              <p className="font-yellow text-brand-yellow text-3xl md:text-4xl">No estamos en vivo ahora</p>
              <p className="text-white/70 mt-3">Activá la campanita en YouTube y volvés acá cuando arranque el programa.</p>
              <a
                href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-3 rounded-full bg-brand-yellow text-black font-bold text-sm hover:bg-white transition-colors"
              >
                IR AL CANAL DE YOUTUBE
              </a>
            </div>
          )}
        </div>
      </section>

      <section id="fechas" className="section-shell pb-16 md:pb-24">
        <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl mb-8">PRÓXIMAS FECHAS</h2>
        <div className="space-y-4">
          {upcomingDates.map((item) => (
            <div key={`${item.city}-${item.date}`} className="glass-card p-5 md:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-white text-xl md:text-2xl font-semibold">{item.city}</p>
                <p className="text-white/60 text-sm">{item.venue}</p>
              </div>
              <div>
                <p className="text-brand-yellow tracking-widest text-sm">{item.date}</p>
                <p className="text-white/60 text-xs mt-1">{item.status}</p>
              </div>
              {item.soldOut ? (
                <span className="px-4 py-2 rounded-full bg-red-500/20 border border-red-400/50 text-red-300 text-xs tracking-widest">SOLD OUT</span>
              ) : (
                <a href={item.ticketUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-brand-yellow text-black text-xs font-bold tracking-widest hover:bg-white transition-colors">COMPRAR ENTRADA</a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="merch" className="section-shell pb-16 md:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl">MERCH OFICIAL</h2>
          <a href="https://unpocoderuido2.mitiendanube.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-brand-yellow transition-colors">Ver tienda completa →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {merchItems.map((item) => (
            <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="glass-card p-4 hover:border-brand-yellow/60 transition-colors group">
              <div className="relative w-full aspect-square rounded-xl border border-white/10 overflow-hidden bg-black/30">
                <Image src={item.image} alt={item.name} fill className="object-contain p-8 opacity-80 group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="mt-4 text-white/90 text-sm tracking-wider">{item.name}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="bio" className="section-shell pb-16 md:pb-24">
        <div className="glass-card p-6 md:p-10">
          <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl mb-6">¿QUÉ ES UPDR?</h2>
          <p className="text-white/80 leading-relaxed max-w-4xl">
            Un Poco de Ruido (UPDR) es un programa de streaming argentino que combina música, entrevistas, humor y cultura de barrio en formato digital.
            Nació desde la conexión con su comunidad y fue construyendo una identidad propia: lenguaje callejero, invitados potentes, momentos virales
            y una forma de hacer contenido que cruza pantalla, redes y shows en vivo.
          </p>
        </div>
      </section>

      <section id="videos" className="section-shell pb-20 md:pb-28">
        <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl mb-8">ÚLTIMOS VIDEOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {youtubeVideos.map((videoId) => (
            <div key={videoId} className="glass-card p-3">
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`Video ${videoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
