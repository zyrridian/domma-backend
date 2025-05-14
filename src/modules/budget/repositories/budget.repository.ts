import { Budget } from "@/generated/prisma";
import { PrismaClient } from "@prisma/client";
import prismaClient from "../../../core/prisma/client";

export class BudgetRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prismaClient;
  }

  async create(data: Budget): Promise<Budget> {
    return this.prisma.budget.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<Budget[]> {
    return this.prisma.budget.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  }

  async findById(id: string): Promise<Budget | null> {
    return this.prisma.budget.findUnique({
      where: { id },
    });
  }

  async findByCategory(userId: string, category: string): Promise<Budget[]> {
    return this.prisma.budget.findMany({
      where: {
        user_id: userId,
        category,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async update(id: string, data: Budget): Promise<Budget> {
    return this.prisma.budget.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Budget> {
    return this.prisma.budget.delete({
      where: { id },
    });
  }

  async findByMonthYear(userId: string, monthYear: string): Promise<Budget[]> {
    return this.prisma.budget.findMany({
      where: {
        user_id: userId,
        month_year: monthYear,
      },
      orderBy: {
        category: "asc",
      },
    });
  }

  async getUniqueBudgetCategories(userId: string): Promise<string[]> {
    const results = await this.prisma.budget.findMany({
      where: { user_id: userId },
      select: { category: true },
      distinct: ["category"],
    });

    return results.map((result: { category: string }) => result.category);
  }
}
