import 'dotenv/config';
import { pool, prisma } from './seed/client';
import { seedAdminUser } from './seed/user';
import { seedCourses } from './seed/course';

async function main() {
  const userId = await seedAdminUser(prisma);
  await seedCourses(prisma, userId);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('Seeding successful....');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
