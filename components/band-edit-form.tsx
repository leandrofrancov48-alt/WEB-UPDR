"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { Camera, Music, Video, Save, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

interface Band {
  id: string;
  name: string;
  bio: string | null;
  genre: string | null;
  instagram: string | null;
  spotify: string | null;
  youtube: string | null;
  profilePic: string | null;
  coverPic: string | null;
  city: string | null;
}

export function BandEditForm({ band }: { band: Band }) {
  const router = useRouter();
  const [formData, setFormData] = useState(band);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/bands/${band.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <h1 className="text-2xl font-yellow text-brand-yellow uppercase tracking-widest">Editar Banda</h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-sm">
          ¡Información actualizada con éxito! ✅
        </div>
      )}

      {/* Media Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 block">Foto de Perfil</label>
          <div className="relative group">
            <div className="w-40 h-40 rounded-3xl overflow-hidden border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center relative">
              {formData.profilePic ? (
                <Image src={formData.profilePic} alt="Profile" fill className="object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-white/20" />
              )}
            </div>
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={(result: any) => setFormData({ ...formData, profilePic: result.info.secure_url })}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="mt-2 text-xs text-brand-yellow font-bold uppercase hover:underline"
                >
                  Cambiar foto
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 block">Foto de Portada</label>
          <div className="relative group">
            <div className="w-full h-40 rounded-3xl overflow-hidden border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center relative">
              {formData.coverPic ? (
                <Image src={formData.coverPic} alt="Cover" fill className="object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-white/20" />
              )}
            </div>
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={(result: any) => setFormData({ ...formData, coverPic: result.info.secure_url })}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="mt-2 text-xs text-brand-yellow font-bold uppercase hover:underline"
                >
                  Cambiar portada
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Nombre de la Banda</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus:border-brand-yellow/50 outline-none transition-all"
              placeholder="Ej: Los Agentes"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Género</label>
            <input
              value={formData.genre || ""}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus:border-brand-yellow/50 outline-none transition-all"
              placeholder="Ej: Cumbia, Rock, Pop"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Zona / Ciudad</label>
            <input
              value={formData.city || ""}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus:border-brand-yellow/50 outline-none transition-all"
              placeholder="Ej: Quilmes, CABA, Rosario"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Biografía</label>
          <textarea
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 h-32 resize-none focus:border-brand-yellow/50 outline-none transition-all"
            placeholder="Contanos la historia de la banda..."
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-yellow">Redes Sociales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <Camera className="w-4 h-4" />
            </div>
            <input
              value={formData.instagram || ""}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 focus:border-brand-yellow/50 outline-none transition-all text-sm"
              placeholder="@instagram"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <Music className="w-4 h-4" />
            </div>
            <input
              value={formData.spotify || ""}
              onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
              className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 focus:border-brand-yellow/50 outline-none transition-all text-sm"
              placeholder="Link de Spotify"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <Video className="w-4 h-4" />
            </div>
            <input
              value={formData.youtube || ""}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 focus:border-brand-yellow/50 outline-none transition-all text-sm"
              placeholder="Link de Youtube"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-brand-yellow p-4 text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Guardar Cambios
          </>
        )}
      </button>
    </form>
  );
}
