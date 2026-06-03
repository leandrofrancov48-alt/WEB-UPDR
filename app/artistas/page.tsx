import { prisma } from "@/lib/db";
import LandingHeader from "@/components/LandingHeader";
import { getSessionUser } from "@/lib/session";
import { ArtistasGallery } from "@/components/artistas-gallery";
import Link from "next/link";

export default async function ArtistasPage() {
  const sessionUser = await getSessionUser();

  const [bands, musicians] = await Promise.all([
    prisma.band.findMany({
      include: {
        _count: {
          select: { 
            members: true,
            likes: true 
          }
        },
        likes: sessionUser ? {
          where: { userId: sessionUser.id },
          select: { id: true }
        } : false,
      },
      orderBy: [
        { likes: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
    }),
    prisma.user.findMany({
      where: { isMusician: true },
      select: {
        id: true,
        username: true,
        nombre: true,
        apellido: true,
        instrument: true,
        profilePic: true,
        bio: true,
        latitude: true,
        longitude: true,
        _count: {
          select: { likesReceived: true }
        },
        likesReceived: sessionUser ? {
          where: { userId: sessionUser.id },
          select: { id: true }
        } : false,
      },
      orderBy: [
        { likesReceived: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
    }),
  ]);

  const processedBands = bands.map(b => ({
    ...b,
    hasLiked: b.likes?.length > 0,
    likeCount: b._count.likes
  }));

  const processedMusicians = musicians.map(m => ({
    ...m,
    hasLiked: (m as any).likesReceived?.length > 0,
    likeCount: m._count.likesReceived
  }));

  return (
    <div className="min-h-screen bg-[#050b1a] text-white">
      <Link href="/" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>
      <LandingHeader user={sessionUser ? { nombre: sessionUser.nombre, apellido: sessionUser.apellido } : null} />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-yellow text-5xl md:text-7xl text-brand-yellow uppercase tracking-tighter">Artistas Emergentes</h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
              Explorá las bandas y músicos que forman parte de la comunidad de 1PDR. 
              Buscá por instrumento, género o nombre.
            </p>
          </div>

          <ArtistasGallery bands={processedBands} musicians={processedMusicians} />
        </div>
      </main>
    </div>
  );
}

