"use client";

import { useTransition } from "react";
import { approveGroupRequest, rejectGroupRequest } from "@/lib/actions/prode";

export function GroupPendingRequests({ groupId, pendingMembers }: { groupId: string, pendingMembers: any[] }) {
  const [isPending, startTransition] = useTransition();

  if (pendingMembers.length === 0) return null;

  const handleApprove = (userId: string) => {
    startTransition(async () => {
      await approveGroupRequest(groupId, userId);
    });
  };

  const handleReject = (userId: string) => {
    startTransition(async () => {
      await rejectGroupRequest(groupId, userId);
    });
  };

  return (
    <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
      <h3 className="text-brand-yellow font-bold uppercase text-sm mb-3">Solicitudes Pendientes ({pendingMembers.length})</h3>
      <div className="space-y-2">
        {pendingMembers.map((member) => (
          <div key={member.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
            <span className="font-semibold text-white">
              {member.user.nombre} {member.user.apellido}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleApprove(member.userId)}
                disabled={isPending}
                className="bg-green-500/20 text-green-400 hover:bg-green-500/40 px-3 py-1 rounded text-sm font-bold transition-colors disabled:opacity-50"
              >
                Aceptar
              </button>
              <button 
                onClick={() => handleReject(member.userId)}
                disabled={isPending}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-3 py-1 rounded text-sm font-bold transition-colors disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
