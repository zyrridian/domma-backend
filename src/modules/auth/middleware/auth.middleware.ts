import { Plugin, Server, Request, ResponseToolkit } from "@hapi/hapi";
import { AppConfig } from "../../../common/config/app.config";
import { ResponseUtil } from "../../../common/utils/response.util";

export const authMiddleware: Plugin<void> = {
  name: "auth-middleware",
  version: "1.0.0",
  register: async (server: Server) => {
    // Register JWT authentication
    await server.register(require("@hapi/jwt"));

    server.auth.strategy("jwt", "jwt", {
      keys: AppConfig.jwt.secret,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: 60 * 60, // 1 hour
      },
      validate: (artifacts) => {
        const credentials = artifacts.decoded.payload;

        // Set up scopes based on user role
        let scope = [];
        if (credentials.role === "ADMIN") {
          scope = ["admin", "user"]; // Admin can access both admin and user routes
        } else {
          scope = ["user"]; // Regular users can only access user routes
        }

        return {
          isValid: true,
          credentials: {
            ...credentials,
            scope,
          },
        };
      },
    });

    // Authorization extension
    server.ext("onPostAuth", (request: Request, h: ResponseToolkit) => {
      // Skip if no auth is required or auth hasn't been set
      if (!request.auth.isAuthenticated) {
        return h.continue;
      }

      // Access control check
      const credentials = request.auth.credentials;
      const routeSettings = request.route.settings.auth;

      // Skip if no specific access requirements or access isn't defined
      if (
        !routeSettings ||
        typeof routeSettings === "boolean" ||
        !routeSettings.access
      ) {
        return h.continue;
      }

      // Check scope if required - using any to bypass TypeScript's strict type checking
      // since Hapi's type definitions might not include all properties
      const accessSettings = routeSettings.access as any;

      if (accessSettings.scope) {
        const requiredScope = accessSettings.scope;
        const userScope = credentials.scope || [];

        if (Array.isArray(requiredScope)) {
          // Any of the scopes should match
          if (!requiredScope.some((scope) => userScope.includes(scope))) {
            return h
              .response(
                ResponseUtil.error("Insufficient permissions", "FORBIDDEN")
              )
              .code(403)
              .takeover();
          }
        } else {
          // Single scope requirement
          if (!userScope.includes(requiredScope)) {
            return h
              .response(
                ResponseUtil.error("Insufficient permissions", "FORBIDDEN")
              )
              .code(403)
              .takeover();
          }
        }
      }

      return h.continue;
    });

    // Set default auth if not specified
    server.auth.default("jwt");
  },
};
