import GaleriaAdminClient from "./galeria-client";
import { isAdminAuthenticated } from "@/lib/actions/adminAuth";
import { AdminLoginForm } from "@/components/prode/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return <AdminLoginForm />;
  }
  return <GaleriaAdminClient />;
}
