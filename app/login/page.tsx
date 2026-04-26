"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

const VIDEO_URL = "https://res.cloudinary.com/djwmxjgey/video/upload/v1764168958/VIDEO_FONDO_pcyd2i.mp4";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      mode,
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
      setError(data.error ?? "Error al continuar");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover blur-sm opacity-55">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2 items-start px-6 py-16">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1 text-xs tracking-widest text-brand-yellow">COMUNIDAD UPDR</p>
          <h1 className="font-yellow text-5xl text-brand-yellow">Sumate al vivo</h1>
          <p className="text-white/75">Podés navegar toda la web sin cuenta. Pero con sesión iniciada vas a poder anotarte a los próximos cupos para venir al programa en vivo.</p>
          <Link href="/" className="inline-block text-sm text-white/80 hover:text-brand-yellow transition-colors">← Volver al inicio</Link>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-white/20 bg-white/5 p-6 space-y-4 backdrop-blur">
          <div className="grid grid-cols-2 rounded-xl border border-white/20 bg-white/5 p-1 text-sm">
            <button type="button" onClick={() => setMode("login")} className={`rounded-lg py-2 transition ${mode === "login" ? "bg-brand-yellow text-black font-semibold" : "text-white/80"}`}>
              Iniciar sesión
            </button>
            <button type="button" onClick={() => setMode("register")} className={`rounded-lg py-2 transition ${mode === "register" ? "bg-brand-yellow text-black font-semibold" : "text-white/80"}`}>
              Registrarme
            </button>
          </div>

          <input required type="email" name="email" placeholder="Email" className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
          <input required name="dni" placeholder="DNI" className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2" />

          {mode === "register" ? (
            <div className="grid gap-3">
              <input required name="nombre" placeholder="Nombre" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
              <input required name="apellido" placeholder="Apellido" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
              <input required name="celular" placeholder="Celular" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button disabled={loading} className="w-full rounded-xl bg-brand-yellow px-4 py-2 font-semibold text-black">
            {loading ? "Procesando..." : mode === "register" ? "Crear cuenta" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
