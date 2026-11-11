import { getStaffContext } from "@/lib/staff-auth";
import { AdminLoginForm } from "@/components/prode/AdminLoginForm";
import {
  getAdminShiftsOverview,
  getStaffMembers,
  getStaffRates,
} from "@/lib/actions/staffActions";
import AdminJornadasClient from "@/components/staff/AdminJornadasClient";

export const dynamic = "force-dynamic";

export default async function AdminJornadasPage() {
  const ctx = await getStaffContext();

  if (!ctx.isAdminPagos) {
    return <AdminLoginForm />;
  }

  try {
    const [initialOverview, initialMembers, initialRates] = await Promise.all([
      getAdminShiftsOverview(),
      getStaffMembers(),
      getStaffRates(),
    ]);

    return (
      <AdminJornadasClient
        initialOverview={initialOverview}
        initialMembers={initialMembers}
        initialRates={initialRates}
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
            href="/control-updr-admin"
            className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold"
          >
            ← Volver al Panel Admin
          </a>
        </div>
      </main>
    );
  }
}
