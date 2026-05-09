import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { PerfilForm } from "./perfil-form";

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-[#050b1a] px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-yellow text-5xl text-brand-yellow">Mi perfil</h1>
        <p className="text-white/70">Revisá y corregí tus datos.</p>
        <PerfilForm />

        {/* 
        <div className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow/5 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-brand-yellow">¿Sos artista?</h2>
          <p className="text-sm text-white/70">
            Postulate como artista emergente para ser parte de Un Poco de Ruido. 
            Podrás subir tu material y dejarnos tus datos para que te contactemos.
          </p>
          <a 
            href="/emergente" 
            className="inline-block rounded-xl bg-brand-yellow px-6 py-3 text-black font-bold hover:scale-105 transition-transform"
          >
            Postularme ahora
          </a>
        </div>
        */}
      </div>
    </main>
  );
}
