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

  // Summary
  async getChallengeSummary(userId: string): Promise<any> {
    const [active, completed, failed] = await Promise.all([
      this.prisma.challenge.count({
        where: {
          user_id: userId,
          status: "active",
        },
      }),
      this.prisma.challenge.count({
        where: {
          user_id: userId,
          status: "completed",
        },
      }),
      this.prisma.challenge.count({
        where: {
          user_id: userId,
          status: "failed",
        },
      }),
    ]);

    // Calculate total saved
    const totalSaved = await this.prisma.challenge.aggregate({
      where: {
        user_id: userId,
      },
      _sum: {
        current_amount: true,
      },
    });

    return {
      activeChallenges: active,
      completedChallenges: completed,
      failedChallenges: failed,
      totalSaved: Number(totalSaved._sum.current_amount || 0),
    };
  }

  // Completed challenges
  async findCompletedByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "completedDate",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{ challenges: any[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const orderByField =
      sortBy === "completedDate"
        ? "updated_at"
        : sortBy === "totalSaved"
        ? "current_amount"
        : sortBy === "consistency"
        ? "percent_complete"
        : "total_days";

    const [challenges, totalItems] = await Promise.all([
      this.prisma.challenge.findMany({
        where: {
          user_id: userId,
          status: "completed",
        },
        orderBy: {
          [orderByField]: sortOrder,
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
          status: "completed",
        },
      }),
    ]);

    return { challenges, totalItems };
  }

  // Find by status
  async findByStatus(userId: string, status: string): Promise<any[]> {
    return this.prisma.challenge.findMany({
      where: {
        user_id: userId,
        status: status,
      },
      include: {
        activities: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
    });
  }
}
