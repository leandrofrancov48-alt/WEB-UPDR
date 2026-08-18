import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando actualización de horarios para el Grupo J (Mundial 2026)...");

  // 1. Austria vs Jordania
  // Actualmente: 2026-06-16T21:00:00Z (June 16, 18:00 hs ART)
  // Debe ser: 2026-06-17T04:00:00Z (June 17, 01:00 hs ART)
  const match1 = await prisma.match.findFirst({
    where: {
      homeTeam: { name: "Austria" },
      awayTeam: { name: "Jordania" }
    }
  });
  if (match1) {
    await prisma.match.update({
      where: { id: match1.id },
      data: { matchDate: new Date("2026-06-17T04:00:00Z") }
    });
    console.log(`- Austria vs Jordania actualizado a: ${new Date("2026-06-17T04:00:00Z").toISOString()}`);
  } else {
    console.log("- No se encontró el partido Austria vs Jordania.");
  }

  // 2. Argelia vs Jordania
  // Actualmente: 2026-06-22T23:00:00Z (June 22, 20:00 hs ART)
  // Debe ser: 2026-06-23T03:00:00Z (June 23, 00:00 hs ART)
  const match2 = await prisma.match.findFirst({
    where: {
      homeTeam: { name: "Argelia" },
      awayTeam: { name: "Jordania" }
    }
  });
  if (match2) {
    await prisma.match.update({
      where: { id: match2.id },
      data: { matchDate: new Date("2026-06-23T03:00:00Z") }
    });
    console.log(`- Argelia vs Jordania actualizado a: ${new Date("2026-06-23T03:00:00Z").toISOString()}`);
  } else {
    console.log("- No se encontró el partido Argelia vs Jordania.");
  }

  // 3. Argelia vs Austria
  // Actualmente: 2026-06-28T22:00:00Z (June 28, 19:00 hs ART)
  // Debe ser: 2026-06-28T02:00:00Z (June 27, 23:00 hs ART)
  const match3 = await prisma.match.findFirst({
    where: {
      homeTeam: { name: "Argelia" },
      awayTeam: { name: "Austria" }
    }
  });
  if (match3) {
    await prisma.match.update({
      where: { id: match3.id },
      data: { matchDate: new Date("2026-06-28T02:00:00Z") }
    });
    console.log(`- Argelia vs Austria actualizado a: ${new Date("2026-06-28T02:00:00Z").toISOString()}`);
  } else {
    console.log("- No se encontró el partido Argelia vs Austria.");
  }

  console.log("¡Horarios actualizados exitosamente en la base de datos!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
