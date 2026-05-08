"use client";

import { useState, useTransition } from "react";
import { deleteGroup, leaveGroup } from "@/lib/actions/prode";

export function GroupActions({ groupId, isOwner }: { groupId: string; isOwner: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAction = () => {
    startTransition(async () => {
      try {
        if (isOwner) {
          await deleteGroup(groupId);
        } else {
          await leaveGroup(groupId);
        }
      } catch (e: any) {
        alert(e.message || "Error");
      }
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <span className="text-sm text-red-400 font-semibold">
          {isOwner ? "¿Eliminar este grupo?" : "¿Salir de este grupo?"}
        </span>
        <button
          onClick={handleAction}
          disabled={isPending}
          className="bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "..." : "Confirmar"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <button
        onClick={() => setShowConfirm(true)}
        className="text-xs text-red-400/70 hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider font-semibold"
      >
        {isOwner ? "🗑️ Eliminar grupo" : "🚪 Salir del grupo"}
      </button>
    </div>
  );
}
