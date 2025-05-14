export interface CreateTransactionDto {
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  transaction_date: string;
  transaction_time: string;
  payment_method: string;
  notes?: string;
  recurring?: CreateRecurringTransactionDto;
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
  recurring?: {
    id: string;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    end_type: "never" | "on_date" | "after_occurrences";
    end_date?: string;
    occurrences?: number;
  };
}

export interface UpdateTransactionDto {
  amount?: number;
  type?: "income" | "expense";
  description?: string;
  category?: string;
  transaction_date?: string;
  transaction_time?: string;
  payment_method?: string;
  notes?: string;
  recurring?: UpdateRecurringTransactionDto | boolean | null;
}

export interface CreateRecurringTransactionDto {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  end_type: "never" | "on_date" | "after_occurrences";
  end_date?: string;
  occurrences?: number;
}

export interface RecurringTransactionResponseDto {
  id: string;
  transaction_id: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  end_type: "never" | "on_date" | "after_occurrences";
  end_date?: string;
  occurrences?: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateRecurringTransactionDto {
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  end_type?: "never" | "on_date" | "after_occurrences";
  end_date?: string;
  occurrences?: number;
}

export interface TransactionSummaryDto {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
  period?: {
    startDate: string;
    endDate: string;
  };
}
