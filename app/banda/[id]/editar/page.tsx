import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { BandEditForm } from "@/components/band-edit-form";

export default async function BandEditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const band = await prisma.band.findUnique({
    where: { id },
  });

  if (!band) notFound();

  // Verify ownership
  if (band.ownerId !== user.id) {
    redirect(`/banda/${id}`);
  }

  return (
    <main className="min-h-screen bg-[#050b1a] text-white pt-20 pb-32">
      <div className="section-shell max-w-3xl">
        <div className="glass-card p-6 md:p-12">
          <BandEditForm band={band} />
        </div>
      </div>
    </main>
  );
}
