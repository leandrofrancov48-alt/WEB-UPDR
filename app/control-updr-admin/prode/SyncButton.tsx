"use client";

import { useTransition } from "react";
import { forceSyncFixture } from "@/lib/actions/admin";
import { RefreshCw } from "lucide-react";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();

  const handleSync = () => {
    if (isPending) return;
    
    startTransition(async () => {
      try {
        const res = await forceSyncFixture();
        alert(`Sincronización exitosa.\n- Actualizados: ${res.updatedCount}\n- Puntos calculados para partidos finalizados: ${res.finishedCount}`);
      } catch (e: any) {
        console.error("Error syncing fixture:", e);
        alert(`Error al sincronizar: ${e?.message || e}`);
      }
    });
  };

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black font-bold text-xs rounded-lg hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
    >
      <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Sincronizando...' : 'Sincronizar Fixture (API)'}
    </button>
  );
}
