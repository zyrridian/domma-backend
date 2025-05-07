import Hapi from "@hapi/hapi";
import { TransactionController } from "../controllers/transaction.controller";
import {
  createTransactionSchema,
  updateTransactionSchema,
  updateRecurringTransactionSchema,
  createRecurringTransactionSchema,
  getTransactionSummary,
} from "../validations/transaction.validation";

export const registerTransactionRoutes = (server: Hapi.Server): void => {
  const transactionController = new TransactionController();

  server.route([
    {
      method: "POST",
      path: "/transactions",
      options: {
        auth: "jwt",
        handler: transactionController.createTransaction,
        description: "Create a new transaction",
        notes: "Creates a new transaction for the authenticated user",
        tags: ["api", "transactions"],
        validate: {
          payload: createTransactionSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/transactions",
      options: {
        auth: "jwt",
        handler: transactionController.getTransactions,
        description: "Get all user transactions",
        notes: "Return all transactions for the authenticated user",
        tags: ["api", "transactions"],
      },
    },
    {
      method: "GET",
      path: "/transactions/{id}",
      options: {
        auth: "jwt",
        handler: transactionController.getTransactionById,
        description: "Get transaction by ID",
        notes:
          "Returns a transaction by its ID if it belongs to the authenticated user",
        tags: ["api", "transactions"],
      },
    },
    {
      method: "PUT",
      path: "/transactions/{id}",
      options: {
        auth: "jwt",
        handler: transactionController.updateTransaction,
        description: "Update a transaction",
        notes: "Update a transaction if it belongs to the authenticated user",
        tags: ["api", "transactions"],
        validate: {
          payload: updateTransactionSchema,
        },
      },
    },
    {
      method: "DELETE",
      path: "/transactions/{id}",
      options: {
        auth: "jwt",
        handler: transactionController.deleteTransaction,
        description: "Delete a transaction",
        notes: "Deletes a transaction if it belongs to the authenticated user",
        tags: ["api", "transactions"],
      },
    },
    {
      method: "POST",
      path: "/transactions/{id}/recurring",
      options: {
        auth: "jwt",
        handler: transactionController.addRecurringToTransaction,
        description: "Add recurring settings to a transaction",
        notes:
          "Adds recurring settings to a transaction that doesn't already have them",
        tags: ["api", "transactions"],
        validate: {
          payload: createRecurringTransactionSchema,
        },
      },
    },
    {
      method: "PUT",
      path: "/transactions/{id}/recurring",
      options: {
        auth: "jwt",
        handler: transactionController.updateRecurringTransaction,
        description: "Update a recurring transaction",
        notes:
          "Updates the recurring settings of a transaction if it belongs to the authenticated user",
        tags: ["api", "transactions"],
        validate: {
          payload: updateRecurringTransactionSchema,
        },
      },
    },
    {
      method: "GET",
      path: "/transactions/summary",
      options: {
        auth: "jwt",
        handler: transactionController.getTransactionSummary,
        description: "Get transaction summary",
        notes: "Get a summary of transactions with optional date filters",
        tags: ["api", "transactions"],
        validate: {
          query: getTransactionSummary,
        },
      },
    },
  ]);
};
