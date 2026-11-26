import { getStaffContext } from "@/lib/staff-auth";
import { AdminLoginForm } from "@/components/prode/AdminLoginForm";
import { getStaffMembers } from "@/lib/actions/staffActions";
import StaffAdminClient from "./staff-admin-client";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const ctx = await getStaffContext();
  const hasAccess = ctx.isSuperAdmin || ctx.isAdminPagos;

  if (!hasAccess) {
    return <AdminLoginForm />;
  }

  const initialMembers = await getStaffMembers();

  return <StaffAdminClient initialMembers={initialMembers} isSuperAdmin={ctx.isSuperAdmin} />;
}
