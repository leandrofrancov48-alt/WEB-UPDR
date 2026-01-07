import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// --- IMPORTANTE: Pega aquí tu URL del video comprimido ---
const VIDEO_URL = "https://res.cloudinary.com/djwmxjgey/video/upload/v1764168958/VIDEO_FONDO_pcyd2i.mp4"; 
// ---------------------------------------------------------

const yellowFont = localFont({
  src: "./fonts/YellowBalloonW00Regular.ttf", 
  variable: "--font-yellow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UN POCO DE RUIDO | Galería Oficial",
  description: "Todas las fotos de nuestras fiestas. Descargá tu foto en alta calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${yellowFont.variable} font-sans antialiased`}>
        
        {/* 1. VIDEO DE FONDO (Capa -10: Al fondo de todo) */}
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
          {/* Capa oscura para que el texto resalte sobre el video */}
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        {/* 2. BORDE NEÓN (Capa 50: Por encima de todo) */}
        <div className="neon-frame"></div>

        {/* 3. CONTENIDO PRINCIPAL + FOOTER */}
        <div className="relative z-0 min-h-screen flex flex-col">
          
          {/* Aquí se renderiza la página (children) y ocupa el espacio disponible */}
          <main className="flex-grow">
            {children}
          </main>

          {/* --- FOOTER (Contacto) --- */}
          <footer className="w-full py-10 text-center mt-auto pb-12">
            <div className="flex flex-col items-center gap-2">
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
          </footer>
          {/* ------------------------- */}

        </div>

      </body>
    </html>
  );
}