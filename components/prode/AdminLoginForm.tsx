"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "@/lib/actions/adminAuth";

export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await loginAdmin(username, password);
        window.location.reload();
      } catch (err: any) {
        setError(err.message || "Error de autenticación");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#050b1a] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 max-w-sm w-full shadow-2xl backdrop-blur-sm">
        <h1 className="text-3xl text-brand-yellow font-yellow uppercase mb-2 text-center">Admin</h1>
        <p className="text-white/50 text-sm text-center mb-8">Acceso restringido</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-yellow transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-yellow transition-colors"
          />
          {error && <p className="text-red-400 text-sm font-semibold bg-red-400/10 p-3 rounded-lg text-center">{error}</p>}
          <button
            disabled={isPending}
            className="w-full bg-brand-yellow text-black font-yellow py-4 rounded-xl hover:bg-yellow-400 disabled:opacity-50 text-xl transition-colors cursor-pointer"
          >
            {isPending ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
