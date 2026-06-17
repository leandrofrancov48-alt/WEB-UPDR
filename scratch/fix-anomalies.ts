import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando corrección de anomalías residuales en la base de datos...");

  // 1. Corregir a nahuelgino (nahuelginop@gmail.com)
  const user1 = await prisma.user.findFirst({
    where: { username: "nahuelgino" }
  });

  if (user1) {
    console.log(`\nEncontrado nahuelgino:`);
    console.log(`- Antes: pack3Balance=${user1.pack3Balance}, show40PtsNotification=${user1.show40PtsNotification}`);
    
    await prisma.user.update({
      where: { id: user1.id },
      data: {
        pack3Balance: 0,
        show40PtsNotification: false
      }
    });
    console.log(`- Después: pack3Balance=0, show40PtsNotification=false`);
  } else {
    console.log("No se encontró al usuario nahuelgino");
  }

  // 2. Corregir a andres28 (soriaandres454@gmail.com)
  const user2 = await prisma.user.findFirst({
    where: { username: "andres28" }
  });

  if (user2) {
    console.log(`\nEncontrado andres28:`);
    console.log(`- Antes: pack2Balance=${user2.pack2Balance}, show20PtsNotification=${user2.show20PtsNotification}`);
    
    await prisma.user.update({
      where: { id: user2.id },
      data: {
        pack2Balance: 0,
        show20PtsNotification: false
      }
    });
    console.log(`- Después: pack2Balance=0, show20PtsNotification=false`);
  } else {
    console.log("No se encontró al usuario andres28");
  }

  console.log("\n¡Anomalías corregidas exitosamente!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
