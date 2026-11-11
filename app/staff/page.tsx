import { redirect } from "next/navigation";
import { getStaffContext } from "@/lib/staff-auth";
import { getMyStaffData, getStaffRates } from "@/lib/actions/staffActions";
import StaffPortalClient from "@/components/staff/StaffPortalClient";
import StaffAccessDenied from "@/components/staff/StaffAccessDenied";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const ctx = await getStaffContext();

  if (!ctx.user) {
    redirect("/login?redirect=/staff");
  }

  // Si no está registrado en la lista de staff activo, denegamos el acceso de inmediato
  if (!ctx.isStaff || !ctx.staffMember) {
    return <StaffAccessDenied email={ctx.user.email} />;
  }

  try {
    const [initialData, rates] = await Promise.all([
      getMyStaffData(),
      getStaffRates(),
    ]);

    return <StaffPortalClient initialData={initialData} rates={rates} />;
  } catch (err: any) {
    console.error("Error al cargar StaffPage:", err);
    return (
      <main className="min-h-screen bg-[#050b1a] text-white flex items-center justify-center p-6">
        <div className="bg-white/5 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">Error al consultar datos</h2>
          <p className="text-xs text-neutral-300">
            {err?.message || "Ocurrió un error al cargar tu información de staff."}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold"
          >
            ← Volver al Inicio
          </a>
        </div>
      </main>
    );
  }
}
