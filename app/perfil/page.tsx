import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { isUserStaff } from "@/lib/staff-auth";
import { PerfilForm } from "./perfil-form";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const isStaff = await isUserStaff(user);

  return (
    <main className="min-h-screen bg-[#050b1a] px-6 py-24 text-white">
      <Link href="/" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-yellow text-5xl text-brand-yellow">Mi perfil</h1>
        <p className="text-white/70">Revisá y corregí tus datos.</p>

        {isStaff && (
          <div className="bg-gradient-to-r from-brand-yellow/15 to-amber-500/10 border border-brand-yellow/40 rounded-2xl p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-brand-yellow/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Módulo de Staff Activo</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-yellow text-black text-[10px] font-black uppercase">Staff</span>
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Tenés acceso habilitado para registrar y consultar tus jornadas extras.
                </p>
              </div>
            </div>
            <Link
              href="/staff"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow text-black font-bold text-xs hover:bg-yellow-400 transition-colors shrink-0"
            >
              <span>Ir a Panel de Jornadas</span>
              <span>→</span>
            </Link>
          </div>
        )}

        <PerfilForm />
      </div>
    </main>
  );
}
