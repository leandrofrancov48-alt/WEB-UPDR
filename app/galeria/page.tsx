import PhotoGallery from "../../components/PhotoGallery";

export default function GaleriaPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 section-shell">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] text-brand-yellow mb-3">SECCIÓN</p>
        <h1 className="font-yellow text-brand-yellow text-5xl md:text-6xl leading-[0.9]">GALERÍA OFICIAL</h1>
        <p className="text-white/70 mt-4">Revive cada fecha y descargá tus fotos en alta calidad.</p>
      </div>

      <PhotoGallery />
    </main>
  );
}
