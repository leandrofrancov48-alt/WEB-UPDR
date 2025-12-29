import { NextResponse } from 'next/server';

// Usamos require para asegurar compatibilidad y evitar errores de TypeScript
const cloudinary = (require('cloudinary') as any).v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedFolder = searchParams.get('folder'); 

  // ESTRATEGIA: Traemos TODO y filtramos en memoria.
  // Es la forma más segura para evitar que Cloudinary se confunda.
  const searchExpression = 'resource_type:image';

  try {
    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(500) // Pedimos hasta 500 fotos
      .with_field('context')
      // .with_field('asset_folder') <--- ELIMINAMOS ESTA LÍNEA QUE DABA ERROR
      .execute();

    // Procesamos foto por foto
    let photos = result.resources.map((file: any) => {
      
      // 1. Intentamos leer la carpeta directa (si Cloudinary la manda)
      let folderPath = file.folder || file.asset_folder;
      
      // 2. PLAN B (INFALIBLE): Si no hay dato de carpeta, lo sacamos del ID
      // Ejemplo ID: "fiesta-diciembre/foto1" -> extraemos "fiesta-diciembre"
      if (!folderPath) {
        const parts = file.public_id.split('/');
        if (parts.length > 1) {
          // Quitamos el nombre del archivo y nos quedamos con la carpeta
          parts.pop(); 
          folderPath = parts.join('/');
        } else {
          folderPath = "Varios";
        }
      }

      // Limpiamos por si quedan barras extra
      const specificFolder = folderPath.split('/').pop();

      return {
        _id: file.asset_id,
        url: file.secure_url,
        folder: specificFolder, // Aquí irá "fiesta-diciembre"
        publicId: file.public_id,
        width: file.width,  
        height: file.height 
      };
    });

    // 3. FILTRO FINAL:
    // Si la página web pidió una carpeta (ej: Noviembre), borramos de la lista las demás.
    if (requestedFolder) {
      photos = photos.filter((photo: any) => photo.folder === requestedFolder);
    }

    return NextResponse.json(photos, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
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