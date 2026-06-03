import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { PerfilForm } from "./perfil-form";
import Link from "next/link";

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-[#050b1a] px-6 py-24 text-white">
      <Link href="/" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-yellow text-5xl text-brand-yellow">Mi perfil</h1>
        <p className="text-white/70">Revisá y corregí tus datos.</p>
        <PerfilForm />


      </div>
    </main>
  );
}
