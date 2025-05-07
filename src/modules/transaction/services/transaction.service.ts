import { TransactionRepository } from "../repositories/transaction.repository";
import {
  CreateTransactionDto,
  TransactionResponseDto,
  UpdateTransactionDto,
  CreateRecurringTransactionDto,
  UpdateRecurringTransactionDto,
  TransactionSummaryDto,
} from "../dto/transaction.dto";
import { Decimal } from "@prisma/client/runtime/library";

// Define types based on Prisma schema
type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: Decimal;
  description: string;
  category: string;
  transaction_date: Date;
  transaction_time: Date;
  payment_method: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  recurring_transaction?: RecurringTransaction | null;
};

type RecurringTransaction = {
  id: string;
  transaction_id: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  end_type: "never" | "on_date" | "after_occurrences";
  end_date: Date | null;
  occurrences: number | null;
  created_at: Date;
  updated_at: Date;
};

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async createTransaction(
    userId: string,
    data: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    // Create a proper date from the date and time strings
    const dateStr = data.transaction_date;
    const timeStr = data.transaction_time;

    // For transaction_date, we only need the date part
    const transactionDate = new Date(dateStr);

    // For transaction_time, we need to create a time-only date
    const [hours, minutes, seconds = "00"] = timeStr.split(":");
    const transactionTime = new Date("1970-01-01"); // Use a base date
    transactionTime.setHours(parseInt(hours, 10));
    transactionTime.setMinutes(parseInt(minutes, 10));
    transactionTime.setSeconds(parseInt(seconds, 10));

    const transactionData = {
      user_id: userId,
      amount: new Decimal(data.amount.toString()),
      type: data.type,
      description: data.description,
      category: data.category,
      transaction_date: transactionDate,
      transaction_time: transactionTime,
      payment_method: data.payment_method,
      notes: data.notes || null,
    };

    const transaction = await this.transactionRepository.create(
      transactionData as any
    );

    // Create recurring transaction if provided
    if (data.recurring) {
      await this.transactionRepository.createRecurring({
        transaction: { connect: { id: transaction.id } },
        frequency: data.recurring.frequency,
        end_type: data.recurring.end_type,
        end_date: data.recurring.end_date
          ? new Date(data.recurring.end_date)
          : null,
        occurrences: data.recurring.occurrences || null,
      } as any);
    }

    // Fetch the transaction
    const createdTransaction = await this.transactionRepository.findById(
      transaction.id
    );
    return this.mapTransactionToDto(createdTransaction as Transaction);
  }

  async getTransactions(userId: string): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.findByUserId(userId);
    return transactions.map((transaction) =>
      this.mapTransactionToDto(transaction)
    );
  }

  async getTransactionById(id: string): Promise<TransactionResponseDto | null> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) return null;
    return this.mapTransactionToDto(transaction);
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionDto
  ): Promise<TransactionResponseDto> {
    const transactionData: any = {};

    if (data.amount !== undefined) transactionData.amount = data.amount;
    if (data.type !== undefined) transactionData.type = data.type;
    if (data.description !== undefined)
      transactionData.description = data.description;
    if (data.category !== undefined) transactionData.category = data.category;
    if (data.transaction_date !== undefined)
      transactionData.transaction_date = new Date(data.transaction_date);
    if (data.transaction_time !== undefined)
      transactionData.transaction_time = new Date(data.transaction_time);
    if (data.payment_method !== undefined)
      transactionData.payment_method = data.payment_method;
    if (data.notes !== undefined) transactionData.notes = data.notes;

    await this.transactionRepository.update(id, transactionData);
    const updatedTransaction = await this.transactionRepository.findById(id);
    return this.mapTransactionToDto(updatedTransaction as Transaction);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async addRecurringToTransaction(
    transactionId: string,
    data: CreateRecurringTransactionDto
  ): Promise<TransactionResponseDto> {
    // Check if transaction exists
    const transaction = await this.transactionRepository.findById(
      transactionId
    );

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Check if transaction already has recurring settings
    const typedTransaction = transaction as Transaction;
    if (typedTransaction.recurring_transaction) {
      throw new Error("Transaction already has recurring settings");
    }

    // Create recurring transaction
    await this.transactionRepository.createRecurring({
      transaction: { connect: { id: transactionId } },
      frequency: data.frequency,
      end_type: data.end_type,
      end_date: data.end_date ? new Date(data.end_date) : null,
      occurrences: data.occurrences || null,
    } as any);

    // Fetch updated transaction with recurring details
    const updatedTransaction = await this.transactionRepository.findById(
      transactionId
    );
    return this.mapTransactionToDto(updatedTransaction as Transaction);
  }

  async updateRecurringTransaction(
    id: string,
    data: UpdateRecurringTransactionDto
  ): Promise<TransactionResponseDto> {
    const recurringData: any = {};

    if (data.frequency !== undefined) recurringData.frequency = data.frequency;
    if (data.end_type !== undefined) recurringData.end_type = data.end_type;
    if (data.end_date !== undefined)
      recurringData.end_date = data.end_date ? new Date(data.end_date) : null;
    if (data.occurrences !== undefined)
      recurringData.occurrences = data.occurrences;

    await this.transactionRepository.updateRecurring(id, recurringData);

    // Find the recurring transaction to get its transaction_id
    const recurringTransaction =
      await this.transactionRepository.findRecurringTransactionById(id);

    if (!recurringTransaction) {
      throw new Error("Recurring transaction not found");
    }

    // Fetch the transaction with its recurring details
    const transaction = await this.transactionRepository.findById(
      recurringTransaction.transaction_id
    );

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return this.mapTransactionToDto(transaction as Transaction);
  }

  async getTransactionSummary(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<TransactionSummaryDto> {
    // If no date parameters are provided, get summary for all transactions
    if (!startDate || !endDate) {
      const summary = await this.transactionRepository.getTransactionSummary(
        userId
      );

      return {
        totalIncome: summary.totalIncome,
        totalExpense: summary.totalExpense,
        balance: summary.balance,
        transactionCount: summary.transactionCount,
        incomeCount: summary.incomeCount,
        expenseCount: summary.expenseCount,
      };
    }

    // If date parameters are provided, get summary for the specified period
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    // Get transactions for the period
    const transactions =
      await this.transactionRepository.getTransactionsByPeriod(
        userId,
        start,
        end
      );

    // Calculate summary
    const summary = transactions.reduce(
      (
        acc: {
          totalIncome: number;
          totalExpense: number;
          incomeCount: number;
          expenseCount: number;
        },
        transaction: any
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

    const balance = summary.totalIncome - summary.totalExpense;
    const transactionCount = summary.incomeCount + summary.expenseCount;

    return {
      ...summary,
      balance,
      transactionCount,
      period: {
        startDate,
        endDate,
      },
    };
  }

  // Helper method to map Transaction to TransactionResponseDto
  private mapTransactionToDto(
    transaction: Transaction
  ): TransactionResponseDto {
    return {
      id: transaction.id,
      user_id: transaction.user_id,
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description,
      category: transaction.category,
      transaction_date: transaction.transaction_date
        .toISOString()
        .split("T")[0],
      transaction_time: transaction.transaction_time
        .toTimeString()
        .split(" ")[0],
      payment_method: transaction.payment_method,
      notes: transaction.notes || undefined,
      created_at: transaction.created_at.toISOString(),
      updated_at: transaction.updated_at.toISOString(),
      recurring: transaction.recurring_transaction
        ? {
            id: transaction.recurring_transaction.id,
            frequency: transaction.recurring_transaction.frequency,
            end_type: transaction.recurring_transaction.end_type,
            end_date: transaction.recurring_transaction.end_date
              ? transaction.recurring_transaction.end_date
                  .toISOString()
                  .split("T")[0]
              : undefined,
            occurrences:
              transaction.recurring_transaction.occurrences || undefined,
          }
        : undefined,
    };
  }
}
