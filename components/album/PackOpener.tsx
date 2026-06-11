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
  nextPackCardCount: number;
  onOpen: () => Promise<{ stickers: Sticker[]; isNewFlags: boolean[] } | null>;
  onComplete: () => void;
}

export default function PackOpener({ packBalance, nextPackCardCount, onOpen, onComplete }: PackOpenerProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [openedStickers, setOpenedStickers] = useState<Sticker[]>([]);
  const [isNewFlags, setIsNewFlags] = useState<boolean[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = async () => {
    if (packBalance <= 0 || isOpening) return;

    setIsOpening(true);
    const result = await onOpen();

    if (result && result.stickers.length > 0) {
      setOpenedStickers(result.stickers);
      setIsNewFlags(result.isNewFlags);
      setCurrentIndex(0);
    } else {
      setIsOpening(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < openedStickers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    setOpenedStickers([]);
    setIsNewFlags([]);
    setCurrentIndex(0);
    setIsOpening(false);
    onComplete();
  };

  const hasRevealed = openedStickers.length > 0;
  const currentSticker = openedStickers[currentIndex];
  const isNew = isNewFlags[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-white/10 relative overflow-visible w-full">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-brand-yellow/5 blur-3xl -z-10 rounded-2xl" />

      <AnimatePresence mode="wait">
        {!hasRevealed ? (
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
                  <h3 className="font-yellow text-2xl text-black leading-none">
                    {nextPackCardCount === 3 ? 'SOBRE TRIPLE' : nextPackCardCount === 2 ? 'SOBRE DOBLE' : 'SOBRE UPDR'}
                  </h3>
                  <p className="text-[10px] text-black/60 font-bold mt-2 uppercase tracking-tighter">
                    {nextPackCardCount} FIGURITA{nextPackCardCount > 1 ? 'S' : ''} COLECCIONABLE{nextPackCardCount > 1 ? 'S' : ''}
                  </p>
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
            key={`reveal-${currentIndex}`}
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Card progress counter */}
            {openedStickers.length > 1 && (
              <span className="text-xs font-semibold text-brand-yellow/80 bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Figurita {currentIndex + 1} de {openedStickers.length}
              </span>
            )}

            <div className="relative pt-6 pb-4">
              {/* Explosion Effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-brand-yellow rounded-full blur-2xl -z-10"
              />

              <div className="w-64 relative z-10 mx-auto">
                <StickerCard sticker={currentSticker} isOwned={true} />
              </div>

              {isNew && (
                <motion.div
                  initial={{ y: 20, opacity: 0, x: '-50%' }}
                  animate={{ y: 0, opacity: 1, x: '-50%' }}
                  className="absolute top-4 left-1/2 bg-brand-orange text-white px-5 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 whitespace-nowrap z-20 border border-white/20"
                >
                  <Sparkles className="w-4 h-4" />
                  ¡NUEVA FIGURITA!
                </motion.div>
              )}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-yellow text-brand-yellow drop-shadow-lg">{currentSticker.name}</h2>
              <div className="flex items-center justify-center gap-3 text-white/60 text-sm font-bold uppercase tracking-widest">
                <span># {currentSticker.number}</span>
                <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                <span className={
                  currentSticker.rarity === 'LEGEND' ? 'text-purple-400 font-extrabold animate-pulse' : 
                  currentSticker.rarity === 'CUMBIERIZED' ? 'text-brand-orange' : 
                  currentSticker.rarity === 'TENDENCIA' ? 'text-cyan-400 font-semibold animate-pulse' :
                  'text-brand-yellow'
                }>
                  {currentSticker.rarity}
                </span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="mt-4 px-10 py-3 bg-gradient-to-r from-brand-yellow to-brand-orange text-black hover:scale-105 font-bold transition-all rounded-full"
            >
              {currentIndex < openedStickers.length - 1 ? 'SIGUIENTE FIGURITA' : 'CONTINUAR'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
