import { NextResponse } from 'next/server';

const cloudinary = (require('cloudinary') as any).v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  // 1. CHEQUEO DE SEGURIDAD: ¿Están las llaves puestas?
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ 
      status: "ERROR CRITICO",
      message: "Faltan las Environment Variables en Vercel. El servidor no tiene las llaves.",
      keys_detected: {
        cloud_name: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        secret: !!process.env.CLOUDINARY_API_SECRET
      }
    }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const requestedFolder = searchParams.get('folder');

  try {
    // 2. PEDIMOS TODO SIN FILTROS (RAW DATA)
    const result = await cloudinary.search
      .expression('resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(20) // Solo pedimos 20 para probar rápido
      .with_field('context')
      .with_field('asset_folder')
      .execute();

    // 3. MOSTRAMOS LO QUE VEMOS (SIN FILTRAR)
    const debugData = result.resources.map((file: any) => {
      let folderDetected = file.asset_folder || file.folder || "SIN CARPETA";
      
      // Simulación de tu lógica de limpieza
      if (folderDetected === "SIN CARPETA") {
         const parts = file.public_id.split('/');
         if (parts.length > 1) folderDetected = parts[0]; 
      }

      return {
        public_id: file.public_id,
        folder_RAW: file.folder, // Carpeta antigua
        asset_folder_RAW: file.asset_folder, // Carpeta nueva
        FOLDER_FINAL_DETECTADO: folderDetected, // Lo que tu código ve
        url: file.secure_url
      };
    });

    return NextResponse.json({
      status: "OK - DIAGNOSTICO",
      carpeta_que_buscas: requestedFolder || "NINGUNA (Trayendo todo)",
      total_encontrados: debugData.length,
      ejemplos: debugData // Aquí veremos la lista real
    });

  } catch (error: any) {
    return NextResponse.json({ 
      status: "ERROR DE CONEXION", 
      message: error.message || "Error desconocido conectando a Cloudinary",
      full_error: JSON.stringify(error)
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ message: 'Only GET allowed' });
}