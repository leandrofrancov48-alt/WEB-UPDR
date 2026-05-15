import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating test bands with social links...");

  const bands = await prisma.band.findMany();

  for (const band of bands) {
    if (band.name === "La Cumbia de Juan") {
      await prisma.band.update({
        where: { id: band.id },
        data: {
          instagram: "lacumbiadejuan",
          spotify: "https://open.spotify.com/artist/sample",
          youtube: "https://youtube.com/sample_juan",
        }
      });
    } else if (band.name === "Maria y sus Teclados") {
      await prisma.band.update({
        where: { id: band.id },
        data: {
          instagram: "mariayteclados",
          youtube: "https://youtube.com/sample_maria",
        }
      });
    }
  }

  console.log("Bands updated! ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
