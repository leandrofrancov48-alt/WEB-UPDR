"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      nombre: String(form.get("nombre") ?? ""),
      apellido: String(form.get("apellido") ?? ""),
      celular: String(form.get("celular") ?? ""),
      dni: String(form.get("dni") ?? ""),
    };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al iniciar sesión");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050b1a] text-white px-6 py-16">
      <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl rounded-2xl border border-white/20 bg-white/5 p-6 space-y-4">
        <h1 className="text-2xl">Iniciar sesión</h1>
        <p className="text-sm text-white/70">Completá tus datos para entrar al sitio.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <input required name="nombre" placeholder="Nombre" className="rounded-xl bg-white/10 border border-white/20 px-3 py-2" />
          <input required name="apellido" placeholder="Apellido" className="rounded-xl bg-white/10 border border-white/20 px-3 py-2" />
        </div>

        <input required type="email" name="email" placeholder="Email" className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2" />

        <div className="grid gap-4 md:grid-cols-2">
          <input required name="celular" placeholder="Celular" className="rounded-xl bg-white/10 border border-white/20 px-3 py-2" />
          <input required name="dni" placeholder="DNI" className="rounded-xl bg-white/10 border border-white/20 px-3 py-2" />
        </div>

        {error ? <p className="text-red-300 text-sm">{error}</p> : null}

        <button disabled={loading} className="w-full rounded-xl bg-brand-yellow text-black font-semibold px-4 py-2">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
