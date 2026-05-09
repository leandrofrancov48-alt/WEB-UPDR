"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";

interface Suggestion {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
  };
}

export function ArtistRegistrationForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    artistName: "",
    genre: "",
    bio: "",
    instagram: "",
    spotify: "",
    youtube: "",
    address: "",
    street: "",
    number: "",
    city: "",
    postalCode: "",
    mediaUrls: [] as string[],
  });

  // Autocomplete State
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Address Autocomplete Logic (using Nominatim - Free Alternative)
  useEffect(() => {
    if (formData.address.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            formData.address
          )}&addressdetails=1&limit=5`
        );
        const data = await suggestionsHandler(await res.json());
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (e) {
        console.error("Geocoding error", e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.address]);

  async function suggestionsHandler(data: any[]) {
    return data.map((item: any) => ({
      display_name: item.display_name,
      address: item.address,
    }));
  }

  const handleSelectSuggestion = (s: Suggestion) => {
    setFormData({
      ...formData,
      address: s.display_name,
      street: s.address.road || "",
      number: s.address.house_number || "",
      city: s.address.city || s.address.town || s.address.village || "",
      postalCode: s.address.postcode || "",
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const res = await fetch("/api/artist-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!res.ok) throw new Error("Error al enviar la postulación");

      setMsg("¡Postulación enviada con éxito! Te contactaremos pronto. 🚀");
      setTimeout(() => router.push("/perfil"), 3000);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Artist Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Nombre del Artista / Banda</label>
          <input
            required
            type="text"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
            placeholder="Ej: Los Ruideros"
            value={formData.artistName}
            onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
          />
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Género Musical</label>
          <input
            type="text"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
            placeholder="Ej: Rock, Trap, Indie..."
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/60">Bio / Descripción (Contanos un poco de vos)</label>
        <textarea
          rows={4}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors resize-none"
          placeholder="Tu historia, influencia, etc..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      {/* Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Instagram (@usuario)</label>
          <input
            type="text"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Link Spotify</label>
          <input
            type="url"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
            value={formData.spotify}
            onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Link YouTube</label>
          <input
            type="url"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
            value={formData.youtube}
            onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
          />
        </div>
      </div>

      {/* Address Autocomplete */}
      <div className="space-y-2 relative">
        <label className="text-sm font-medium text-white/60">Ubicación (Empezá a escribir...)</label>
        <input
          required
          type="text"
          autoComplete="off"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
          placeholder="Calle 123, Ciudad, Argentina"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-[#1a202c] border border-white/10 rounded-xl mt-1 overflow-hidden shadow-2xl">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm border-b border-white/5 last:border-none"
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Media Upload */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white/60">Material (Fotos / Videos)</label>
        <div className="flex flex-wrap gap-4">
          <CldUploadWidget
            uploadPreset="updr_emergentes" // Need to make sure this exists or tell user to create it
            onSuccess={(result: any) => {
              if (result.info && typeof result.info !== "string") {
                setFormData((prev) => ({
                  ...prev,
                  mediaUrls: [...prev.mediaUrls, result.info.secure_url],
                }));
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl hover:border-brand-yellow hover:bg-brand-yellow/5 transition-all group"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">+</span>
                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-brand-yellow">Subir</span>
              </button>
            )}
          </CldUploadWidget>
          
          {formData.mediaUrls.map((url, i) => (
            <div key={i} className="w-32 h-32 relative rounded-2xl overflow-hidden border border-white/10">
              {url.includes("video") ? (
                <div className="w-full h-full bg-brand-blue/20 flex items-center justify-center text-[10px]">VIDEO</div>
              ) : (
                <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
              )}
              <button 
                type="button"
                className="absolute top-1 right-1 bg-black/50 text-white w-5 h-5 rounded-full text-[10px]"
                onClick={() => setFormData(prev => ({ ...prev, mediaUrls: prev.mediaUrls.filter((_, idx) => idx !== i) }))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Submit */}
      <div className="pt-4 border-t border-white/10">
        {err && <p className="text-red-400 text-sm mb-4">{err}</p>}
        {msg && <p className="text-brand-yellow text-sm mb-4 font-bold">{msg}</p>}
        
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-black font-black py-4 rounded-2xl transition-all disabled:opacity-50 disabled:scale-95 text-lg uppercase tracking-wider"
        >
          {loading ? "Enviando..." : "Enviar Postulación"}
        </button>
      </div>
    </form>
  );
}
