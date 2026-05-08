import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProdeLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen text-white relative">
      {/* Background Image Layer (Blur aplicado directo a la imagen, mucho más rápido) */}
      <div 
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat blur-[8px] transform scale-105"
        style={{ backgroundImage: "url('/bg-prode.jpg')" }}
      ></div>
      {/* Overlay Layer (Capa negra transparente sin backdrop-blur para no trabar el scroll) */}
      <div className="fixed inset-0 z-[-1] bg-[#050b1a]/85"></div>

      {/* Navbar Prode */}
      <nav className="border-b border-white/10 bg-[#050b1a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-4 flex gap-6 overflow-x-auto items-center">
          <Link href="/prode" className="font-yellow text-xl text-brand-yellow hover:text-white transition-colors whitespace-nowrap">
            Pronósticos
          </Link>
          <Link href="/prode/grupos" className="font-yellow text-xl text-brand-yellow hover:text-white transition-colors whitespace-nowrap">
            Mis Grupos
          </Link>
          <Link href="/prode/ranking" className="font-yellow text-xl text-brand-yellow hover:text-white transition-colors whitespace-nowrap">
            Ranking Global
          </Link>
          <Link href="/" className="ml-auto text-white/40 hover:text-white transition-colors whitespace-nowrap text-sm shrink-0">
            ← Volver al inicio
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
