import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

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
      .execute();

    const photos = result.resources.map((file: any) => {
      let folderPath = file.folder;
      
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
        // AGREGAMOS ESTOS DOS DATOS CLAVES:
        width: file.width,  
        height: file.height 
      };
    });

    return NextResponse.json(photos);

  } catch (error) {
    console.error("Error conectando con Cloudinary:", error);
    return NextResponse.json({ error: 'Error cargando fotos de Cloudinary' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ message: 'Subida directa gestionada por Admin' });
}