import Link from "next/link";
import PhotoGallery from "../../components/PhotoGallery";

const VIDEO_URL = "https://res.cloudinary.com/djwmxjgey/video/upload/v1764168958/VIDEO_FONDO_pcyd2i.mp4";

export default function GaleriaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover blur-sm opacity-55"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <Link href="/" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>

      <div className="section-shell pt-24 pb-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-brand-yellow mb-3">SECCIÓN</p>
          <h1 className="font-yellow text-brand-yellow text-5xl md:text-6xl leading-[0.9]">GALERÍA OFICIAL</h1>
          <p className="text-white/70 mt-4">Reviví cada fecha y descargá tus fotos en alta calidad.</p>
        </div>

        <PhotoGallery />
      </div>
    </main>
  );
}
