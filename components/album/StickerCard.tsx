'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Sticker {
  id: string;
  number: number;
  name: string;
  image: string;
  rarity: string;
  shadowImage?: string;
}

interface StickerCardProps {
  sticker: Sticker;
  isOwned: boolean;
  quantity?: number;
}

export default function StickerCard({ sticker, isOwned, quantity }: StickerCardProps) {
  return (
    <motion.div
      whileHover={isOwned ? { scale: 1.05, rotate: 2 } : {}}
      className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
        isOwned 
          ? 'border-brand-yellow shadow-lg shadow-brand-yellow/20' 
          : 'border-white/10 bg-white/5 grayscale opacity-40'
      }`}
    >
      {/* Rarity Badge */}
      {isOwned && (
        <div className={`absolute top-1 right-1 z-10 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
          sticker.rarity === 'LEGEND' ? 'bg-purple-600' : 
          sticker.rarity === 'CUMBIERIZED' ? 'bg-brand-orange' : 
          sticker.rarity === 'GOLD' ? 'bg-brand-yellow text-black' : 'bg-brand-blue'
        }`}>
          {sticker.rarity}
        </div>
      )}

      {/* Image / Placeholder */}
      <div className="relative w-full h-full">
        {isOwned ? (
          <Image
            src={sticker.image}
            alt={sticker.name}
            fill
            className="object-cover"
          />
        ) : sticker.shadowImage ? (
          <Image
            src={sticker.shadowImage}
            alt={`${sticker.name} locked`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-4xl font-yellow text-white/20">{sticker.number}</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent ${!isOwned && 'hidden'}`}>
        <p className="text-[10px] font-bold truncate leading-tight">{sticker.name}</p>
        {quantity && quantity > 1 && (
          <span className="absolute -bottom-1 -right-1 bg-brand-yellow text-black text-[10px] font-bold px-1.5 rounded-full border border-black">
            x{quantity}
          </span>
        )}
      </div>

      {!isOwned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Bloqueado</span>
        </div>
      )}
    </motion.div>
  );
}
