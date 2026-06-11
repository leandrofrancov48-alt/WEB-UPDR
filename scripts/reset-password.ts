import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("Uso: npx tsx scripts/reset-password.ts <email_o_usuario> <nueva_contraseña>");
    process.exit(1);
  }

  const loginInput = args[0].trim().toLowerCase();
  const newPassword = args[1].trim();

  if (newPassword.length < 8) {
    console.log("Error: La nueva contraseña debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const isEmail = loginInput.includes("@");
  const user = await prisma.user.findFirst({
    where: isEmail ? { email: loginInput } : { username: loginInput }
  });

  if (!user) {
    console.log(`Error: No se encontró ningún usuario con el ${isEmail ? "email" : "nombre de usuario"}: "${loginInput}"`);
    process.exit(1);
  }

  console.log(`Generando hash de contraseña para ${user.nombre} ${user.apellido} (@${user.username})...`);
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  console.log("----------------------------------------");
  console.log(`¡Contraseña actualizada con éxito!`);
  console.log(`Usuario: @${user.username} (${user.email})`);
  console.log(`Nueva contraseña: ${newPassword}`);
  console.log("----------------------------------------");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
