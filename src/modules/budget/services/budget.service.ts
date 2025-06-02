import { BudgetRepository } from "../repositories/budget.repository";
import {
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetResponseDto,
  BudgetSummaryDto,
} from "../dto/budget.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionRepository } from "../../transaction/repositories/transaction.repository";

interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: Decimal;
  spent: Decimal;
  month_year: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export class BudgetService {
  private budgetRepository: BudgetRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.budgetRepository = new BudgetRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createBudget(
    userId: string,
    data: CreateBudgetDto
  ): Promise<BudgetResponseDto> {
    const budgetData = {
      user_id: userId,
      amount: new Decimal(data.amount.toString()),
      spent: new Decimal(0), // Initial spent is 0
      category: data.category,
      month_year: data.month_year,
      notes: data.notes || null,
    };

    const budget = await this.budgetRepository.create(budgetData as any);
    return this.mapBudgetToDto(budget as Budget);
  }

  async getBudgets(userId: string, filters?: { category?: string; month_year?: string }): Promise<BudgetResponseDto[]> {
    let budgets: any[] = [];
    
    if (filters?.month_year) {
      // If month_year filter is provided, get budgets for that month
      budgets = await this.budgetRepository.findByMonthYear(userId, filters.month_year);
    } else {
      // Otherwise get all budgets
      budgets = await this.budgetRepository.findByUserId(userId);
    }

    // Apply category filter if provided
    if (filters?.category && filters.category !== 'all') {
      budgets = budgets.filter(budget => 
        budget.category.toLowerCase() === filters?.category?.toLowerCase()
      );
    }

    // Process each budget to calculate spending
    for (const budget of budgets) {
      await this.updateBudgetSpentAmount(budget);
    }

    return budgets.map((budget) => this.mapBudgetToDto(budget as Budget));
  }

  async getBudgetById(id: string): Promise<BudgetResponseDto | null> {
    const budget = await this.budgetRepository.findById(id);
    if (!budget) return null;

    // Update the spent amount
    await this.updateBudgetSpentAmount(budget);

    // Return the updated budget
    return this.mapBudgetToDto(budget as Budget);
  }

  async updateBudget(
    id: string,
    data: UpdateBudgetDto
  ): Promise<BudgetResponseDto> {
    const budgetData: any = {};

    if (data.amount !== undefined)
      budgetData.amount = new Decimal(data.amount.toString());
    if (data.category !== undefined) budgetData.category = data.category;
    if (data.month_year !== undefined) budgetData.month_year = data.month_year;
    if (data.notes !== undefined) budgetData.notes = data.notes;

    await this.budgetRepository.update(id, budgetData);
    const updatedBudget = await this.budgetRepository.findById(id);

    if (!updatedBudget) {
      throw new Error("Budget not found after update");
    }

    // Update the spent amount
    await this.updateBudgetSpentAmount(updatedBudget);

    return this.mapBudgetToDto(updatedBudget as Budget);
  }

  async deleteBudget(id: string): Promise<void> {
    await this.budgetRepository.delete(id);
  }

  async getBudgetSummary(
    userId: string,
    month_year?: string
  ): Promise<BudgetSummaryDto> {
    // If month_year is not provided, use current month
    if (!month_year) {
      const currentDate = new Date();
      month_year = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;
    }

    // Get budgets for the month
    const budgets = await this.budgetRepository.findByMonthYear(
      userId,
      month_year
    );

    // If no budgets found for the current month, get all budgets
    let budgetsToUse = budgets;
    if (budgets.length === 0) {
      budgetsToUse = await this.budgetRepository.findByUserId(userId);
    }

    // Update spent amounts for all budgets
    for (const budget of budgetsToUse) {
      await this.updateBudgetSpentAmount(budget);
    }

    // Calculate totals
    const totalBudget = budgetsToUse.reduce(
      (sum, budget) => sum + Number(budget.amount),
      0
    );
    const totalSpent = budgetsToUse.reduce(
      (sum, budget) => sum + Number(budget.spent),
      0
    );

    // Prepare the response
    return {
      totalBudget,
      totalSpent,
      remaining: Math.max(0, totalBudget - totalSpent),
      month_year,
    };
  }

  async getActiveBudgets(userId: string): Promise<BudgetResponseDto[]> {
    // Get current month in YYYY-MM format
    const currentDate = new Date();
    const currentMonthYear = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    // Get budgets for current month
    const budgets = await this.budgetRepository.findByMonthYear(
      userId,
      currentMonthYear
    );

    // Update spent amounts
    for (const budget of budgets) {
      await this.updateBudgetSpentAmount(budget);
    }

    return budgets.map((budget) => this.mapBudgetToDto(budget as Budget));
  }

  // Helper method to update the spent amount for a budget
  private async updateBudgetSpentAmount(budget: any): Promise<void> {
    const [year, month] = budget.month_year.split("-").map(Number);

    // Create start and end date for the month
    const startDate = new Date(year, month - 1, 1); // Months are 0-based in JS Date
    const endDate = new Date(year, month, 0); // Last day of month

    // Get transactions for the month
    const transactions =
      await this.transactionRepository.getTransactionsByPeriod(
        budget.user_id,
        startDate,
        endDate
      );

    // Calculate spending for this budget's category
    const categoryLowerCase = budget.category.toLowerCase();

    // Find matching transactions with case-insensitive comparison
    let spent = 0;
    const matchingTransactions = transactions.filter((t) => {
      return (
        t.type === "expense" && t.category.toLowerCase() === categoryLowerCase
      );
    });

    matchingTransactions.forEach((t) => {
      spent += Number(t.amount);
    });

    // Update the spent amount in the database if it has changed
    if (Number(budget.spent) !== spent) {
      await this.budgetRepository.update(budget.id, {
        spent: new Decimal(spent.toString()),
      } as any);
      budget.spent = new Decimal(spent.toString());
    }
  }

  // Helper method to map Budget to BudgetResponseDto
  private mapBudgetToDto(budget: Budget): BudgetResponseDto {
    const amount = Number(budget.amount);
    const spent = Number(budget.spent);
    const remaining = Math.max(0, amount - spent);

    return {
      id: budget.id,
      user_id: budget.user_id,
      category: budget.category,
      amount: amount,
      spent: spent,
      remaining: remaining,
      month_year: budget.month_year,
      notes: budget.notes || undefined,
      created_at: budget.created_at.toISOString(),
      updated_at: budget.updated_at.toISOString(),
    };
  }
}
