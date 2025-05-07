import { Transaction } from "@/generated/prisma";
import { PrismaClient } from "@prisma/client";
import prismaClient from "../../../core/prisma/client";

export class TransactionRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prismaClient;
  }
  async create(data: Transaction): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { transaction_date: "desc" },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }
}
