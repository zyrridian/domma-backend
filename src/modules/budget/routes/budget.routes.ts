import Hapi from "@hapi/hapi";
import { BudgetController } from "../controllers/budget.controller";
import {
  createBudgetSchema,
  updateBudgetSchema,
  getBudgetSummarySchema,
} from "../validations/budget.validation";

export const registerBudgetRoutes = (server: Hapi.Server): void => {
  const budgetController = new BudgetController();

  server.route([
    {
      method: "GET",
      path: "/budgets",
      options: {
        auth: "jwt",
        handler: budgetController.getBudgets,
        description: "Get all budgets",
        notes: "Returns all budgets for the authenticated user",
        tags: ["api", "budgets"],
      },
    },
    {
      method: "POST",
      path: "/budgets",
      options: {
        auth: "jwt",
        handler: budgetController.createBudget,
        description: "Create a new budget",
        notes: "Creates a new budget for the authenticated user",
        tags: ["api", "budgets"],
        validate: {
          payload: createBudgetSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/budgets/{id}",
      options: {
        auth: "jwt",
        handler: budgetController.getBudgetById,
        description: "Get budget by ID",
        notes:
          "Returns a budget by its ID if it belongs to the authenticated user",
        tags: ["api", "budgets"],
      },
    },
    {
      method: "PUT",
      path: "/budgets/{id}",
      options: {
        auth: "jwt",
        handler: budgetController.updateBudget,
        description: "Update a budget",
        notes: "Update a budget if it belongs to the authenticated user",
        tags: ["api", "budgets"],
        validate: {
          payload: updateBudgetSchema,
        },
      },
    },
    {
      method: "DELETE",
      path: "/budgets/{id}",
      options: {
        auth: "jwt",
        handler: budgetController.deleteBudget,
        description: "Delete a budget",
        notes: "Deletes a budget if it belongs to the authenticated user",
        tags: ["api", "budgets"],
      },
    },
    {
      method: "GET",
      path: "/budgets/summary",
      options: {
        auth: "jwt",
        handler: budgetController.getBudgetSummary,
        description: "Get budget summary",
        notes: "Get a summary of budgets for the authenticated user",
        tags: ["api", "budgets"],
        validate: {
          query: getBudgetSummarySchema,
        },
      },
    },
    {
      method: "GET",
      path: "/budgets/active",
      options: {
        auth: "jwt",
        handler: budgetController.getActiveBudgets,
        description: "Get active budgets",
        notes: "Get currently active budgets for the authenticated user",
        tags: ["api", "budgets"],
      },
    },
  ]);
};
