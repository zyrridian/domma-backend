import { RecurringTransaction, Transaction } from "@/generated/prisma";
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
      include: {
        recurring_transaction: true,
      },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        recurring_transaction: true,
      },
    });
  }

  async update(id: string, data: Transaction): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async createRecurring(
    data: RecurringTransaction
  ): Promise<RecurringTransaction> {
    return this.prisma.recurringTransaction.create({
      data,
    });
  }

  async updateRecurring(
    id: string,
    data: RecurringTransaction
  ): Promise<RecurringTransaction> {
    return this.prisma.recurringTransaction.update({
      where: { id },
      data,
    });
  }

  async findRecurringTransactionById(id: string): Promise<RecurringTransaction | null> {
    return this.prisma.recurringTransaction.findUnique({
      where: { id }
    });
  }
}
