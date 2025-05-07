export interface CreateTransactionDto {
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  transaction_date: string;
  transaction_time: string;
  payment_method: string;
  notes?: string;
}

export interface TransactionResponseDto {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  transaction_time: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
