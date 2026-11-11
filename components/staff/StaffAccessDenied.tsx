import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function StaffAccessDenied({ email }: { email?: string }) {
  return (
    <main className="min-h-screen bg-[#050b1a] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Luces de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center relative z-10 shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Módulo Privado Restringido</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Acceso Exclusivo de Staff
        </h1>

        <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
          Este panel de jornadas extras y liquidaciones es de uso confidencial. Únicamente los integrantes autorizados por la producción tienen acceso a esta sección.
        </p>

        {email && (
          <div className="bg-black/30 border border-white/10 rounded-xl p-3 mb-6 text-xs text-neutral-400">
            Conectado como: <span className="text-white font-medium">{email}</span>
            <div className="text-[11px] text-neutral-500 mt-1">
              (Si formas parte del equipo, solicita al responsable de pagos que agregue tu email a la lista de staff)
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
