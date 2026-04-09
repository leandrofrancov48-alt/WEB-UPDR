import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const yellowFont = localFont({
  src: "./fonts/YellowBalloonW00Regular.ttf",
  variable: "--font-yellow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "1PDR | UN POCO DE RUIDO",
  description: "Sitio oficial de Un Poco de Ruido.",
  openGraph: {
    title: "1PDR | UN POCO DE RUIDO",
    description: "Sitio oficial de Un Poco de Ruido.",
    url: "https://1pdr.ar",
    siteName: "1PDR",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${yellowFont.variable} font-sans antialiased bg-[#070709] text-white`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>

          <footer className="border-t border-white/10 py-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-white/60">© {new Date().getFullYear()} UN POCO DE RUIDO</p>
                <p className="text-xs text-white/40 mt-1">Management y Comercial: 1pdr@1pdr.ar</p>
              </div>

              <div className="flex items-center gap-5">
                <Link href="https://www.instagram.com/unpocoderuidook/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-brand-yellow transition-colors">Instagram</Link>
                <Link href="https://www.tiktok.com/@unpocoderuidook?_r=1&_t=ZM-92sZWXuEnSG" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-brand-yellow transition-colors">TikTok</Link>
                <Link href="https://www.instagram.com/updroutofcontext/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-brand-yellow transition-colors">UPDR OOC</Link>
                <Image src="/logo.png" alt="UPDR" width={36} height={36} className="object-contain opacity-90" />
              </div>
            </div>
          </footer>
        </div>

        <Analytics />
      </body>
    </html>
  );
}
