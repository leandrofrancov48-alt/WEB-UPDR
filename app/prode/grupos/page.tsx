import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { GroupModals } from "@/components/prode/GroupModals";
import { GroupPendingRequests } from "@/components/prode/GroupPendingRequests";
import { GroupActions } from "@/components/prode/GroupActions";

export default async function GruposPage() {
  const user = await getSessionUser();

  // Obtener los grupos en los que el usuario es miembro
  const userGroups = await prisma.privateGroupMember.findMany({
    where: { userId: user?.id },
    include: {
      group: {
        include: {
          members: {
            include: {
              user: {
                include: {
                  predictions: true // Para sumar los puntos
                }
              }
            }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-10">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <div>
          <h1 className="text-5xl text-brand-yellow font-yellow uppercase mb-2">Mis Grupos</h1>
          <p className="text-white/80 text-lg max-w-lg">
            Competí directamente con tus amigos. Uníte a un grupo con el código o creá el tuyo.
          </p>
        </div>
        <GroupModals />
      </div>

      {userGroups.length === 0 ? (
        <div className="text-center py-20 text-white/50 bg-white/5 rounded-2xl border border-white/10">
          No estás en ningún grupo todavía. ¡Creá uno o unite con un código!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {userGroups.map((member) => {
            const group = member.group;
              // Separar miembros aprobados y pendientes
              const approvedMembers = group.members.filter(m => m.status === "APPROVED");
              const pendingMembers = group.members.filter(m => m.status === "PENDING");
              
              const isOwner = group.ownerId === user?.id;

              // Calcular puntos solo para miembros aprobados
              const ranking = approvedMembers.map(m => {
                const totalPoints = m.user.predictions.reduce((acc, pred) => acc + pred.points, 0);
                const totalPlenos = m.user.predictions.filter(pred => pred.points === 5).length;
                return {
                  id: m.user.id,
                  name: m.user.username,
                  points: totalPoints,
                  plenos: totalPlenos
                };
              }).sort((a, b) => b.points - a.points || b.plenos - a.plenos); // Ordenar por puntos y luego por plenos

              return (
                <div key={group.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-yellow text-white uppercase truncate pr-4">{group.name}</h2>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-white/50 block uppercase tracking-wider mb-1">Código Inv.</span>
                      <span className="bg-brand-yellow/20 text-brand-yellow font-mono px-3 py-1 rounded text-lg font-bold tracking-widest">{group.code}</span>
                    </div>
                  </div>

                  {member.status === "PENDING" ? (
                    <div className="text-center py-10 bg-black/40 rounded-xl border border-white/5">
                      <p className="text-brand-yellow font-bold uppercase mb-2">Solicitud Enviada</p>
                      <p className="text-white/50 text-sm">Esperando que el creador del grupo apruebe tu ingreso.</p>
                    </div>
                  ) : (
                    <>
                      {isOwner && (
                        <GroupPendingRequests groupId={group.id} pendingMembers={pendingMembers} />
                      )}

                      <div className="space-y-3">
                        {ranking.map((userStats, index) => (
                          <div key={userStats.id} className={`flex justify-between items-center p-3 rounded-lg ${userStats.id === user?.id ? 'bg-brand-yellow/10 border border-brand-yellow/30' : 'bg-white/5'}`}>
                            <div className="flex items-center gap-4">
                              <span className={`font-yellow text-xl w-6 text-center ${index === 0 ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-white/50'}`}>
                                {index + 1}
                              </span>
                              <span className={`font-semibold ${userStats.id === user?.id ? 'text-brand-yellow' : 'text-white'}`}>
                                {userStats.name} {userStats.id === user?.id && "(Vos)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <span className="block text-[10px] text-white/30 uppercase font-bold leading-none mb-1">Plenos</span>
                                <span className="font-mono text-lg text-brand-yellow/80">{userStats.plenos}</span>
                              </div>
                              <span className="font-mono text-xl font-bold text-white">{userStats.points} <span className="text-xs text-white/50 font-sans font-normal">pts</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <GroupActions groupId={group.id} isOwner={isOwner} />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
