import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando script de entrega de sobres semanales (Optimizado)...");

  // 1. Obtener la fecha del lunes de la semana actual en Argentina (UTC-3)
  const nowStr = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
  const nowInArg = new Date(nowStr);

  const day = nowInArg.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const diff = day === 0 ? 6 : day - 1;

  const argMonday = new Date(nowInArg);
  argMonday.setDate(nowInArg.getDate() - diff);
  argMonday.setHours(0, 0, 0, 0);

  const mondayIsoStr = `${argMonday.getFullYear()}-${String(argMonday.getMonth() + 1).padStart(2, '0')}-${String(argMonday.getDate()).padStart(2, '0')}T00:00:00-03:00`;
  const currentWeekMondayUtc = new Date(mondayIsoStr);

  console.log(`Fecha actual en Argentina: ${nowStr}`);
  console.log(`Lunes de la semana actual (Argentina): ${mondayIsoStr}`);
  console.log(`Lunes en UTC: ${currentWeekMondayUtc.toISOString()}`);

  const now = new Date();

  // 2. Ejecutar la actualización masiva atómica y ultra rápida con updateMany
  // Esto incrementa en 1 el packBalance de todos los usuarios elegibles
  // y actualiza su lastWeeklyPackDate en una única operación de base de datos.
  const result = await prisma.user.updateMany({
    where: {
      OR: [
        { lastWeeklyPackDate: null },
        { lastWeeklyPackDate: { lt: currentWeekMondayUtc } }
      ]
    },
    data: {
      packBalance: { increment: 1 },
      lastWeeklyPackDate: now
    }
  });

  console.log(`Entrega completada con éxito. Se otorgaron sobres a ${result.count} usuarios.`);
}

main()
  .catch((e) => {
    console.error("Error en el script de entrega de sobres semanales:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
