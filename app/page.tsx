import Image from "next/image";
import Link from "next/link";
import LandingHeader from "../components/LandingHeader";
import HeroCover from "../components/HeroCover";
import VideoCarousel from "../components/VideoCarousel";
import { getSessionUser } from "@/lib/session";
import WatchTimer from "../components/album/WatchTimer";
import LivePlayer from "../components/LivePlayer";
import ProdeReminder from "../components/prode/ProdeReminder";
import FlyersTopBanner from "../components/FlyersTopBanner";
import UpcomingShowModal from "../components/UpcomingShowModal";
import { MapPin, Calendar, Ticket, ExternalLink, Sparkles } from "lucide-react";

// =========================================================================
// FLAGS DE CONTROL: Cambiar a 'true' para activar los flyers y el popup cuando estén listos para lanzarse
// =========================================================================
const SHOW_FLYERS_BANNER = true;
const SHOW_UPCOMING_MODAL = true;

type YoutubeVideo = {
  id: string;
  title: string;
  published?: string;
};

const YOUTUBE_CHANNEL_ID = "UCg6kTB4vw1XYFBR4TtHaBuQ";
const YOUTUBE_HANDLE_URL = "https://www.youtube.com/@Updr";

const upcomingDates = [
  {
    city: "Rosario",
    countryBadge: "🇦🇷 SANTA FE",
    venue: "Metropolitano Rosario",
    date: "31 OCT 2026",
    provider: "Turbo Entrada",
    infoNote: "Entradas en Turbo Entrada",
    soldOut: false,
    ticketUrl: "https://www.turboentrada.com/landing/un-poco-de-ruido?idEspectaculoCartel=17259&cHashValidacion=705fa88aa2bea8d5c9a2b4e9018ab8c5b0e7329c",
    flyerImage: "/flyers/rosario.png",
    accentColor: "from-amber-500/20 via-orange-500/5 to-transparent",
    borderColor: "border-amber-500/40 hover:border-amber-400",
  },
  {
    city: "Montevideo",
    countryBadge: "🇺🇾 URUGUAY",
    venue: "Rural del Prado",
    date: "07 NOV 2026",
    provider: "RedTickets",
    infoNote: "Entradas en RedTickets",
    soldOut: false,
    ticketUrl: "https://redtickets.uy/evento/UN-POCO-DE-RUIDO--PRADO/31887/",
    flyerImage: "/flyers/montevideo.png",
    accentColor: "from-cyan-500/20 via-blue-500/5 to-transparent",
    borderColor: "border-cyan-500/40 hover:border-cyan-400",
  },
  {
    city: "La Plata",
    countryBadge: "🇦🇷 LA PLATA",
    venue: "Hipódromo de La Plata",
    date: "28 NOV 2026",
    provider: "Livepass",
    infoNote: "4 cuotas sin interés Banco Provincia",
    soldOut: false,
    ticketUrl: "https://livepass.com.ar/events/un-poco-de-ruido-en-el-hipodromo-de-la-plata",
    flyerImage: "/flyers/laplata.png",
    accentColor: "from-emerald-500/20 via-teal-500/5 to-transparent",
    borderColor: "border-emerald-500/40 hover:border-emerald-400",
  },
  {
    city: "Buenos Aires",
    countryBadge: "🇦🇷 CABA",
    venue: "Estadio José Amalfitani (Vélez)",
    date: "26 SEP 2026",
    provider: "AllAccess",
    infoNote: "Preventa & Venta General",
    soldOut: false,
    ticketUrl: "https://www.allaccess.com.ar/event/un-poco-de-ruido",
    flyerImage: null,
    accentColor: "from-purple-500/20 via-indigo-500/5 to-transparent",
    borderColor: "border-purple-500/40 hover:border-purple-400",
  },
];

const merchItems = [
  {
    name: "La Tumbita del AMOR",
    image: "https://acdn-us.mitiendanube.com/stores/004/847/466/products/tumbita-x2-ddle-dfa379be342be84d1717696981310856-640-0.webp",
    url: "https://unpocoderuido2.mitiendanube.com/productos/la-tumbita-del-amor-5id9o/",
  },
  {
    name: "Las Jarras de AMOR",
    image: "https://acdn-us.mitiendanube.com/stores/004/847/466/products/jarra-x2-ddle-2cef4a68a49eb5352317696965924611-640-0.webp",
    url: "https://unpocoderuido2.mitiendanube.com/productos/las-jarras-de-amor-s13kg/",
  },
  {
    name: "La NEGRA de UPDR",
    image: "https://acdn-us.mitiendanube.com/stores/004/847/466/products/remera-negra-frente-dfc224c5c6e84b6e8417187241124570-640-0.webp",
    url: "https://unpocoderuido2.mitiendanube.com/productos/la-negra-de-updr/",
  },
  {
    name: "La BLANCA de UPDR",
    image: "https://acdn-us.mitiendanube.com/stores/004/847/466/products/remera-blanca-frente-0e4caa82175cf1640c17187296751461-640-0.webp",
    url: "https://unpocoderuido2.mitiendanube.com/productos/la-blanca-de-updr/",
  },
  {
    name: "Piluso Piola",
    image: "https://acdn-us.mitiendanube.com/stores/004/847/466/products/img_4866-1-c3f21e32cd649bd96b17408621587826-640-0.webp",
    url: "https://unpocoderuido2.mitiendanube.com/productos/piluso-piola/",
  },
  {
    name: "Tienda completa",
    image: "/logo.png",
    url: "https://unpocoderuido2.mitiendanube.com/",
  },
];


function isOfficialProgramSlot(): boolean {
  try {
    const tzString = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
    const nowInArg = new Date(tzString + " UTC");
    const day = nowInArg.getUTCDay(); // 0 = Domingo, 1 = Lunes, etc.
    const hour = nowInArg.getUTCHours();
    const minutes = nowInArg.getUTCMinutes();
    const totalMinutes = hour * 60 + minutes;

    // Lunes: 17:00 - 23:59 (1020 a 1440 mins)
    if (day === 1) {
      return totalMinutes >= 17 * 60 && totalMinutes < 24 * 60;
    }
    // Martes: 17:00 - 22:00 (1020 a 1320 mins)
    if (day === 2) {
      return totalMinutes >= 17 * 60 && totalMinutes < 22 * 60;
    }
    // Miércoles: 20:00 - 23:59 (1200 a 1440 mins)
    if (day === 3) {
      return totalMinutes >= 20 * 60 && totalMinutes < 24 * 60;
    }
    // Jueves: 00:00 - 03:00 (continuation of Wednesday) OR 17:00 - 22:00
    if (day === 4) {
      if (totalMinutes < 3 * 60) return true; // Wednesday late continuation
      return totalMinutes >= 17 * 60 && totalMinutes < 22 * 60;
    }
  } catch (e) {
    console.error("Error calculating official slot:", e);
  }
  return false;
}

async function getLiveState() {
  try {
    if (process.env.LIVE_VIDEO_OVERRIDE) {
      return { isLive: true, liveVideoId: process.env.LIVE_VIDEO_OVERRIDE };
    }

    const html = await fetch(`${YOUTUBE_HANDLE_URL}/live`, { 
      cache: "no-store",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'es-419,es;q=0.9'
      }
    }).then((r) => r.text());
    
    let liveVideoId: string | null = null;
    const liveNowIdx = html.indexOf('"isLiveNow":true');
    if (liveNowIdx !== -1) {
      const start = Math.max(0, liveNowIdx - 5000);
      const end = Math.min(html.length, liveNowIdx + 5000);
      const chunk = html.substring(start, end);
      const videoIdMatch = chunk.match(/"(videoId|externalVideoId)":"([\w-]{11})"/);
      if (videoIdMatch) {
        liveVideoId = videoIdMatch[2];
      }
    }

    if (liveVideoId) {
      return { isLive: true, liveVideoId };
    }

    const isProgramTime = isOfficialProgramSlot();
    
    const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`, { 
      cache: "no-store" 
    }).then((r) => r.text());

    const firstEntry = xml.match(/<entry>[\s\S]*?<\/entry>/);
    if (firstEntry && isProgramTime) {
      const entryText = firstEntry[0];
      const fallbackVideoId = entryText.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const publishedStr = entryText.match(/<published>([^<]+)<\/published>/)?.[1];

      if (fallbackVideoId && publishedStr) {
        const publishedDate = new Date(publishedStr);
        const now = new Date();
        
        const diffMs = now.getTime() - publishedDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        const titleMatch = entryText.match(/<title>([^<]+)<\/title>/);
        const titleLower = (titleMatch ? titleMatch[1] : "").toLowerCase();
        const isLiveTitle = titleLower.includes("vivo") || titleLower.includes("live") || titleLower.includes("bandurria") || titleLower.includes("ruido");

        if (diffDays <= 10 && isLiveTitle) {
          return { isLive: true, liveVideoId: fallbackVideoId };
        }
      }
    }

    return { isLive: false, liveVideoId: null as string | null };
  } catch {
    const isProgramTime = isOfficialProgramSlot();
    return { isLive: isProgramTime && !!process.env.LIVE_VIDEO_OVERRIDE, liveVideoId: process.env.LIVE_VIDEO_OVERRIDE || null };
  }
}

async function getLatestVideos(excludeVideoId?: string | null): Promise<YoutubeVideo[]> {
  try {
    const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`, {
      next: { revalidate: 300 },
    }).then((r) => r.text());

    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

    return entries
      .slice(0, 15)
      .map((entry) => {
        const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
        const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "Video";
        const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
        return { id, title, published };
      })
      .filter((video) => video.id && video.id !== excludeVideoId)
      .slice(0, 10);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [{ isLive, liveVideoId }, sessionUser] = await Promise.all([getLiveState(), getSessionUser()]);
  const latestVideos = await getLatestVideos(liveVideoId);

  return (
    <div className="bg-[#050b1a]">
      <WatchTimer userId={sessionUser?.id} />
      <ProdeReminder />
      
      {/* Modal Emergente de Shows */}
      {SHOW_UPCOMING_MODAL && <UpcomingShowModal />}
      
      <LandingHeader user={sessionUser ? { nombre: sessionUser.nombre, apellido: sessionUser.apellido } : null} />
      
      {/* Foto principal de los 3 chicos con el logo */}
      <HeroCover />

      {/* Placa de los 3 flyers al scrollear para abajo */}
      {SHOW_FLYERS_BANNER && <FlyersTopBanner />}

      <section className="section-shell pb-12 md:pb-16">
        <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest text-brand-yellow">CUPOS PRESENCIALES</p>
            {sessionUser ? (
              <>
                <p className="text-white text-lg mt-1">Hola {sessionUser.nombre || "UPDR"}, ya tenés sesión iniciada.</p>
                <p className="text-white/70 text-sm mt-1">Cuando habilitemos inscripciones, vas a poder postularte desde tu cuenta.</p>
              </>
            ) : (
              <>
                <p className="text-white text-lg mt-1">¿Querés venir al programa en vivo?</p>
                <p className="text-white/70 text-sm mt-1">La web se puede ver sin login, pero te conviene crear cuenta para futuras inscripciones.</p>
              </>
            )}
          </div>
          <Link href={sessionUser ? "/perfil" : "/login"} className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-xs font-bold tracking-widest text-black hover:bg-white transition-colors">
            {sessionUser ? "VER MI PERFIL" : "INICIAR / REGISTRARME"}
          </Link>
        </div>
      </section>

      <section className="section-shell pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PRODE Card */}
          <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-brand-yellow/30 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-[60px] -z-0 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs tracking-widest text-brand-yellow">⚽ PRODE</p>
              <p className="text-white text-lg mt-1 font-semibold">Copa de la Liga</p>
              <p className="text-white/70 text-sm mt-1">Armá tu pronóstico y competí.</p>
            </div>
            <Link href="/prode" className="relative z-10 inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-black hover:bg-white transition-colors shadow-lg shrink-0">
              JUGAR
            </Link>
          </div>

          {/* ALBUM Card */}
          <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-brand-orange/30 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-[60px] -z-0 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs tracking-widest text-brand-orange">✨ NUEVO</p>
              <p className="text-white text-lg mt-1 font-semibold">Álbum de Figuritas</p>
              <p className="text-white/70 text-sm mt-1">Coleccioná a tus artistas favoritos.</p>
            </div>
            <Link href="/album" className="relative z-10 inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-white hover:opacity-80 transition-opacity shadow-lg shrink-0">
              MI ÁLBUM
            </Link>
          </div>

          {/* EMERGENTES Card */}
          <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-brand-yellow/30 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-[60px] -z-0 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs tracking-widest text-brand-yellow">🎵 COMUNIDAD</p>
              <p className="text-white text-lg mt-1 font-semibold">Artistas Emergentes</p>
              <p className="text-white/70 text-sm mt-1">Descubrí las bandas y músicos del mapa.</p>
            </div>
            <Link href="/artistas" className="relative z-10 inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-black hover:bg-white transition-colors shadow-lg shrink-0">
              VER MAPA
            </Link>
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
            <a href={YOUTUBE_HANDLE_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full border border-white/25 text-white/90 text-xs tracking-widest hover:bg-white/10 transition-colors">IR AL CANAL</a>
          </div>
          <LivePlayer 
            isLive={isLive} 
            liveVideoId={liveVideoId} 
            youtubeChannelId={YOUTUBE_CHANNEL_ID} 
          />
        </div>
      </section>

      {/* SECCIÓN DE FECHAS REDISEÑADA Y PREMIUM */}
      <section id="fechas" className="section-shell pb-16 md:pb-24 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> GIRA 2026
            </span>
            <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl">PRÓXIMAS FECHAS</h2>
          </div>
          <p className="text-xs md:text-sm text-white/60 font-mono">
            Conseguí tus entradas oficiales antes de que se agoten.
          </p>
        </div>

        <div className="space-y-5">
          {upcomingDates.map((item) => (
            <div
              key={`${item.city}-${item.date}`}
              className={`bg-[#0c1427]/90 backdrop-blur-md border ${item.borderColor} rounded-3xl p-5 md:p-6 transition-all duration-300 hover:scale-[1.01] shadow-2xl relative overflow-hidden group`}
            >
              {/* Resplandor ambiental de color de cada show */}
              <div className={`absolute top-0 right-0 w-80 h-full bg-gradient-to-l ${item.accentColor} pointer-events-none opacity-60`}></div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* 1. Columna Izquierda: Thumbnail del Flyer / Estadio + Ciudad + Lugar */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  {item.flyerImage ? (
                    <div className="relative w-16 h-20 md:w-20 md:h-24 rounded-2xl overflow-hidden border border-white/20 shrink-0 shadow-xl group-hover:scale-105 transition-transform">
                      <Image src={item.flyerImage} alt={item.city} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-20 md:w-20 md:h-24 rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 border border-white/20 shrink-0 flex items-center justify-center shadow-xl">
                      <span className="text-3xl">🏟️</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] md:text-[11px] font-black tracking-wider uppercase bg-white/10 text-white px-2.5 py-0.5 rounded-full border border-white/15">
                        {item.countryBadge}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black font-yellow text-white tracking-wide">
                      {item.city}
                    </h3>
                    <p className="text-xs md:text-sm text-white/75 font-mono font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                      {item.venue}
                    </p>
                  </div>
                </div>

                {/* 2. Columna Central: Fecha Destacada + Badge de Venta */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-center justify-center gap-2 font-mono">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-inner">
                    <Calendar className="w-4 h-4 text-brand-yellow shrink-0" />
                    <span className="text-brand-yellow text-base md:text-lg font-black tracking-wider">
                      {item.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" /> {item.provider}
                    </span>
                    {item.infoNote && (
                      <span className="text-white/60 text-[11px] italic">
                        • {item.infoNote}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Columna Derecha: Botón de Compra Destacado */}
                <div className="flex items-center justify-end shrink-0 pt-2 lg:pt-0">
                  {item.soldOut ? (
                    <span className="px-6 py-3.5 rounded-2xl bg-red-500/20 border border-red-400/50 text-red-300 font-bold text-xs tracking-widest shadow-md">
                      SOLD OUT
                    </span>
                  ) : (
                    <a
                      href={item.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-brand-yellow hover:bg-white text-black font-black text-xs md:text-sm px-7 py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 group-hover:scale-105 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4" />
                      COMPRAR ENTRADA
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="merch" className="section-shell scroll-mt-24 pb-16 md:pb-24">
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

      <section id="videos" className="section-shell pb-20 md:pb-28">
        <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl mb-8">ÚLTIMOS VIDEOS</h2>
        {latestVideos.length === 0 ? <div className="glass-card p-8 text-center text-white/70">No pudimos cargar los últimos videos ahora. Probá en unos minutos.</div> : <VideoCarousel videos={latestVideos} />}
      </section>
    </div>
  );
}
