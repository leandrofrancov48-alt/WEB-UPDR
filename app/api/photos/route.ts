import { NextResponse } from 'next/server';

// 1. LA LLAVE MAESTRA: Usamos require para evitar errores de TypeScript
const cloudinary = (require('cloudinary') as any).v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder'); 

  // 🔴 CORRECCIÓN AQUÍ: 
  // Ahora buscamos tanto en carpetas viejas (folder) COMO en carpetas nuevas (asset_folder)
  const searchExpression = folder 
    ? `(folder:${folder}/* OR asset_folder:${folder})` 
    : 'resource_type:image';

  try {
    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(500)
      .with_field('context')
      .with_field('asset_folder') 
      .execute();

    const photos = result.resources.map((file: any) => {
      // Priorizamos la carpeta moderna (asset_folder)
      let folderPath = file.asset_folder || file.folder;
      
      // Si falla, intentamos adivinar por el nombre antiguo
      if (!folderPath) {
        const parts = file.public_id.split('/');
        if (parts.length > 1) {
          parts.pop(); 
          folderPath = parts.join('/');
        } else {
          folderPath = "Varios";
        }
      }

      const specificFolder = folderPath.split('/').pop();

      return {
        _id: file.asset_id,
        url: file.secure_url,
        folder: specificFolder,
        publicId: file.public_id,
        width: file.width,  
        height: file.height 
      };
    });

    return NextResponse.json(photos, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });

  } catch (error) {
    console.error("Error conectando con Cloudinary:", error);
    return NextResponse.json({ error: 'Error cargando fotos de Cloudinary' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ message: 'Subida directa gestionada por Admin' });
}