import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Estas rutas son CRÍTICAS. Le dicen a Tailwind dónde buscar tu HTML
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Por si acaso
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#FFFFFF",
          black: "#000000",
          yellow: "#E8D43F", // Tu amarillo exacto
          orange: "#F46753",
          blue: "#202C69",
        },
      },
      fontFamily: {
        // Aquí enlazamos la variable que pusimos en layout.tsx
        yellow: ['var(--font-yellow)'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out forwards', // <-- AGREGAR ESTO (con forwards)
        'slide-up': 'slideUp 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: { // <-- AGREGAR ESTO
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;