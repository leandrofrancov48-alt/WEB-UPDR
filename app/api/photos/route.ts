import { NextResponse } from 'next/server';

// Usamos require para asegurar compatibilidad
const cloudinary = (require('cloudinary') as any).v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedFolder = searchParams.get('folder'); 

  // ESTRATEGIA FUERZA BRUTA:
  // Pedimos TODO (resource_type:image) sin filtros complejos de carpetas.
  // Traemos las ultimas 500 fotos.
  const searchExpression = 'resource_type:image';

  try {
    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(500) // Si tienes más de 500, avísame para aumentar esto
      .with_field('context')
      .with_field('asset_folder') // Importante: pedimos el dato de la carpeta
      .execute();

    // 1. Convertimos TODAS las fotos al formato que usa tu web
    let photos = result.resources.map((file: any) => {
      // Detectamos la carpeta real (moderna o antigua)
      let folderPath = file.asset_folder || file.folder;
      
      // Si no tiene carpeta asignada, intentamos sacarla del ID o poner Varios
      if (!folderPath) {
        const parts = file.public_id.split('/');
        if (parts.length > 1) {
          parts.pop(); 
          folderPath = parts.join('/');
        } else {
          folderPath = "Varios";
        }
      }

      // Limpiamos el nombre para que quede solo "fiesta-diciembre" sin rutas largas
      const specificFolder = folderPath.split('/').pop();

      return {
        _id: file.asset_id,
        url: file.secure_url,
        folder: specificFolder, // Aquí guardamos "fiesta-diciembre"
        publicId: file.public_id,
        width: file.width,  
        height: file.height 
      };
    });

    // 2. FILTRO MANUAL (Aquí ocurre la magia):
    // Si la web pidió una carpeta específica, eliminamos de la lista todo lo que no sea de esa carpeta.
    if (requestedFolder) {
      photos = photos.filter((photo: any) => photo.folder === requestedFolder);
    }

    return NextResponse.json(photos, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59', // Bajamos el caché a 10s para que veas cambios rápido
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