import Hapi from "@hapi/hapi";
import { DashboardController } from "../controllers/dashboard.controller";

export const registerDashboardRoutes = (server: Hapi.Server): void => {
  const dashboardController = new DashboardController();

  // Get all dashboard data in a single request
  server.route({
    method: "GET",
    path: "/dashboard",
    options: {
      auth: "jwt",
      description: "Get all dashboard data",
      tags: ["api", "dashboard"],
    },
    handler: dashboardController.getDashboardData,
  });

  // Get only the financial summary data
  server.route({
    method: "GET",
    path: "/dashboard/summary",
    options: {
      auth: "jwt",
      handler: dashboardController.getDashboardSummary,
      description: "Get dashboard financial summary",
      notes: "Get dashboard financial summary",
      tags: ["api", "dashboard"],
    },
  });

  // Get prediction data for next month
  server.route({
    method: "GET",
    path: "/dashboard/prediction",
    options: {
      auth: "jwt",
      handler: dashboardController.getDashboardPrediction,
      description: "Get dashboard prediction data",
      notes: "Get dashboard prediction data",
      tags: ["api", "dashboard"],
    },
  });

  // Get a daily financial tip
  server.route({
    method: "GET",
    path: "/dashboard/tips",
    options: {
      auth: "jwt",
      handler: dashboardController.getDailyTip,
      description: "Get a daily financial tip",
      notes: "Get a daily financial tip",
      tags: ["api", "dashboard"],
    },
  });
};
