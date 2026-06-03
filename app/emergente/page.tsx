import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { ArtistRegistrationForm } from "@/components/artist-registration-form";
import Link from "next/link";

export default async function EmergentePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-[#050b1a] px-6 py-24 text-white">
      <Link href="/" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="font-yellow text-5xl md:text-6xl text-brand-yellow">Postulate</h1>
          <p className="text-white/70 text-lg max-w-xl">
            Completá este formulario para que podamos conocer tu trabajo. 
            Buscamos artistas con ganas de romperla en Un Poco de Ruido.
          </p>
        </div>
        
        <ArtistRegistrationForm userId={user.id} />
      </div>
    </main>
  );
}
