"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { createPrivateGroup, joinPrivateGroup } from "@/lib/actions/prode";

export function GroupModals() {
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await createPrivateGroup(groupName);
        setShowCreate(false);
        setGroupName("");
      } catch (err: any) {
        setError(err.message || "Error al crear grupo");
      }
    });
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await joinPrivateGroup(groupCode);
        setShowJoin(false);
        setGroupCode("");
      } catch (err: any) {
        setError(err.message || "Error al unirse");
      }
    });
  };

  return (
    <div className="flex gap-4 shrink-0">
      <button onClick={() => setShowCreate(true)} className="bg-white/10 hover:bg-white/20 text-white font-yellow px-6 py-3 rounded-full transition-colors border border-white/10 cursor-pointer">
        Crear Grupo
      </button>
      <button onClick={() => setShowJoin(true)} className="bg-brand-yellow hover:bg-yellow-400 text-black font-yellow px-6 py-3 rounded-full transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-pointer">
        Unirse
      </button>

      {mounted && showCreate && createPortal(
        <div className="fixed inset-0 bg-[#050b1a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 max-w-md w-full relative">
            <button onClick={() => setShowCreate(false)} className="absolute top-6 right-6 text-white/50 hover:text-white cursor-pointer text-xl">✕</button>
            <h2 className="text-3xl text-brand-yellow font-yellow mb-6 uppercase">Crear Grupo</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nombre del grupo" 
                required 
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-yellow transition-colors"
              />
              {error && <p className="text-red-400 text-sm font-semibold bg-red-400/10 p-2 rounded">{error}</p>}
              <button disabled={isPending} className="w-full bg-brand-yellow text-black font-yellow py-4 rounded-xl hover:bg-yellow-400 disabled:opacity-50 text-xl transition-colors cursor-pointer">
                {isPending ? "Creando..." : "Confirmar"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {mounted && showJoin && createPortal(
        <div className="fixed inset-0 bg-[#050b1a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 max-w-md w-full relative">
            <button onClick={() => setShowJoin(false)} className="absolute top-6 right-6 text-white/50 hover:text-white cursor-pointer text-xl">✕</button>
            <h2 className="text-3xl text-brand-yellow font-yellow mb-6 uppercase">Unirse a Grupo</h2>
            <form onSubmit={handleJoin} className="space-y-4">
              <input 
                type="text" 
                placeholder="Código de 6 letras" 
                required 
                maxLength={6}
                value={groupCode}
                onChange={e => setGroupCode(e.target.value.toUpperCase())}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-brand-yellow font-mono uppercase focus:outline-none focus:border-brand-yellow text-center text-3xl tracking-[0.5em] transition-colors"
              />
              {error && <p className="text-red-400 text-sm font-semibold bg-red-400/10 p-2 rounded">{error}</p>}
              <button disabled={isPending} className="w-full bg-brand-yellow text-black font-yellow py-4 rounded-xl hover:bg-yellow-400 disabled:opacity-50 text-xl transition-colors cursor-pointer">
                {isPending ? "Uniéndose..." : "Entrar al Grupo"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
