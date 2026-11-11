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
}
