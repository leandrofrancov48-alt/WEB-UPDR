import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Camera, Video, Music, User, MapPin, Phone, Mail, Mic2, Settings, FileVideo } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import Link from "next/link";
import { MediaGrid } from "@/components/media-grid";

export default async function MusicianProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, sessionUser] = await Promise.all([params, getSessionUser()]);
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user || !user.isMusician) notFound();
  const isOwner = sessionUser?.id === user.id;

  return (
    <main className="min-h-screen bg-[#050b1a] text-white">
      <Link href="/artistas" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>
      <div className="relative h-48 w-full bg-gradient-to-r from-brand-orange/20 to-brand-blue/20" />

      <div className="section-shell -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-brand-orange shadow-2xl -mt-20 bg-[#050b1a]">
                {user.profilePic ? (
                  <Image src={user.profilePic} alt={user.nombre} width={160} height={160} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-orange">
                    <User size={60} />
                  </div>
                )}
              </div>
              <h1 className="font-yellow text-4xl mt-6 text-brand-orange uppercase tracking-tighter">
                {user.showPersonalData ? `${user.nombre} ${user.apellido}` : user.username}
              </h1>
              {isOwner && (
                <Link 
                  href="/perfil"
                  className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-brand-orange text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-orange transition-colors"
                >
                  <Settings size={12} />
                  Editar Mi Perfil
                </Link>
              )}
              <div className="flex items-center gap-2 text-white/60 font-medium uppercase tracking-widest text-xs mt-1">
                <Mic2 size={12} className="text-brand-orange" />
                <span>{user.instrument || "Músico"}</span>
              </div>
            </div>

            {/* Privacy-controlled contact info */}
            {(user.showContactPhone || user.showPersonalData) && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Contacto</h3>
                <div className="space-y-3">
                  {user.showContactPhone && user.celular && (
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      <Phone size={16} className="text-brand-orange" />
                      <span>{user.celular}</span>
                    </div>
                  )}
                  {user.showPersonalData && (
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      <Mail size={16} className="text-brand-orange" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main */}
          <div className="w-full md:w-2/3 space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-brand-orange/80">Sobre mí</h2>
              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                {user.bio || "Este músico aún no ha cargado su biografía."}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wider text-brand-orange/80 flex items-center gap-2">
                <FileVideo className="w-5 h-5" />
                Material Destacado
              </h2>
              <MediaGrid urls={user.mediaUrls} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
