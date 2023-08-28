import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined
};

const prismadb = new PrismaClient();

export default prismadb;