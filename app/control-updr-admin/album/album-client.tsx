"use client";

import { useState, useTransition } from "react";
import { giftStickerPacks } from "@/lib/actions/admin";
import { ArrowLeft, Gift, Users, Inbox, Sparkles, BookOpen, UserCheck, AlertCircle } from "lucide-react";

interface Collector {
  id: string;
  name: string;
  username: string;
  uniqueCount: number;
  totalCount: number;
}

interface AlbumStats {
  totalUsers: number;
  totalOpenedPacks: number;
  totalStickersInExistence: number;
  topCollectors: Collector[];
}

export default function AlbumAdminClient({ initialStats }: { initialStats: AlbumStats }) {
  const [stats, setStats] = useState<AlbumStats>(initialStats);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [amount, setAmount] = useState(3);
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleGiftPacks = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    startTransition(async () => {
      try {
        const res = await giftStickerPacks(emailOrUsername, amount);
        if (res.success) {
          setSuccessMsg(`¡Acreditado con éxito! Se regalaron ${amount} sobre(s) a ${res.targetUser}.`);
          setEmailOrUsername("");
          
          // Increment locally in total count just as feedback
          setStats(prev => ({
            ...prev,
            totalOpenedPacks: prev.totalOpenedPacks // (not opened yet, just in balance)
          }));
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Error al regalar los sobres. Verificá los datos.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#050b1a] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Luces de fondo decorativas */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <a 
              href="/control-updr-admin" 
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-brand-yellow transition-colors font-bold uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al panel
            </a>
          </div>
          <h1 className="text-3xl md:text-4xl font-yellow text-brand-yellow flex items-center gap-3 tracking-wider uppercase">
            <BookOpen className="w-8 h-8 text-brand-yellow" /> Gestión del Álbum
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Supervisá estadísticas globales de figuritas y regalá sobres a la comunidad en vivo.</p>
        </div>
        <span className="text-[10px] tracking-widest text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1.5 rounded-full font-black uppercase">
          Acceso Administrador
        </span>
      </header>

      <section className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Metricas Consolidadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-brand-yellow/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-yellow/10 text-brand-yellow rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-white/40 font-bold uppercase tracking-wider block">Usuarios Coleccionistas</span>
                <span className="text-3xl font-black font-yellow text-white mt-1 block">{stats.totalUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-brand-yellow/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-yellow/10 text-brand-yellow rounded-2xl">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-white/40 font-bold uppercase tracking-wider block">Sobres Abiertos</span>
                <span className="text-3xl font-black font-yellow text-white mt-1 block">{stats.totalOpenedPacks}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-brand-yellow/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-yellow/10 text-brand-yellow rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-white/40 font-bold uppercase tracking-wider block">Figuritas en Circulación</span>
                <span className="text-3xl font-black font-yellow text-white mt-1 block">{stats.totalStickersInExistence}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Panel Interactivo: Regalo de Sobres & Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tarjeta: Regalo de Sobres */}
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
            <h2 className="text-xl font-yellow text-brand-yellow flex items-center gap-2 uppercase tracking-wide">
              <Gift className="w-6 h-6 text-brand-yellow animate-bounce" /> Regalar Sobres en Vivo
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Ingresá el correo electrónico o el nombre de usuario del seguidor para acreditarle sobres de figuritas en tiempo real durante la transmisión en vivo.
            </p>

            <form onSubmit={handleGiftPacks} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">Usuario o Email</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej: leandro@gmail.com o @leanupdr"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">Cantidad de Sobres</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 3, 5, 10, 20].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-black transition-all ${
                        amount === amt 
                          ? "bg-brand-yellow text-black shadow-md scale-105"
                          : "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white"
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-black font-black py-4 rounded-xl transition-all disabled:opacity-50 text-xs uppercase tracking-wider font-sans mt-4 flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" /> {isPending ? "Acreditando..." : `Regalar ${amount} sobres`}
              </button>
            </form>

            {successMsg && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-3 animate-fadeIn">
                <UserCheck className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs font-bold">{successMsg}</p>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs font-bold">{errorMsg}</p>
              </div>
            )}
          </div>

          {/* Tarjeta: Coleccionistas Top */}
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
            <h2 className="text-xl font-yellow text-brand-yellow flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-6 h-6 text-brand-yellow" /> Top 5 Coleccionistas
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Los usuarios que más figuritas únicas y totales han juntado en la plataforma oficial del programa.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest font-bold">
                    <th className="py-3 px-2">Usuario</th>
                    <th className="py-3 px-2 text-center">Únicas</th>
                    <th className="py-3 px-2 text-center">Totales</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topCollectors.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-neutral-500 italic">No hay coleccionistas registrados.</td>
                    </tr>
                  ) : (
                    stats.topCollectors.map((col, index) => (
                      <tr 
                        key={col.id} 
                        className="border-b border-white/5 last:border-none hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3.5 px-2 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            index === 0 ? "bg-amber-400 text-black" :
                            index === 1 ? "bg-neutral-300 text-black" :
                            index === 2 ? "bg-amber-600 text-white" :
                            "bg-white/10 text-white/70"
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-bold text-white/90">{col.name}</p>
                            <p className="text-[10px] text-white/40 font-mono">@{col.username}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 text-center font-bold text-brand-yellow font-mono text-sm">
                          {col.uniqueCount}
                        </td>
                        <td className="py-3.5 px-2 text-center font-bold text-white/60 font-mono">
                          {col.totalCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </section>
    </main>
  );
}
