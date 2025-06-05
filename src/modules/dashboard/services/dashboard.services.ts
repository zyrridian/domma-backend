import { TransactionRepository } from "../../transaction/repositories/transaction.repository";
import { BudgetRepository } from "../../budget/repositories/budget.repository";
import { Decimal } from "@prisma/client/runtime/library";
import {
  DailyTipDto,
  DashboardDataDto,
  DashboardPredictionDto,
  DashboardSummaryDto,
} from "../dto/dashboard.dto";

export class DashboardService {
  private transactionRepository: TransactionRepository;
  private budgetRepository: BudgetRepository;
  private tips: DailyTipDto[];

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.budgetRepository = new BudgetRepository();

    // Predefined financial tips
    this.tips = [
      {
        title: "The 50/30/20 Rule for Student Budgeting",
        content:
          "Allocate 50% of your income to needs (rent, groceries), 30% to wants (entertainment), and 20% to savings and debt payments. This simple rule can help you maintain financial balance while enjoying college life.",
      },
      {
        title: "Track Every Expense",
        content:
          "Keep track of all your expenses, no matter how small. Use apps or a simple notebook to record everything you spend. This awareness will help you identify areas where you can cut back.",
      },
      {
        title: "Build an Emergency Fund",
        content:
          "Even as a student, try to save at least 3 months of essential expenses. Start small and be consistent with your savings to create a financial safety net.",
      },
      {
        title: "Use Student Discounts",
        content:
          "Your student ID can save you money on everything from software to movie tickets. Always ask if student discounts are available before making a purchase.",
      },
      {
        title: "Cook at Home",
        content:
          "Eating out can quickly drain your budget. Learning to cook simple meals at home can save you thousands over your college years while also teaching you a valuable life skill.",
      },
    ];
  }

  /**
   * Get all dashboard data in a single call
   */
  async getDashboardData(userId: string): Promise<DashboardDataDto> {
    const summary = await this.getDashboardSummary(userId);
    const prediction = await this.getDashboardPrediction(userId);
    const tip = await this.getDailyTip();

    return {
      summary,
      prediction,
      tip,
    };
  }

  /**
   * Get financial summary data for the dashboard
   */
  async getDashboardSummary(userId: string): Promise<DashboardSummaryDto> {
    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // Get previous month
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const prevYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const prevMonthYear = `${prevYear}-${String(prevMonth + 1).padStart(
      2,
      "0"
    )}`;

    // Get current month transactions
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const transactions =
      await this.transactionRepository.getTransactionsByPeriod(
        userId,
        startDate,
        endDate
      );

    // Calculate income and expenses for current month
    let income = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        income += Number(t.amount);
      } else {
        expenses += Number(t.amount);
      }
    });

    const remaining = income - expenses;
    const balance = income - expenses; // Simplified for now, could be cumulative

    // Get previous month transactions for comparison
    const prevStartDate = new Date(prevYear, prevMonth, 1);
    const prevEndDate = new Date(prevYear, prevMonth + 1, 0);
    const prevTransactions =
      await this.transactionRepository.getTransactionsByPeriod(
        userId,
        prevStartDate,
        prevEndDate
      );

    // Calculate previous month balance
    let prevIncome = 0;
    let prevExpenses = 0;

    prevTransactions.forEach((t) => {
      if (t.type === "income") {
        prevIncome += Number(t.amount);
      } else {
        prevExpenses += Number(t.amount);
      }
    });

    const prevBalance = prevIncome - prevExpenses;

    // Calculate balance change percentage
    let balanceChange = 0;
    if (prevBalance !== 0) {
      balanceChange = Math.round(
        ((balance - prevBalance) / Math.abs(prevBalance)) * 100
      );
    }

    // Get savings goal data (simplified)
    const goalTarget = 1000000; // Default target
    const goalProgress = Math.min(
      Math.round((balance / goalTarget) * 100),
      100
    );

    return {
      balance,
      balanceChange,
      income,
      expenses,
      remaining,
      goalTarget,
      goalProgress,
    };
  }

  /**
   * Get prediction data for next month
   */
  async getDashboardPrediction(
    userId: string
  ): Promise<DashboardPredictionDto> {
    // Get current month in YYYY-MM format
    const now = new Date();

    // Get transactions from the last 3 months for prediction
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions =
      await this.transactionRepository.getTransactionsByPeriod(
        userId,
        threeMonthsAgo,
        endDate
      );

    // Calculate average monthly expenses
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    // Simple prediction: average of last 3 months + 5%
    const avgMonthlyExpenses = totalExpenses / 3;
    const predictedExpenses = Math.round(avgMonthlyExpenses * 1.05);
    const expenseChangePercent = 5; // Simplified

    // Find top expense category
    const categoryExpenses: Record<string, number> = {};

    expenseTransactions.forEach((t) => {
      const category = t.category.toLowerCase();
      if (!categoryExpenses[category]) {
        categoryExpenses[category] = 0;
      }
      categoryExpenses[category] += Number(t.amount);
    });

    let topExpenseCategory = "Other";
    let topExpenseAmount = 0;

    Object.entries(categoryExpenses).forEach(([category, amount]) => {
      if (amount > topExpenseAmount) {
        topExpenseCategory = category;
        topExpenseAmount = amount;
      }
    });

    // Calculate percentage of top category
    const topExpensePercentage = Math.round(
      (topExpenseAmount / totalExpenses) * 100
    );

    // Calculate recommended savings (20% of average income)
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const totalIncome = incomeTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );
    const avgMonthlyIncome = totalIncome / 3;
    const recommendedSavings = Math.round(avgMonthlyIncome * 0.2);

    return {
      predictedExpenses,
      expenseChangePercent,
      topExpenseCategory:
        topExpenseCategory.charAt(0).toUpperCase() +
        topExpenseCategory.slice(1),
      topExpensePercentage,
      recommendedSavings,
    };
  }

  /**
   * Get a daily financial tip
   */
  async getDailyTip(): Promise<DailyTipDto> {
    // Get a random tip from the predefined list
    const randomIndex = Math.floor(Math.random() * this.tips.length);
    return this.tips[randomIndex];
  }
}
