export interface DashboardSummaryDto {
  balance: number;
  balanceChange: number;
  income: number;
  expenses: number;
  remaining: number;
  goalTarget: number;
  goalProgress: number;
}

export interface DashboardPredictionDto {
  predictedExpenses: number;
  expenseChangePercent: number;
  topExpenseCategory: string;
  topExpensePercentage: number;
  recommendedSavings: number;
}

export interface DailyTipDto {
  title: string;
  content: string;
}

export interface DashboardDataDto {
  summary: DashboardSummaryDto;
  prediction: DashboardPredictionDto;
  tip: DailyTipDto;
}
