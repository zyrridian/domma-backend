import Hapi from "@hapi/hapi";
import { TransactionService } from "../services/transaction.service";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  createTransaction = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const transaction = await this.transactionService.createTransaction(
        userId,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Transaction added successfully!",
          data: transaction,
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

  getTransactions = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const transactions = await this.transactionService.getTransactions(
        userId
      );
      return h
        .response({
          status: true,
          message: "Transactions fetched successfully!",
          data: transactions,
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

  getTransactionById = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const id = request.params.id as string;
      const transaction = await this.transactionService.getTransactionById(id);

      if (!transaction) {
        return h
          .response({
            status: false,
            message: "Transaction not found",
          })
          .code(404);
      }

      // Check if the transaction belongs to the authenticated user
      if (transaction.user_id !== (request.auth.credentials.id as string)) {
        return h
          .response({
            status: false,
            message: "You are not authorized to view this transaction",
          })
          .code(403);
      }

      return h
        .response({
          status: true,
          message: "Transaction fetched successfully!",
          data: transaction,
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

  updateTransaction = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const existingTransaction =
        await this.transactionService.getTransactionById(id);

      if (!existingTransaction) {
        return h
          .response({
            status: false,
            message: "Transaction not found",
          })
          .code(404);
      }

      if (existingTransaction.user_id !== userId) {
        return h
          .response({
            status: false,
            message: "You are not authorized to update this transaction",
          })
          .code(403);
      }

      const updatedTransaction =
        await this.transactionService.updateTransaction(
          id,
          request.payload as any
        );

      return h
        .response({
          status: true,
          message: "Transaction updated successfully!",
          data: updatedTransaction,
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

  deleteTransaction = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const existingTransaction =
        await this.transactionService.getTransactionById(id);

      if (!existingTransaction) {
        return h
          .response({
            status: false,
            message: "Transaction not found",
          })
          .code(404);
      }

      if (existingTransaction.user_id !== userId) {
        return h
          .response({
            status: false,
            message: "You are not authorized to delete this transaction",
          })
          .code(403);
      }

      await this.transactionService.deleteTransaction(id);

      return h
        .response({
          status: true,
          message: "Transaction deleted successfully",
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
