'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PackageOpen } from 'lucide-react';
import StickerCard from './StickerCard';

interface Sticker {
  id: string;
  number: number;
  name: string;
  image: string;
  rarity: string;
}

interface PackOpenerProps {
  packBalance: number;
  onOpen: () => Promise<{ sticker: Sticker; isNew: boolean } | null>;
  onComplete: () => void;
}

export default function PackOpener({ packBalance, onOpen, onComplete }: PackOpenerProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedSticker, setRevealedSticker] = useState<Sticker | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleOpen = async () => {
    if (packBalance <= 0 || isOpening) return;

    setIsOpening(true);
    const result = await onOpen();

    if (result) {
      setRevealedSticker(result.sticker);
      setIsNew(result.isNew);
    } else {
      setIsOpening(false);
    }
  };

  const handleReset = () => {
    setRevealedSticker(null);
    setIsOpening(false);
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-brand-yellow/5 blur-3xl -z-10" />

      <AnimatePresence mode="wait">
        {!revealedSticker ? (
          <motion.div
            key="pack"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative group cursor-pointer" onClick={handleOpen}>
              {/* Foil Pack Wrapper */}
              <motion.div
                animate={isOpening ? { 
                  rotate: [0, -2, 2, -2, 2, 0],
                  scale: [1, 1.05, 1.1]
                } : {}}
                transition={{ duration: 0.5 }}
                className="w-48 h-64 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 rounded-lg shadow-2xl relative overflow-hidden border-t-8 border-b-8 border-gray-400/50"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white/30" />
                
                {/* Pack Design */}
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <PackageOpen className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="font-yellow text-2xl text-black leading-none">SOBRE UPDR</h3>
                  <p className="text-[10px] text-black/60 font-bold mt-2 uppercase tracking-tighter">1 FIGURITA COLECCIONABLE</p>
                </div>

                {/* Texture lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,_black,_black_1px,_transparent_1px,_transparent_10px)]" />
              </motion.div>

              {/* Hover Glow */}
              <div className="absolute -inset-4 bg-brand-yellow/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>

            <button
              onClick={handleOpen}
              disabled={packBalance <= 0 || isOpening}
              className={`px-8 py-3 rounded-full font-bold text-lg shadow-xl transition-all ${
                packBalance > 0 && !isOpening
                  ? 'bg-brand-yellow text-black hover:scale-105 active:scale-95'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {isOpening ? 'ABRIENDO...' : packBalance > 0 ? `ABRIR SOBRE (${packBalance})` : 'SIN SOBRES'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              {/* Explosion Effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-brand-yellow rounded-full blur-2xl -z-10"
              />

              <div className="w-64">
                <StickerCard sticker={revealedSticker} isOwned={true} />
              </div>

              {isNew && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-orange text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  ¡NUEVA FIGURITA!
                </motion.div>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-yellow text-brand-yellow">{revealedSticker.name}</h2>
              <p className="text-white/60 text-sm mt-1"># {revealedSticker.number} • {revealedSticker.rarity}</p>
            </div>

            <button
              onClick={handleReset}
              className="mt-4 px-10 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all"
            >
              CONTINUAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
