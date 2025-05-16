import { PrismaClient } from "../src/generated/prisma";
import { seedChallenges } from "./seeders/challenge.seeder";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");
  try {
    await seedChallenges();
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
