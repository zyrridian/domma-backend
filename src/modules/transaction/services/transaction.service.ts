import { TransactionRepository } from "../repositories/transaction.repository";
import {
  CreateTransactionDto,
  TransactionResponseDto,
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

    // Fetch the transaction
    const createdTransaction = await this.transactionRepository.findById(
      transaction.id
    );
    return this.mapTransactionToDto(createdTransaction as Transaction);
  }

  async getTransactionById(id: string): Promise<TransactionResponseDto | null> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) return null;
    return this.mapTransactionToDto(transaction);
  }

  async getTransactions(userId: string): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.findByUserId(userId);
    return transactions.map((transaction) =>
      this.mapTransactionToDto(transaction)
    );
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
    };
  }
}
