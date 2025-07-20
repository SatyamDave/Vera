import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Create some sample posts
  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Welcome to VERA',
      createdById: user.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Getting Started with AI Code Generation',
      createdById: user.id,
    },
  });

  console.log({ user, post1, post2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 