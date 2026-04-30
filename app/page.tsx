import Image from "next/image";
import Link from "next/link";
import LandingHeader from "../components/LandingHeader";
import HeroCover from "../components/HeroCover";
import VideoCarousel from "../components/VideoCarousel";
import { getSessionUser } from "@/lib/session";

type YoutubeVideo = {
  id: string;
  title: string;
  published?: string;
};

const YOUTUBE_CHANNEL_ID = "UCg6kTB4vw1XYFBR4TtHaBuQ";
const YOUTUBE_HANDLE_URL = "https://www.youtube.com/@Updr";
const YOUTUBE_CHANNEL_LIVE_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`;

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

async function getLatestVideos(excludeVideoId?: string | null): Promise<YoutubeVideo[]> {
  try {
    const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`, {
      next: { revalidate: 300 },
    }).then((r) => r.text());

    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

    return entries
      .slice(0, 12)
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

async function getLiveVideoId() {
  const headers = {
    "user-agent": "Mozilla/5.0 (compatible; UPDR-Web/1.0)",
    "accept-language": "es-AR,es;q=0.9,en;q=0.8",
  };

  const detectFromHtml = (html: string) => {
    const liveNowMatch = html.match(/\"videoId\":\"([\w-]{11})\"[\s\S]{0,5000}?\"isLiveNow\":true/);
    if (liveNowMatch?.[1]) return liveNowMatch[1];

    const detailsLiveMatch = html.match(/\"videoDetails\":\{\"videoId\":\"([\w-]{11})\"[\s\S]{0,2200}?\"isLive\":true/);
    if (detailsLiveMatch?.[1]) return detailsLiveMatch[1];

    return null;
  };

  try {
    const [handleResponse, channelResponse] = await Promise.all([
      fetch(`${YOUTUBE_HANDLE_URL}/live`, { cache: "no-store", redirect: "follow", headers }),
      fetch(YOUTUBE_CHANNEL_LIVE_URL, { cache: "no-store", redirect: "follow", headers }),
    ]);

    const redirectedId = handleResponse.url.match(/[?&]v=([\w-]{11})/)?.[1] ?? channelResponse.url.match(/[?&]v=([\w-]{11})/)?.[1];

    const [handleHtml, channelHtml] = await Promise.all([handleResponse.text(), channelResponse.text()]);

    const handleDetected = detectFromHtml(handleHtml);
    const channelDetected = detectFromHtml(channelHtml);

    if (handleDetected && channelDetected && handleDetected === channelDetected) return handleDetected;

    // Solo aceptar redirect directo si además aparece marcado como vivo en alguno de los HTML.
    if (redirectedId && (handleDetected === redirectedId || channelDetected === redirectedId)) return redirectedId;

    return handleDetected ?? channelDetected ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [liveVideoId, sessionUser] = await Promise.all([getLiveVideoId(), getSessionUser()]);
  const latestVideos = await getLatestVideos(liveVideoId);

  return (
    <div className="bg-[#050b1a]">
      <LandingHeader user={sessionUser ? { nombre: sessionUser.nombre, apellido: sessionUser.apellido } : null} />
      <HeroCover />

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

      <section id="en-vivo" className="section-shell pb-16 md:pb-24">
        <div className="glass-card p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl">EN VIVO</h2>
              <p className="text-white/70 mt-2">Cuando el programa esté al aire, se ve directo desde acá.</p>
            </div>
            <a href={YOUTUBE_HANDLE_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full border border-white/25 text-white/90 text-xs tracking-widest hover:bg-white/10 transition-colors">IR AL CANAL</a>
          </div>
          {liveVideoId ? (
            <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
              <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${liveVideoId}`} title="UPDR En Vivo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center">
              <p className="font-yellow text-brand-yellow text-3xl md:text-4xl">Ahora no estamos en vivo</p>
              <p className="text-white/70 mt-3">Visitá el canal para ver lo más reciente y activar recordatorios.</p>
              <a href={YOUTUBE_HANDLE_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 px-6 py-3 rounded-full bg-brand-yellow text-black font-bold text-sm hover:bg-white transition-colors">IR AL CANAL</a>
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

      <section id="bio" className="section-shell pb-16 md:pb-24">
        <div className="glass-card p-6 md:p-10">
          <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl mb-6">¿QUÉ ES UPDR?</h2>
          <p className="text-white/80 leading-relaxed max-w-4xl">Un Poco de Ruido (UPDR) es un programa de streaming argentino que combina música, entrevistas, humor y cultura de barrio en formato digital. Nació desde la conexión con su comunidad y fue construyendo una identidad propia: lenguaje callejero, invitados potentes, momentos virales y una forma de hacer contenido que cruza pantalla, redes y shows en vivo.</p>
        </div>
      </section>

      <section id="videos" className="section-shell pb-20 md:pb-28">
        <h2 className="font-yellow text-brand-yellow text-4xl md:text-5xl mb-8">ÚLTIMOS VIDEOS</h2>
        {latestVideos.length === 0 ? (
          <div className="glass-card p-8 text-center text-white/70">No pudimos cargar los últimos videos ahora. Probá en unos minutos.</div>
        ) : (
          <VideoCarousel videos={latestVideos} />
        )}
      </section>
    </div>
  );
}
