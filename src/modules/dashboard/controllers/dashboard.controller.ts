import Hapi from "@hapi/hapi";
import { DashboardService } from "../services/dashboard.services";

/**
 * Controller for dashboard-related operations.
 * Handles fetching dashboard data like summary, predictions, and tips.
 */
export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  /**
   * Get all dashboard data in a single request
   */
  getDashboardData = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const dashboardData = await this.dashboardService.getDashboardData(
        userId
      );

      return h
        .response({
          status: true,
          message: "Dashboard data fetched successfully!",
          data: dashboardData,
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

  /**
   * Get only the financial summary data
   */
  getDashboardSummary = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const summary = await this.dashboardService.getDashboardSummary(userId);

      return h
        .response({
          status: true,
          message: "Dashboard summary fetched successfully!",
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

  /**
   * Get prediction data for next month
   */
  getDashboardPrediction = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const prediction = await this.dashboardService.getDashboardPrediction(
        userId
      );

      return h
        .response({
          status: true,
          message: "Dashboard prediction fetched successfully!",
          data: prediction,
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

  /**
   * Get a daily financial tip
   */
  getDailyTip = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const tip = await this.dashboardService.getDailyTip();

      return h
        .response({
          status: true,
          message: "Daily tip fetched successfully!",
          data: tip,
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
