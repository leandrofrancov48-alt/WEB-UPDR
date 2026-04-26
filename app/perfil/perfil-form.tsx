"use client";

import { useEffect, useState } from "react";

type Profile = {
  email: string;
  nombre: string;
  apellido: string;
  celular: string;
  dni: string;
  birthDate: string | null;
};

export function PerfilForm() {
  const [data, setData] = useState<Profile | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((json) => {
        if (json.user) {
          setData({
            ...json.user,
            birthDate: json.user.birthDate ? String(json.user.birthDate).slice(0, 10) : "",
          });
        }
      });
  }, []);

  if (!data) return <div className="rounded-2xl border border-white/20 bg-white/5 p-6">Cargando perfil...</div>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setErr(json.error ?? "No se pudo actualizar");
      return;
    }

    setMsg("Perfil actualizado ✅");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/20 bg-white/5 p-6 space-y-4">
      <label className="grid gap-1 text-sm">Email
        <input value={data.email} disabled className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-white/60" />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="grid gap-1 text-sm">Nombre
          <input value={data.nombre} onChange={(e) => setData({ ...data, nombre: e.target.value })} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">Apellido
          <input value={data.apellido} onChange={(e) => setData({ ...data, apellido: e.target.value })} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="grid gap-1 text-sm">Celular
          <input value={data.celular} onChange={(e) => setData({ ...data, celular: e.target.value })} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">DNI
          <input value={data.dni} onChange={(e) => setData({ ...data, dni: e.target.value.replace(/\D/g, "") })} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
        </label>
      </div>
      <label className="grid gap-1 text-sm">Fecha de nacimiento
        <input type="date" value={data.birthDate ?? ""} onChange={(e) => setData({ ...data, birthDate: e.target.value })} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2" />
      </label>

      {err ? <p className="text-red-300 text-sm">{err}</p> : null}
      {msg ? <p className="text-green-300 text-sm">{msg}</p> : null}

      <button disabled={loading} className="rounded-xl bg-brand-yellow px-4 py-2 text-black font-semibold">{loading ? "Guardando..." : "Guardar cambios"}</button>
    </form>
  );
}
