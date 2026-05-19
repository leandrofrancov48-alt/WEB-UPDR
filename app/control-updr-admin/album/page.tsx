import AlbumAdminClient from "./album-client";
import { isAdminAuthenticated } from "@/lib/actions/adminAuth";
import { AdminLoginForm } from "@/components/prode/AdminLoginForm";
import { getAlbumStats } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminAlbumPage() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  // Fetch initial album stats on the server
  const stats = await getAlbumStats();

  return <AlbumAdminClient initialStats={stats} />;
}
