import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL ?? "prisma://localhost";

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
