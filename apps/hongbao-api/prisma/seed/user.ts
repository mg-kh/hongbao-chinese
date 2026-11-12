import { PrismaClient } from '@prisma/client';

export const ADMIN_USER_ID = '6e9b241c-1156-4014-aaad-dc13f6008f7c';

/**
 * -----------------------
 * Admin User
 * -----------------------
 */
export async function seedAdminUser(prisma: PrismaClient): Promise<string> {
  await prisma.user.upsert({
    where: { id: ADMIN_USER_ID },
    update: {},
    create: {
      id: ADMIN_USER_ID,
      name: 'Kaung Htet Lynn',
      clerkId: 'user_3DVNWlSDsSGZiPmqzAf5NcQMnYO',
      email: 'dev.kaunghtet@gmail.com',
      role: 'ADMIN',
    },
  });

  return ADMIN_USER_ID;
}
