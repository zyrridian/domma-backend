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
          status: "success",
          data: transaction,
        })
        .code(201);
    } catch (error: any) {
      return h
        .response({
          status: "error",
          message: error.message,
        })
        .code(400);
    }
  };
}
