import Hapi from "@hapi/hapi";
import { AppConfig } from "./common/config/app.config";
import { errorHandler } from "./common/middleware/error.middleware";
import { authMiddleware } from "./modules/auth/middleware/auth.middleware";
import { authRoutes } from "./modules/auth/routes/auth.routes";
import { swaggerPlugin } from "./common/plugins/swagger.plugin";
import { registerTransactionRoutes } from "./modules/transaction/routes/transaction.routes";
import { registerBudgetRoutes } from "./modules/budget/routes/budget.routes";
import { registerChallengeRoutes } from "./modules/challenge/routes/challenge.routes";

export async function createServer(): Promise<Hapi.Server> {
  // Create the server
  const server = Hapi.server({
    port: AppConfig.server.port,
    host: AppConfig.server.host,
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
      },
    },
  });

  // Register global error handler middleware
  await server.register(errorHandler);

  // Register Swagger documentation plugin
  await server.register(swaggerPlugin);

  // Register authentication middleware
  await server.register(authMiddleware);

  // Add a root route handler
  server.route({
    method: "GET",
    path: "/",
    options: {
      auth: false,
    },
    handler: (request, h) => {
      return {
        status: true,
        message: "Domma API is running. Please access /api/v1 endpoints.",
        documentation: "/documentation"
      };
    },
  });

  // Register routes with API versioning
  server.realm.modifiers.route.prefix = "/api/v1";

  // Register auth routes
  server.route(authRoutes);

  // Register transaction routes
  registerTransactionRoutes(server);

  // Register budget routes
  registerBudgetRoutes(server);

  // Register challenge routes
  registerChallengeRoutes(server);

  return server;
}

export async function startServer(): Promise<Hapi.Server> {
  try {
    const server = await createServer();
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    console.log(`API Documentation: ${server.info.uri}/documentation`);
    return server;
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

// For local development
if (process.env.NODE_ENV !== "production") {
  startServer();
}

// For testing and external invocation
export default { createServer, startServer };
