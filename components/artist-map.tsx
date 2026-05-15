"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { Users, Music, MapPin, ArrowRight } from "lucide-react";

// Fix for default leaflet icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ArtistMarker {
  id: string;
  name: string;
  type: "band" | "musician";
  lat: number;
  lng: number;
  profilePic?: string;
  genreOrInstrument?: string;
  city?: string;
}

interface ArtistMapProps {
  artists: ArtistMarker[];
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function ArtistMap({ artists }: ArtistMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-[600px] bg-white/5 rounded-[2rem] animate-pulse" />;

  // Default center: Buenos Aires
  const defaultCenter: [number, number] = [-34.6037, -58.3816];
  
  // Calculate center if there are artists
  const center = artists.length > 0 
    ? [artists[0].lat, artists[0].lng] as [number, number]
    : defaultCenter;

  const createCustomIcon = (url?: string, type?: "band" | "musician") => {
    const borderColor = type === "band" ? "#eab308" : "#f97316"; // brand-yellow or brand-orange
    
    return L.divIcon({
      html: `
        <div class="relative w-10 h-10 group">
          <div class="absolute inset-0 bg-black rounded-full border-2" style="border-color: ${borderColor}">
            ${url ? `<img src="${url}" class="w-full h-full object-cover rounded-full" />` : `<div class="w-full h-full flex items-center justify-center text-white/50 bg-neutral-800 rounded-full"><span class="text-[10px] font-bold">${type === 'band' ? 'B' : 'M'}</span></div>`}
          </div>
          <div class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black" style="background-color: ${borderColor}"></div>
        </div>
      `,
      className: "custom-marker-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

  return (
    <div className="w-full h-[600px] rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", background: "#050b1a" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {artists.map((artist) => (
          <Marker
            key={artist.id}
            position={[artist.lat, artist.lng]}
            icon={createCustomIcon(artist.profilePic, artist.type)}
          >
            <Popup className="artist-popup">
              <div className="w-48 p-2 bg-[#050b1a] text-white rounded-lg overflow-hidden">
                <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden bg-black/40">
                  {artist.profilePic ? (
                    <Image src={artist.profilePic} alt={artist.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                       {artist.type === 'band' ? <Users size={32} /> : <Music size={32} />}
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      artist.type === 'band' ? 'bg-brand-yellow/20 border-brand-yellow/40 text-brand-yellow' : 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange'
                    }`}>
                      {artist.type === 'band' ? 'Banda' : 'Músico'}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-bold text-sm text-white truncate">{artist.name}</h3>
                <p className="text-[10px] text-white/50 uppercase tracking-tighter mb-2">{artist.genreOrInstrument}</p>
                
                {artist.city && (
                  <div className="flex items-center gap-1 text-[9px] text-white/30 uppercase font-bold tracking-widest mb-3">
                    <MapPin size={8} className="text-brand-yellow/40" />
                    {artist.city}
                  </div>
                )}
                
                <Link 
                  href={artist.type === 'band' ? `/banda/${artist.id}` : `/musico/${artist.id}`}
                  className="flex items-center justify-between w-full p-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors group"
                >
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/80 group-hover:text-white">Ver Perfil</span>
                  <ArrowRight size={10} className="text-brand-yellow" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        <style jsx global>{`
          .leaflet-popup-content-wrapper {
            background: #050b1a !important;
            color: white !important;
            border-radius: 1rem !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            padding: 0 !important;
          }
          .leaflet-popup-content {
            margin: 0 !important;
            width: auto !important;
          }
          .leaflet-popup-tip {
            background: #050b1a !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .leaflet-container {
            font-family: inherit;
          }
        `}</style>
      </MapContainer>
    </div>
  );
}
