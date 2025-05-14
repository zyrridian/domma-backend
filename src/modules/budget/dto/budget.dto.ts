export interface CreateBudgetDto {
  category: string;
  amount: number;
  month_year: string;
  notes?: string;
}

export interface UpdateBudgetDto {
  category?: string;
  amount?: number;
  month_year?: string;
  notes?: string;
}

export interface BudgetResponseDto {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  month_year: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetSummaryDto {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  month_year?: string;
}
