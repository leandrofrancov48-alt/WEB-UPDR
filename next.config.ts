import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Esto inyecta la variable en el Frontend a la fuerza
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'djwmxjgey',
  },
  // 2. Esto permite que Next.js muestre imágenes de Cloudinary sin quejarse
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;