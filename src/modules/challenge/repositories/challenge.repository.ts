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
      // include: {
      //   activities: true,
      // },
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

    const [userChallenges, totalItems] = await Promise.all([
      this.prisma.userChallenge.findMany({
        where: {
          user_id: userId,
          status: "active",
        },
        orderBy: {
          end_date: "asc",
        },
        include: {
          challenge: true,
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
      this.prisma.userChallenge.count({
        where: {
          user_id: userId,
          status: "active",
        },
      }),
    ]);

    return { challenges: userChallenges, totalItems };
  }

  // All challenges
  async getChallenges(
    page: number = 1,
    limit: number = 10
  ): Promise<{ challenges: any[]; totalItems: number }> {
    const skip = (page - 1) * limit;

    const [challenges, totalItems] = await Promise.all([
      this.prisma.challenge.findMany({
        // orderBy: {
        //   end_date: "asc",
        // },
        // include: {
        //   activities: {
        //     orderBy: {
        //       date: "desc",
        //     },
        //     take: 1,
        //   },
        // },
        skip,
        take: limit,
      }),
      this.prisma.challenge.count(),
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
      this.prisma.userChallenge.count({
        where: {
          user_id: userId,
          status: "active",
        },
      }),
      this.prisma.userChallenge.count({
        where: {
          user_id: userId,
          status: "completed",
        },
      }),
      this.prisma.userChallenge.count({
        where: {
          user_id: userId,
          status: "failed",
        },
      }),
    ]);

    // Calculate total saved
    const totalSaved = await this.prisma.userChallenge.aggregate({
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
    return this.prisma.userChallenge.findMany({
      where: {
        user_id: userId,
        status: status,
      },
      include: {
        challenge: true,
        activities: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
    });
  }

  // Challenge catalog
  async findCatalogItems(
    page: number = 1,
    limit: number = 10,
    filters: { type?: string; difficulty?: number; category?: string } = {}
  ): Promise<{ catalogItems: any[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.type) where.type = filters.type;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.category) where.category = filters.category;

    const [catalogItems, totalItems] = await Promise.all([
      this.prisma.challengeCatalog.findMany({
        where,
        orderBy: {
          difficulty: "asc",
        },
        skip,
        take: limit,
      }),
      this.prisma.challengeCatalog.count({
        where,
      }),
    ]);

    return { catalogItems, totalItems };
  }

  async findActivitiesByChallengeId(
    challengeId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ activities: any[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const where: any = { challenge_id: challengeId };

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      where.date = {
        gte: startDate,
      };
    } else if (endDate) {
      where.date = {
        lte: endDate,
      };
    }

    const [activities, totalItems] = await Promise.all([
      this.prisma.challengeActivity.findMany({
        where,
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.challengeActivity.count({
        where,
      }),
    ]);

    return { activities, totalItems };
  }

  // Statistics
  async getUserChallengeStats(userId: string, period?: string): Promise<any> {
    const whereClause: any = {
      user_id: userId,
      status: "completed",
    };

    if (period && period !== "all-time") {
      const today = new Date();
      const startDate = new Date();

      if (period === "yearly") {
        startDate.setFullYear(today.getFullYear() - 1);
      } else if (period === "monthly") {
        startDate.setMonth(today.getMonth() - 1);
      }

      whereClause.updated_at = {
        gte: startDate,
      };
    }

    // Get completed challenges for the period
    const completedChallenges = await this.prisma.challenge.findMany({
      where: whereClause,
      include: {
        activities: {
          where: {
            completed: true,
          },
          select: {
            date: true,
          },
        },
      },
    });

    // Prepare the stats
    const totalCompleted = completedChallenges.length;
    let totalSaved = 0;
    let totalDays = 0;
    let totalConsistency = 0;

    completedChallenges.forEach((challenge: any) => {
      totalSaved += Number(challenge.current_amount);
      totalDays += challenge.total_days;
      totalConsistency += Number(challenge.percent_complete);
    });

    // Return the stats
    return {
      totalCompleted,
      totalSaved,
      totalDays,
      averageConsistency:
        totalCompleted > 0 ? totalConsistency / totalCompleted : 0,
    };
  }

  // Badges
  async findBadges(): Promise<any[]> {
    return this.prisma.challengeBadge.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findUserBadges(userId: string): Promise<any[]> {
    return this.prisma.userBadge.findMany({
      where: {
        user_id: userId,
      },
      include: {
        badge: true,
      },
    });
  }

  async awardBadge(userId: string, badgeId: string): Promise<any> {
    return this.prisma.userBadge.create({
      data: {
        user_id: userId,
        badge_id: badgeId,
      },
    });
  }

  // Challenge options
  async getChallengeOptions(): Promise<any[]> {
    return this.prisma.challengeCatalog.findMany({
      select: {
        title: true,
        description: true,
        type: true,
        duration: true,
      },
      orderBy: {
        difficulty: "asc",
      },
    });
  }

  // Categories
  async getChallengeCategories(): Promise<string[]> {
    const categories = await this.prisma.challengeCatalog.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      orderBy: {
        category: "asc",
      },
    });

    return categories.map((c: { category: string }) => c.category);
  }

  // UserChallenge operations
  async createUserChallenge(data: any): Promise<any> {
    return this.prisma.userChallenge.create({
      data,
      include: {
        challenge: true,
      },
    });
  }

  async findUserChallengeById(id: string): Promise<any | null> {
    return this.prisma.userChallenge.findUnique({
      where: { id },
      include: {
        challenge: true,
        activities: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });
  }

  async findUserChallengeByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<any | null> {
    return this.prisma.userChallenge.findFirst({
      where: {
        user_id: userId,
        challenge_id: challengeId,
      },
      include: {
        challenge: true,
      },
    });
  }

  async updateUserChallenge(id: string, data: any): Promise<any> {
    return this.prisma.userChallenge.update({
      where: { id },
      data,
      include: {
        challenge: true,
      },
    });
  }

  async deleteUserChallenge(id: string): Promise<any> {
    return this.prisma.userChallenge.delete({
      where: { id },
    });
  }

  // Find activity by date and user challenge
  async findActivityByDateAndUserChallenge(
    userChallengeId: string,
    date: Date
  ): Promise<any | null> {
    // Convert date to YYYY-MM-DD format for comparison
    const formattedDate = date.toISOString().split("T")[0];

    // Use multiple approaches to ensure we catch duplicate check-ins
    try {
      // Method 1: Using string comparison via raw SQL
      const rawResult = await this.prisma.$queryRaw`
        SELECT * FROM "ChallengeActivity" 
        WHERE "userChallengeId" = ${userChallengeId} 
        AND DATE("date") = DATE(${formattedDate})
        LIMIT 1
      `;

      if (Array.isArray(rawResult) && rawResult.length > 0) {
        return rawResult[0];
      }

      // Method 2: Using equals with normalized date as backup
      return this.prisma.challengeActivity.findFirst({
        where: {
          userChallengeId: userChallengeId,
          date: {
            equals: new Date(formattedDate),
          },
        },
      });
    } catch (error) {
      console.error("Error checking for existing activity:", error);

      // Fallback to the safest method
      return this.prisma.challengeActivity.findFirst({
        where: {
          userChallengeId: userChallengeId,
          date: {
            gte: new Date(`${formattedDate}T00:00:00.000Z`),
            lt: new Date(`${formattedDate}T23:59:59.999Z`),
          },
        },
      });
    }
  }

  // Find activities by user challenge ID
  async findActivitiesByUserChallengeId(
    userChallengeId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ activities: any[]; totalItems: number }> {
    const skip = (page - 1) * limit;

    const [activities, totalItems] = await Promise.all([
      this.prisma.challengeActivity.findMany({
        where: {
          userChallengeId: userChallengeId,
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.challengeActivity.count({
        where: {
          userChallengeId: userChallengeId,
        },
      }),
    ]);

    return { activities, totalItems };
  }
}
