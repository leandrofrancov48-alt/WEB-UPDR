'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Package, Info, CheckCircle2 } from 'lucide-react';
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
  const [hasClaimedWelcome, setHasClaimedWelcome] = useState(false);
  const [show20PtsNotification, setShow20PtsNotification] = useState(false);
  const [globalPacksOpened, setGlobalPacksOpened] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
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
        setHasClaimedWelcome(data.hasClaimedWelcome);
        setShow20PtsNotification(data.show20PtsNotification);
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
        // We don't refresh progress here yet, PackOpener handles the reveal
        return { sticker: data.sticker, isNew: data.isNew };
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

  const handleDismiss20Pts = async () => {
    setShow20PtsNotification(false);
    try {
      await fetch('/api/album/dismiss-20pts-notification', { method: 'POST' });
    } catch (e) {
      console.error(e);
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
      {show20PtsNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#050b1a] border border-brand-yellow/50 p-8 rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(255,204,0,0.2)]"
          >
            <Trophy className="w-16 h-16 text-brand-yellow mx-auto mb-4" />
            <h3 className="text-2xl font-yellow text-brand-yellow mb-4">¡FELICITACIONES!</h3>
            <p className="text-white mb-6">
              Has recibido un sobre 1PDR (de 1 figurita) por haber alcanzado los 20 pts en el ranking global del prode, reclámalo en “Mi álbum”.
            </p>
            <button 
              onClick={handleDismiss20Pts}
              className="px-8 py-3 bg-brand-yellow text-black font-bold rounded-full hover:scale-105 transition-all w-full"
            >
              ACEPTAR
            </button>
          </motion.div>
        </div>
      )}
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
              packBalance={packBalance}
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