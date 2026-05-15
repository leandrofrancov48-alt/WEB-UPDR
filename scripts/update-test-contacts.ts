import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating test musicians with contact data...");

  await prisma.user.updateMany({
    where: { 
      email: { in: ["juan@test.com", "maria@test.com", "pedro@test.com", "laura@test.com"] } 
    },
    data: {
      celular: "+5491112345678",
      showContactPhone: true,
      showPersonalData: true,
    }
  });

  console.log("Musicians updated! ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
