import { AppConfig } from "./app.config";

/**
 * Swagger configuration for API documentation
 */
export const swaggerOptions = {
  info: {
    title: "Financial Management API",
    version: "1.0.0",
    description: "API documentation for the Financial Management application",
    contact: {
      name: "API Support",
    },
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter your JWT token in the format: Bearer <token>",
    },
  },
  security: [{ jwt: [] }],
  schemes: ["http", "https"],
  host: `${AppConfig.server.host}:${AppConfig.server.port}`,
  basePath: "/api/v1",
  documentationPage: true,
  documentationPath: "/documentation",
  swaggerUI: true,
  swaggerUIPath: "/swagger",
  jsonPath: "/swagger.json",
  grouping: "tags",
  tags: [
    {
      name: "auth",
      description: "Authentication endpoints",
    },
    {
      name: "transactions",
      description: "Transaction management endpoints",
    },
    {
      name: "budgets",
      description: "Budget management endpoints",
    },
    {
      name: "challenges",
      description: "Savings challenge endpoints",
    },
  ],
};
