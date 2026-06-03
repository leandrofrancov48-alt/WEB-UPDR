import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Camera, Video, Music, Users, MapPin, Phone, Mail, Settings } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { MediaGrid } from "@/components/media-grid";

export default async function BandProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, getSessionUser()]);
  const band = await prisma.band.findUnique({
    where: { id },
    include: {
      owner: true,
      members: {
        include: { user: true }
      }
    }
  });

  if (!band) notFound();
  const isOwner = user?.id === band.ownerId;

  return (
    <main className="min-h-screen bg-[#050b1a] text-white">
      <Link href="/artistas" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>
      {/* Cover Pic */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        {band.coverPic ? (
          <Image src={band.coverPic} alt={band.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-blue to-brand-orange opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a] to-transparent" />
      </div>

      <div className="section-shell -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar / Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-brand-yellow shadow-2xl -mt-20 bg-[#050b1a]">
                {band.profilePic ? (
                  <Image src={band.profilePic} alt={band.name} width={160} height={160} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-yellow">
                    <Users size={60} />
                  </div>
                )}
              </div>
              <h1 className="font-yellow text-4xl mt-6 text-brand-yellow uppercase tracking-tighter">{band.name}</h1>
              {isOwner && (
                <Link 
                  href={`/banda/${band.id}/editar`}
                  className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-brand-yellow text-black px-3 py-1 rounded-full hover:bg-white transition-colors"
                >
                  <Settings size={12} />
                  Editar Perfil
                </Link>
              )}
               <p className="text-white/60 font-medium uppercase tracking-widest text-xs mt-1">{band.genre || "Cumbia"}</p>
              {band.city && (
                <div className="flex items-center gap-2 text-white/40 font-bold uppercase tracking-[0.2em] text-[9px] mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  <MapPin size={10} className="text-brand-yellow" />
                  <span>{band.city}</span>
                </div>
              )}
              
              <div className="flex gap-4 mt-6">
                {band.instagram && <a href={`https://instagram.com/${band.instagram.replace('@', '')}`} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-brand-yellow hover:text-black transition-all"><Camera size={20} /></a>}
                {band.spotify && <a href={band.spotify} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-brand-yellow hover:text-black transition-all"><Music size={20} /></a>}
                {band.youtube && <a href={band.youtube} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-brand-yellow hover:text-black transition-all"><Video size={20} /></a>}
              </div>
            </div>

            {/* Privacy-aware contact info could go here if the owner allows it */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Integrantes</h3>
              <div className="space-y-3">
                {band.members.length > 0 ? (
                  band.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                        {m.user.profilePic && <img src={m.user.profilePic} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{m.user.nombre}</p>
                        <p className="text-[10px] text-white/40 uppercase">{m.role || "Músico"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/30 italic">No hay integrantes registrados aún.</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-brand-yellow/80">Biografía</h2>
              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                {band.bio || "Esta banda aún no ha cargado su biografía."}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wider text-brand-yellow/80">Material Destacado</h2>
              <MediaGrid urls={band.mediaUrls} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
