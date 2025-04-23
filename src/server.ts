import Hapi from "@hapi/hapi";
import jwt from "@hapi/jwt";
import { config } from "./config";
import { authRoutes } from "./routes/auth.route";

const server = Hapi.server({
  port: config.server.port,
  host: config.server.host,
  routes: {
    cors: {
      origin: ["*"],
      credentials: true,
    },
  },
});

const init = async () => {
  // Register JWT Authentication
  await server.register(jwt);
  server.auth.strategy("jwt", "jwt", {
    keys: config.jwt.secret,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 86400, // 24 hours
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });

  // Register routes
  server.route([...authRoutes]);

  await server.initialize();

  return server;
};

const start = async () => {
  const server = await init();
  await server.start();
  console.log("Server running on %s", server.info.uri);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

// For local development
if (process.env.NODE_ENV !== "production") {
  start();
}

// For serverless
export { init };
