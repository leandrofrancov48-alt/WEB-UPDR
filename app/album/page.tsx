'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Package, Info, CheckCircle2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import StickerCard from '@/components/album/StickerCard';
import PackOpener from '@/components/album/PackOpener';

interface Sticker {
  id: string;
  number: number;
  name: string;
  image: string;
  rarity: string;
  category: string;
}

interface UserSticker {
  stickerId: string;
  quantity: number;
}

export default function AlbumPage() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [ownedStickers, setOwnedStickers] = useState<Record<string, number>>({});
  const [packBalance, setPackBalance] = useState(0);
  const [pack2Balance, setPack2Balance] = useState(0);
  const [pack3Balance, setPack3Balance] = useState(0);
  const [hasClaimedWelcome, setHasClaimedWelcome] = useState(false);
  const [globalPacksOpened, setGlobalPacksOpened] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [exchanging, setExchanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/album/progress');
      const data = await res.json();
      if (res.ok) {
        setStickers(data.stickers);
        const ownedMap: Record<string, number> = {};
        data.owned.forEach((os: any) => {
          ownedMap[os.stickerId] = os.quantity;
        });
        setOwnedStickers(ownedMap);
        setPackBalance(data.packBalance);
        setPack2Balance(data.pack2Balance || 0);
        setPack3Balance(data.pack3Balance || 0);
        setHasClaimedWelcome(data.hasClaimedWelcome);
        setGlobalPacksOpened(data.totalGlobalOpenedPacks || 0);
      } else if (res.status === 401) {
        setError('UNAUTHORIZED');
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleOpenPack = async () => {
    try {
      const res = await fetch('/api/album/open-pack', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        return { stickers: data.stickers, isNewFlags: data.isNewFlags };
      }
    } catch (error) {
      console.error('Error opening pack:', error);
    }
    return null;
  };

  const handleClaimWelcome = async () => {
    setClaiming(true);
    try {
      const res = await fetch('/api/album/claim-welcome', { method: 'POST' });
      if (res.ok) {
        await fetchProgress();
      }
    } catch (error) {
      console.error('Error claiming welcome pack:', error);
    } finally {
      setClaiming(false);
    }
  };

  const totalDuplicates = Object.values(ownedStickers).reduce((acc, qty) => {
    return acc + (qty > 1 ? qty - 1 : 0);
  }, 0);

  const handleExchangeDuplicates = async () => {
    if (totalDuplicates < 3) return;
    setExchanging(true);
    try {
      const res = await fetch('/api/album/exchange', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        await fetchProgress();
      } else {
        alert(data.error || 'Error al realizar el canje');
      }
    } catch (error) {
      console.error('Error exchanging duplicates:', error);
      alert('Ocurrió un error en el servidor al realizar el canje.');
    } finally {
      setExchanging(false);
    }
  };

  const ownedCount = Object.keys(ownedStickers).length;
  const totalCount = stickers.length;
  const percentage = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050b1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-yellow"></div>
      </div>
    );
  }

  if (error === 'UNAUTHORIZED') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b1a] px-6 text-center">
        <Link href="/" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
          ← Volver
        </Link>
        <h2 className="text-4xl font-yellow text-brand-yellow mb-4">¡ALTO AHÍ!</h2>
        <p className="text-white/60 max-w-md mb-8">Debes iniciar sesión para empezar a coleccionar las figuritas de Un Poco de Ruido.</p>
        <a href="/login" className="px-8 py-3 bg-brand-yellow text-black font-bold rounded-full hover:scale-105 transition-all">
          INICIAR SESIÓN
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b1a] text-white pb-20">
      <Link href="/" className="fixed left-5 top-5 z-20 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:text-brand-yellow hover:border-brand-yellow/40">
        ← Volver
      </Link>
      {/* Hero / Progress Header */}
      <section className="relative py-12 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-brand-yellow/5 blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-yellow text-brand-yellow mb-2 tracking-tight">ÁLBUM UPDR</h1>
            <p className="text-white/60 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-brand-orange" />
              Coleccioná a tus artistas y momentos favoritos
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-brand-yellow/10 border border-brand-yellow/20 rounded-full">
              <Package className="w-4 h-4 text-brand-yellow" />
              <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest">
                Sobres abiertos globales: {globalPacksOpened.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 w-full md:w-80 shadow-2xl">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Tu Progreso</p>
                <p className="text-3xl font-yellow">{ownedCount} / {totalCount}</p>
              </div>
              <p className="text-3xl font-yellow text-brand-yellow">{percentage}%</p>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-gradient-to-r from-brand-yellow to-brand-orange"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Pack Area */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-6">
            <div className="text-center border-b border-white/5 pb-4">
              <h3 className="font-yellow text-3xl text-brand-yellow">MI ÁLBUM</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1 font-bold">Gestión de Sobres</p>
            </div>

            <PackOpener
              packBalance={packBalance + pack2Balance + pack3Balance}
              nextPackCardCount={pack3Balance > 0 ? 3 : (pack2Balance > 0 ? 2 : 1)}
              onOpen={handleOpenPack}
              onComplete={fetchProgress}
            />

            {!hasClaimedWelcome ? (
              <button
                onClick={handleClaimWelcome}
                disabled={claiming}
                className="w-full py-4 bg-gradient-to-r from-brand-yellow to-brand-orange text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-brand-yellow/20"
              >
                {claiming ? 'PROCESANDO...' : 'RECLAMAR SOBRE GRATIS'}
              </button>
            ) : (
              <div className="py-3 px-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-[10px] text-white/40 font-bold uppercase">Sobre de bienvenida ya reclamado</p>
              </div>
            )}
          </div>

          {/* Reciclar Duplicados */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-[40px] -z-10 pointer-events-none"></div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className={`w-5 h-5 text-brand-orange ${exchanging ? 'animate-spin' : ''}`} />
              <div>
                <h3 className="font-yellow text-2xl text-brand-orange leading-none">RECICLAR DUPLICADOS</h3>
                <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider font-bold">Intercambio de repetidas</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center gap-3">
              <div className="flex justify-between w-full text-xs font-bold uppercase tracking-wider text-white/50">
                <span>Tus repetidas</span>
                <span className={totalDuplicates >= 3 ? "text-brand-orange font-bold" : "text-white/70"}>{totalDuplicates} disponibles</span>
              </div>
              
              {/* Visual Slots (3 slots) */}
              <div className="flex gap-3 w-full justify-center py-1">
                {[0, 1, 2].map((slotIndex) => {
                  const isFilled = totalDuplicates > slotIndex;
                  return (
                    <div
                      key={slotIndex}
                      className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        isFilled
                          ? "border-brand-orange bg-brand-orange/15 shadow-[0_0_10px_rgba(244,103,83,0.3)] text-brand-orange"
                          : "border-white/10 bg-white/5 text-white/20"
                      }`}
                    >
                      <span className="text-lg font-bold font-mono">
                        {isFilled ? "✨" : "?"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-center text-white/40">
                {totalDuplicates >= 3 
                  ? "¡Tenés suficientes repetidas para canjear!" 
                  : `Te faltan ${3 - totalDuplicates} más para el próximo canje.`}
              </p>
            </div>

            <button
              onClick={handleExchangeDuplicates}
              disabled={totalDuplicates < 3 || exchanging}
              className={`w-full py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-200 ${
                totalDuplicates >= 3
                  ? "bg-brand-orange text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-orange/20"
                  : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
              }`}
            >
              {exchanging ? "CANJEANDO..." : "CANJEAR 3 REPETIDAS"}
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-brand-yellow" />
              ¿Cómo conseguir más?
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Mirá el stream en vivo desde la web en horarios de programa (60 min = 1 sobre).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Participá en el PRODE y acertá resultados.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Atento a las redes por códigos especiales.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticker Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-yellow">COLECCIÓN</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10">TODAS</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10 text-white/40">FALTANTES</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {stickers.map((sticker) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                isOwned={!!ownedStickers[sticker.id]}
                quantity={ownedStickers[sticker.id]}
              />
            ))}
          </div>

          {stickers.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 font-bold uppercase tracking-widest">No hay figuritas cargadas aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}