'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Sticker {
  id: string;
  number: number;
  name: string;
  image: string;
  rarity: string;
}

interface StickerCardProps {
  sticker: Sticker;
  isOwned: boolean;
  quantity?: number;
}

export default function StickerCard({ sticker, isOwned, quantity }: StickerCardProps) {
  return (
    <motion.div
      whileHover={isOwned ? { scale: 1.05, rotate: 1 } : {}}
      className={`relative aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all duration-300 p-2 ${
        isOwned 
          ? 'border-brand-yellow bg-gradient-to-br from-white/10 to-white/5 shadow-xl shadow-brand-yellow/10' 
          : 'border-white/5 bg-white/5 grayscale opacity-30 brightness-75'
      }`}
    >
      {/* Image / Placeholder */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={sticker.image}
          alt={sticker.name}
          fill
          className={`object-contain ${!isOwned && 'brightness-50 contrast-125'}`}
        />
        
        {!isOwned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
            <span className="text-6xl font-yellow text-white/5 select-none">{sticker.number}</span>
          </div>
        )}
      </div>

      {/* Rarity Badge (Adjusted position) */}
      {isOwned && (
        <div className={`absolute top-3 right-3 z-10 px-2 py-0.5 rounded shadow-lg text-[8px] font-bold uppercase tracking-widest ${
          sticker.rarity === 'LEGEND' ? 'bg-purple-600 text-white' : 
          sticker.rarity === 'CUMBIERIZED' ? 'bg-brand-orange text-white' : 
          sticker.rarity === 'GOLD' ? 'bg-brand-yellow text-black' : 
          sticker.rarity === 'TENDENCIA' ? 'bg-cyan-600 text-white border border-cyan-400/30 animate-pulse' : 
          sticker.rarity === 'MUNDIAL' ? 'bg-gradient-to-r from-sky-400 to-sky-600 text-white border border-sky-300/30 animate-pulse' : 
          'bg-brand-blue text-white'
        }`}>
          {sticker.rarity}
        </div>
      )}

      {/* Quantity Badge (Moved to top-left) */}
      {isOwned && quantity && quantity > 1 && (
        <span className="absolute top-3 left-3 bg-brand-yellow text-black text-[9px] font-bold px-2 py-0.5 rounded-full border border-black/20 shadow-lg z-10">
          x{quantity}
        </span>
      )}

      {!isOwned && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="text-[9px] text-white/80 uppercase tracking-[0.2em] font-bold bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
            Bloqueado
          </span>
        </div>
      )}
    </motion.div>
  );
}
