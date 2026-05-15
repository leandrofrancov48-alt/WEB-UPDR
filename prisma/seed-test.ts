import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test data...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create 4 Users
  // Band Owner 1
  const user1 = await prisma.user.upsert({
    where: { email: "juan@test.com" },
    update: {},
    create: {
      email: "juan@test.com",
      username: "juantimbal",
      nombre: "Juan",
      apellido: "Timbal",
      passwordHash,
      isMusician: true,
      instrument: "Timbales",
      bio: "El rey del timbal en Quilmes.",
      profilePic: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
      mediaUrls: [
        "https://res.cloudinary.com/demo/video/upload/v1631234567/sample_video.mp4",
        "https://res.cloudinary.com/demo/video/upload/v1631234568/sample_video_2.mp4"
      ],
      showPersonalData: true,
    },
  });

  // Band Owner 2
  const user2 = await prisma.user.upsert({
    where: { email: "maria@test.com" },
    update: {},
    create: {
      email: "maria@test.com",
      username: "mariaguiro",
      nombre: "Maria",
      apellido: "Guiro",
      passwordHash,
      isMusician: true,
      instrument: "Güiro",
      bio: "Sabor y ritmo desde Avellaneda.",
      profilePic: "https://images.unsplash.com/photo-1514525253361-bee243870eb2?w=400&h=400&fit=crop",
      mediaUrls: [
        "https://res.cloudinary.com/demo/video/upload/v1631234567/sample_video.mp4",
        "https://res.cloudinary.com/demo/video/upload/v1631234568/sample_video_2.mp4"
      ],
      showPersonalData: true,
    },
  });

  // Musician 3
  const user3 = await prisma.user.upsert({
    where: { email: "pedro@test.com" },
    update: {},
    create: {
      email: "pedro@test.com",
      username: "pedrooctapad",
      nombre: "Pedro",
      apellido: "Octapad",
      passwordHash,
      isMusician: true,
      instrument: "Octapad",
      bio: "Buscando banda para meterle fiesta.",
      profilePic: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop",
      mediaUrls: [
        "https://res.cloudinary.com/demo/video/upload/v1631234567/sample_video.mp4",
        "https://res.cloudinary.com/demo/video/upload/v1631234568/sample_video_2.mp4"
      ],
    },
  });

  // Musician 4
  const user4 = await prisma.user.upsert({
    where: { email: "laura@test.com" },
    update: {},
    create: {
      email: "laura@test.com",
      username: "lauravoz",
      nombre: "Laura",
      apellido: "Voz",
      passwordHash,
      isMusician: true,
      instrument: "Voz",
      bio: "Cantante de cumbia con mucha onda.",
      profilePic: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
      mediaUrls: [
        "https://res.cloudinary.com/demo/video/upload/v1631234567/sample_video.mp4",
        "https://res.cloudinary.com/demo/video/upload/v1631234568/sample_video_2.mp4"
      ],
    },
  });

  // 2. Create 2 Bands
  const band1 = await prisma.band.create({
    data: {
      name: "La Cumbia de Juan",
      bio: "La mejor cumbia de zona sur.",
      genre: "Cumbia Santafesina",
      city: "Quilmes",
      ownerId: user1.id,
      profilePic: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=800&fit=crop",
      coverPic: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop",
      mediaUrls: [
        "https://res.cloudinary.com/demo/video/upload/v1631234567/sample_video.mp4",
        "https://res.cloudinary.com/demo/video/upload/v1631234568/sample_video_2.mp4"
      ],
    },
  });

  const band2 = await prisma.band.create({
    data: {
      name: "Maria y sus Teclados",
      bio: "Ritmo y romance para toda la familia.",
      genre: "Cumbia Romántica",
      city: "Avellaneda",
      ownerId: user2.id,
      profilePic: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=800&fit=crop",
      coverPic: "https://images.unsplash.com/photo-1514525253361-bee243870eb2?w=1200&h=400&fit=crop",
      mediaUrls: [
        "https://res.cloudinary.com/demo/video/upload/v1631234567/sample_video.mp4",
        "https://res.cloudinary.com/demo/video/upload/v1631234568/sample_video_2.mp4"
      ],
    },
  });

  // 3. Create Invitations (Band Members)
  // Juan invites Pedro
  await prisma.bandMember.create({
    data: {
      bandId: band1.id,
      userId: user3.id,
      role: "Octapad",
      status: "PENDING",
    },
  });

  // Maria invites Laura
  await prisma.bandMember.create({
    data: {
      bandId: band2.id,
      userId: user4.id,
      role: "Voz",
      status: "PENDING",
    },
  });

  console.log("Seeding complete! 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
