import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// --- IMPORTANTE: Pega aquí tu URL del video comprimido ---
const VIDEO_URL = "https://res.cloudinary.com/djwmxjgey/video/upload/v1764168958/VIDEO_FONDO_pcyd2i.mp4"; // <--- CAMBIA ESTO POR EL TUYO
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

        {/* 3. CONTENIDO (Capa normal) */}
        <div className="relative z-0">
          {children}
        </div>

      </body>
    </html>
  );
}