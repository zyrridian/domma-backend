import { PrismaClient } from "@prisma/client";
import prismaClient from "../../../core/prisma/client";

export class ChallengeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prismaClient;
  }

  // Challenge CRUD operations
  async create(data: any): Promise<any> {
    return this.prisma.challenge.create({
      data,
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.challenge.findUnique({
      where: { id },
      include: {
        activities: true,
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.challenge.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.challenge.delete({
      where: { id },
    });
  }

  // Active challenges
  async findActiveByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ challenges: any[]; totalItems: number }> {
    const skip = (page - 1) * limit;

    const [challenges, totalItems] = await Promise.all([
      this.prisma.challenge.findMany({
        where: {
          user_id: userId,
          status: "active",
        },
        orderBy: {
          end_date: "asc",
        },
        include: {
          activities: {
            orderBy: {
              date: "desc",
            },
            take: 1,
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.challenge.count({
        where: {
          user_id: userId,
          status: "active",
        },
      }),
    ]);

    return { challenges, totalItems };
  }

  // Challenge activities
  async createActivity(data: any): Promise<any> {
    return this.prisma.challengeActivity.create({
      data,
    });
  }
}
