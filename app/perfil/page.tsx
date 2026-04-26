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
      </div>
    </main>
  );
}
