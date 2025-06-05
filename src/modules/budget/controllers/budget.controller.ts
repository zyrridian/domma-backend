import Hapi from "@hapi/hapi";
import { BudgetService } from "../services/budget.service";

/**
 * Controller for budget-related operations.
 * Handles creating, reading, updating, and deleting budgets.
 */
export class BudgetController {
  private budgetService: BudgetService;

  constructor() {
    this.budgetService = new BudgetService();
  }

  /**
   * Create a new budget
   */
  createBudget = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const budget = await this.budgetService.createBudget(
        userId,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Budget created successfully!",
          data: budget,
        })
        .code(201);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get all budgets for the user
   */
  getBudgets = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const query = request.query as any;
      
      // Extract filter parameters
      const filters = {
        category: query.category,
        month_year: query.month_year
      };
      
      const budgets = await this.budgetService.getBudgets(userId, filters);

      return h
        .response({
          status: true,
          message: "Budgets fetched successfully!",
          data: { budgets },
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  getBudgetById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const budget = await this.budgetService.getBudgetById(id);

      if (!budget) {
        return h
          .response({
            status: false,
            message: "Budget not found",
          })
          .code(404);
      }

      // Check if the budget belongs to the authenticated user
      if (budget.user_id !== (request.auth.credentials.id as string)) {
        return h
          .response({
            status: false,
            message: "You are not authorized to view this budget",
          })
          .code(403);
      }

      return h
        .response({
          status: true,
          message: "Budget fetched successfully!",
          data: budget,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  updateBudget = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const existingBudget = await this.budgetService.getBudgetById(id);

      if (!existingBudget) {
        return h
          .response({
            status: false,
            message: "Budget not found",
          })
          .code(404);
      }

      if (existingBudget.user_id !== userId) {
        return h
          .response({
            status: false,
            message: "You are not authorized to update this budget",
          })
          .code(403);
      }

      const updatedBudget = await this.budgetService.updateBudget(
        id,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Budget updated successfully!",
          data: updatedBudget,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  deleteBudget = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const existingBudget = await this.budgetService.getBudgetById(id);

      if (!existingBudget) {
        return h
          .response({
            status: false,
            message: "Budget not found",
          })
          .code(404);
      }

      if (existingBudget.user_id !== userId) {
        return h
          .response({
            status: false,
            message: "You are not authorized to delete this budget",
          })
          .code(403);
      }

      await this.budgetService.deleteBudget(id);

      return h
        .response({
          status: true,
          message: "Budget deleted successfully!",
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  getBudgetSummary = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const query = request.query as any;

      const summary = await this.budgetService.getBudgetSummary(
        userId,
        query.month_year
      );

      return h
        .response({
          status: true,
          message: "Budget summary fetched successfully!",
          data: summary,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  getActiveBudgets = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const budgets = await this.budgetService.getActiveBudgets(userId);

      return h
        .response({
          status: true,
          message: "Active budgets fetched successfully!",
          data: { budgets },
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };
}
