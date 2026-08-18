import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const usernames = ['paletc73', 'turco', 'luchete91'];

    const users = await prisma.user.findMany({
      where: {
        username: {
          in: usernames,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        username: true,
        nombre: true,
        apellido: true,
        email: true,
        celular: true,
        dni: true,
        birthDate: true,
        createdAt: true
      }
    });

    console.log('FOUND_USERS:', JSON.stringify(users, null, 2));

    // If any is missing, do a broader search
    if (users.length < usernames.length) {
      console.log('Searching by name/email contains...');
      for (const u of usernames) {
        const found = users.find(x => x.username.toLowerCase() === u.toLowerCase());
        if (!found) {
          const possible = await prisma.user.findMany({
            where: {
              OR: [
                { username: { contains: u, mode: 'insensitive' } },
                { email: { contains: u, mode: 'insensitive' } },
                { nombre: { contains: u, mode: 'insensitive' } },
                { apellido: { contains: u, mode: 'insensitive' } }
              ]
            },
            select: {
              id: true,
              username: true,
              nombre: true,
              apellido: true,
              email: true,
              celular: true,
              dni: true,
              birthDate: true,
              createdAt: true
            }
          });
          console.log(`POSSIBLE_MATCHES_FOR_${u}:`, JSON.stringify(possible, null, 2));
        }
      }
    }

  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
