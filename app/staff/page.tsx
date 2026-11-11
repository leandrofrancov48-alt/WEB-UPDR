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

  const [initialData, rates] = await Promise.all([
    getMyStaffData(),
    getStaffRates(),
  ]);

  return <StaffPortalClient initialData={initialData} rates={rates} />;
}
