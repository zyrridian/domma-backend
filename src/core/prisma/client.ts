import { PrismaClient } from "../../generated/prisma";

// Re-export all Prisma types from @prisma/client
export * from "../../generated/prisma";

// Export a singleton instance of Prisma Client
const prismaClient = new PrismaClient();
export default prismaClient;
