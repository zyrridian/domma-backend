import Hapi from "@hapi/hapi";
import { TransactionController } from "../controllers/transaction.controller";
import { createTransactionSchema } from "../validations/transaction.validation";

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
  ]);
};
