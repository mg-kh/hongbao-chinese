import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

export const pool = new Pool({ connectionString });
export const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
