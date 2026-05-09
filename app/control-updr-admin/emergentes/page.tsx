import EmergentesClient from "./emergentes-client";
import { isAdminAuthenticated } from "@/lib/actions/adminAuth";
import { AdminLoginForm } from "@/components/prode/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminEmergentesPage() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return <AdminLoginForm />;
  }
  return <EmergentesClient />;
}
