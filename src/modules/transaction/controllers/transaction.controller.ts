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
}
