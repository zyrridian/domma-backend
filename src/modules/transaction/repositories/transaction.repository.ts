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

  async deleteRecurring(id: string): Promise<RecurringTransaction> {
    return this.prisma.recurringTransaction.delete({
      where: { id },
    });
  }

  async findRecurringTransactionById(
    id: string
  ): Promise<RecurringTransaction | null> {
    return this.prisma.recurringTransaction.findUnique({
      where: { id },
    });
  }

  async getTransactionSummary(userId: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
    incomeCount: number;
    expenseCount: number;
  }> {
    // Get all transactions for the user
    const transactions = await this.prisma.transaction.findMany({
      where: { user_id: userId },
      select: {
        type: true,
        amount: true,
      },
    });

    // Calculate summary
    const summary = transactions.reduce(
      (
        acc: {
          totalIncome: number;
          totalExpense: number;
          incomeCount: number;
          expenseCount: number;
        },
        transaction: { type: string; amount: any }
      ) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
          acc.totalIncome += amount;
          acc.incomeCount++;
        } else {
          acc.totalExpense += amount;
          acc.expenseCount++;
        }

        return acc;
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        incomeCount: 0,
        expenseCount: 0,
      }
    );

    // Calculate balance
    const balance = summary.totalIncome - summary.totalExpense;
    const transactionCount = summary.incomeCount + summary.expenseCount;

    return {
      ...summary,
      balance,
      transactionCount,
    };
  }

  async getTransactionsByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        user_id: userId,
        transaction_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        transaction_date: "desc",
      },
      include: {
        recurring_transaction: true,
      },
    });
  }
}
