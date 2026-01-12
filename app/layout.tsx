import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
// 1. IMPORTAMOS ANALYTICS
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// --- URL del video comprimido ---
const VIDEO_URL = "https://res.cloudinary.com/djwmxjgey/video/upload/v1764168958/VIDEO_FONDO_pcyd2i.mp4"; 

const yellowFont = localFont({
  src: "./fonts/YellowBalloonW00Regular.ttf", 
  variable: "--font-yellow",
  display: "swap",
});

// 2. METADATA MEJORADA PARA GOOGLE
export const metadata: Metadata = {
  title: "1PDR | UN POCO DE RUIDO - Galería Oficial",
  description: "Todas las fotos de las fiestas de 1PDR (Un Poco De Ruido). Descargá tu foto en alta calidad.",
  keywords: ["1pdr", "un poco de ruido", "fotos", "fiesta", "galeria", "argentina", "turro"],
  openGraph: {
    title: "1PDR | Galería Oficial",
    description: "Mirá y descargá las fotos de la fiesta.",
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
      <body className={`${yellowFont.variable} font-sans antialiased`}>
        
        {/* VIDEO DE FONDO */}
        <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute top-0 left-0 w-full h-full object-cover blur-sm opacity-50"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        {/* BORDE NEÓN */}
        <div className="neon-frame"></div>

        {/* CONTENIDO PRINCIPAL + FOOTER */}
        <div className="relative z-0 min-h-screen flex flex-col">
          
          <main className="flex-grow">
            {children}
            {/* 3. COMPONENTE ANALYTICS ACTIVADO AQUÍ */}
            <Analytics />
          </main>

          {/* --- FOOTER COMPLETO --- */}
          <footer className="w-full py-10 text-center mt-auto pb-12 border-t border-white/10">
            <div className="flex flex-col items-center gap-6">
              
              {/* SECCIÓN REDES SOCIALES */}
              <div className="flex items-center gap-6">
                
                {/* Instagram Principal */}
                <a 
                  href="https://www.instagram.com/unpocoderuidook/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                  title="Instagram Oficial"
                >
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#E1306C]/20 group-hover:border-[#E1306C] transition-all duration-300">
                    <svg className="w-5 h-5 fill-gray-300 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold tracking-widest group-hover:text-white transition-colors">OFICIAL</span>
                </a>

               {/* TikTok (Blanco Puro) */}
                <a 
                  href="https://www.tiktok.com/@unpocoderuidook?_r=1&_t=ZM-92sZWXuEnSG" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                  title="TikTok"
                >
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#00f2ea]/20 group-hover:border-[#00f2ea] transition-all duration-300 flex items-center justify-center">
                    
                    <Image
                      src="/tiktok.png" 
                      alt="TikTok"
                      width={20} 
                      height={20} 
                      className="w-5 h-5 object-contain"
                    />
                    
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold tracking-widest group-hover:text-white transition-colors">TIKTOK</span>
                </a>

                {/* Instagram OOC */}
                <a 
                  href="https://www.instagram.com/updroutofcontext/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                  title="Out of Context"
                >
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500 transition-all duration-300">
                    <svg className="w-5 h-5 fill-gray-300 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold tracking-widest group-hover:text-white transition-colors">OOC</span>
                </a>

              </div>

              {/* SECCIÓN CONTACTO */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">
                  Contacto
                </span>
                <p className="text-gray-300 font-medium text-sm">
                  Management y Comercial:{" "}
                  <a 
                    href="mailto:1pdr@1pdr.ar" 
                    className="text-white hover:text-[#FFD700] transition-colors duration-300 font-bold ml-1"
                  >
                    1pdr@1pdr.ar
                  </a>
                </p>
                <div className="mt-4 text-gray-700 text-[10px]">
                  &copy; {new Date().getFullYear()} UN POCO DE RUIDO
                </div>
              </div>

            </div>
          </footer>
          {/* ------------------------- */}

        </div>

      </body>
    </html>
  );
}