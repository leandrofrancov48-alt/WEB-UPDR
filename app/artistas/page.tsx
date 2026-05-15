import { prisma } from "@/lib/db";
import LandingHeader from "@/components/LandingHeader";
import { getSessionUser } from "@/lib/session";
import { ArtistasGallery } from "@/components/artistas-gallery";

export default async function ArtistasPage() {
  const [bands, musicians, sessionUser] = await Promise.all([
    prisma.band.findMany({
      include: {
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { isMusician: true },
      orderBy: { createdAt: "desc" },
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
      }
    }),
    getSessionUser(),
  ]);

  return (
    <div className="min-h-screen bg-[#050b1a] text-white">
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

          <ArtistasGallery bands={bands} musicians={musicians} />
        </div>
      </main>
    </div>
  );
}

