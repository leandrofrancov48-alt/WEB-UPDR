"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { User, Users, Music, Camera, Check } from "lucide-react";

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
  lat: string;
  lon: string;
}

export function ArtistRegistrationForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    registrationType: "BAND" as "BAND" | "MUSICIAN",
    artistName: "",
    genre: "",
    bio: "",
    instrument: "",
    instagram: "",
    spotify: "",
    youtube: "",
    address: "",
    street: "",
    number: "",
    city: "",
    postalCode: "",
    contactPhone: "",
    showEmail: false,
    showPersonalData: false,
    showContactPhone: false,
    profilePic: "",
    mediaUrls: [] as string[],
    lat: null as number | null,
    lng: null as number | null,
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
      lat: item.lat,
      lon: item.lon,
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
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
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
    <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
      {/* Type Selection */}
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold uppercase tracking-widest text-brand-yellow/80">¿Qué querés registrar?</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, registrationType: "MUSICIAN" })}
            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              formData.registrationType === "MUSICIAN"
                ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-bold">MÚSICO</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, registrationType: "BAND" })}
            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              formData.registrationType === "BAND"
                ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-bold">BANDA</span>
          </button>
        </div>
      </div>

      {/* Profile Pic Upload */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-white/5 relative">
            {formData.profilePic ? (
              <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-white/20" />
              </div>
            )}
          </div>
          <CldUploadWidget
            uploadPreset="updr_emergentes"
            options={{ maxFiles: 1, resourceType: "image", folder: "perfiles" }}
            onSuccess={(result: any) => {
              if (result.info && typeof result.info !== "string") {
                setFormData({ ...formData, profilePic: result.info.secure_url });
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="absolute bottom-0 right-0 bg-brand-yellow text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </CldUploadWidget>
        </div>
        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Foto de {formData.registrationType === "MUSICIAN" ? "Músico" : "Banda"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Artist Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">
            {formData.registrationType === "MUSICIAN" ? "Nombre Artístico" : "Nombre de la Banda"}
          </label>
          <input
            required
            type="text"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
            placeholder={formData.registrationType === "MUSICIAN" ? "Ej: Juani Updr" : "Ej: Los Ruideros"}
            value={formData.artistName}
            onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
          />
        </div>

        {/* Genre / Instrument */}
        {formData.registrationType === "MUSICIAN" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">¿Qué instrumento tocás?</label>
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
              placeholder="Ej: Timbales, Bajo, Voz..."
              value={formData.instrument}
              onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
            />
          </div>
        ) : (
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
        )}
      </div>

      {/* Contact Phone */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/60">
          WhatsApp / Teléfono de contacto {formData.registrationType === "MUSICIAN" ? "personal" : "de la banda"}
        </label>
        <input
          type="text"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors"
          placeholder="Ej: +54 9 11 ..."
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
        />
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
        <label className="text-sm font-medium text-white/60">Material (Máximo 2 videos o audios - Fotos no)</label>
        <div className="flex flex-wrap gap-4">
          {formData.mediaUrls.length < 2 && (
            <CldUploadWidget
              uploadPreset="updr_emergentes"
              options={{
                maxFiles: 2,
                resourceType: "video", // This covers both video and audio in Cloudinary
                clientAllowedFormats: ["mp4", "mov", "avi", "mp3", "wav", "m4a"],
                folder: `emergentes/${formData.artistName.replace(/[^a-zA-Z0-9]/g, "_") || "sin-nombre"}`,
              }}
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
          )}
          
          {formData.mediaUrls.map((url, i) => (
            <div key={i} className="w-32 h-32 relative rounded-2xl overflow-hidden border border-white/10 bg-brand-blue/10">
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                <span className="text-2xl mb-1">🎬</span>
                <span className="text-[8px] uppercase font-bold text-white/60 truncate w-full">Archivo {i + 1}</span>
              </div>
              <button 
                type="button"
                className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
                onClick={() => setFormData(prev => ({ ...prev, mediaUrls: prev.mediaUrls.filter((_, idx) => idx !== i) }))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {formData.mediaUrls.length >= 2 && (
          <p className="text-xs text-brand-yellow/70 italic">Ya subiste el máximo de 2 archivos permitidos.</p>
        )}
      </div>

      {/* Visibility Settings */}
      <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-yellow/80">Privacidad y Visibilidad</h3>
        <p className="text-xs text-white/40 italic mb-2">Elegí qué datos querés que vean los demás usuarios en tu perfil público.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex items-start gap-4 cursor-pointer group bg-white/5 p-4 rounded-xl border border-white/5 hover:border-brand-yellow/30 transition-all">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={formData.showPersonalData} 
                onChange={(e) => setFormData({ ...formData, showPersonalData: e.target.checked })}
                className="peer sr-only"
              />
              <div className="w-6 h-6 border-2 border-white/20 rounded-md peer-checked:bg-brand-yellow peer-checked:border-brand-yellow transition-all flex items-center justify-center">
                <Check className="w-4 h-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white/80 group-hover:text-white">Mostrar Datos Personales</span>
              <span className="text-[10px] text-white/40">Nombre real, apellido y DNI (opcional)</span>
            </div>
          </label>

          <label className="flex items-start gap-4 cursor-pointer group bg-white/5 p-4 rounded-xl border border-white/5 hover:border-brand-yellow/30 transition-all">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={formData.showContactPhone} 
                onChange={(e) => setFormData({ ...formData, showContactPhone: e.target.checked })}
                className="peer sr-only"
              />
              <div className="w-6 h-6 border-2 border-white/20 rounded-md peer-checked:bg-brand-yellow peer-checked:border-brand-yellow transition-all flex items-center justify-center">
                <Check className="w-4 h-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white/80 group-hover:text-white">Mostrar Contacto</span>
              <span className="text-[10px] text-white/40">WhatsApp y medios de comunicación</span>
            </div>
          </label>
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
