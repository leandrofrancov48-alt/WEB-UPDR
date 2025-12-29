import { NextResponse } from 'next/server';

// 1. LA LLAVE MAESTRA: Usamos require y 'as any' para callar a TypeScript
// Esto obliga al código a cargar la librería versión 2 sí o sí.
const cloudinary = (require('cloudinary') as any).v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder'); 

  const searchExpression = folder ? `folder:${folder}/*` : 'resource_type:image';

  try {
    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(500)
      .with_field('context')
      .with_field('asset_folder') // <--- 2. IMPORTANTE: Pedimos el dato de la carpeta moderna
      .execute();

    const photos = result.resources.map((file: any) => {
      // 3. EL TRUCO INTELIGENTE:
      // Si no tiene carpeta antigua ('folder'), usa la moderna ('asset_folder')
      let folderPath = file.folder || file.asset_folder;
      
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

    // Cacheamos la respuesta por 1 hora (3600 segundos) para no saturar Cloudinary
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