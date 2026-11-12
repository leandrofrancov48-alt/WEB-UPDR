import { isAdminAuthenticated } from "@/lib/actions/adminAuth";
import { getStaffContext } from "@/lib/staff-auth";
import { AdminLoginForm } from "@/components/prode/AdminLoginForm";
import { redirect } from "next/navigation";
import {
  getAdminShiftsOverview,
  getStaffMembers,
  getStaffRates,
  getAdminJornadasPrevias,
} from "@/lib/actions/staffActions";
import AdminJornadasClient from "@/components/staff/AdminJornadasClient";

export const dynamic = "force-dynamic";

export default async function AdminJornadasPage() {
  const ctx = await getStaffContext();
  const hasAccess = ctx.isSuperAdmin || ctx.isAdminPagos;

  if (!hasAccess) {
    if (!ctx.user) {
      redirect("/login?redirect=/control-updr-admin/jornadas");
    }
    return <AdminLoginForm />;
  }

  try {
    const [initialOverview, initialMembers, initialRates, initialJornadasPrevias] = await Promise.all([
      getAdminShiftsOverview(),
      getStaffMembers(),
      getStaffRates(),
      getAdminJornadasPrevias(),
    ]);

    return (
      <AdminJornadasClient
        initialOverview={initialOverview}
        initialMembers={initialMembers}
        initialRates={initialRates}
        initialJornadasPrevias={initialJornadasPrevias}
        isSuperAdmin={ctx.isSuperAdmin}
      />
    );
  } catch (err: any) {
    console.error("Error al cargar AdminJornadasPage:", err);
    return (
      <main className="min-h-screen bg-[#050b1a] text-white flex items-center justify-center p-6">
        <div className="bg-white/5 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">Error al cargar datos de jornadas</h2>
          <p className="text-xs text-neutral-300">
            {err?.message || "Ocurrió un error inesperado al consultar los registros."}
          </p>
          <a
            href={ctx.isSuperAdmin ? "/control-updr-admin" : "/staff"}
            className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold"
          >
            {ctx.isSuperAdmin ? "← Volver al Panel Admin" : "← Volver al Portal Staff"}
          </a>
        </div>
      </main>
    );
  }
}
