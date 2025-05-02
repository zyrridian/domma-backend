import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import { ResponseUtil } from "../utils/response.util";
import Boom from "@hapi/boom";

export const errorHandler = {
  name: "onPreResponse",
  version: "1.0.0",
  register: async (server: Server) => {
    server.ext("onPreResponse", (request: Request, h: ResponseToolkit) => {
      const response = request.response;

      // Check if it's an error response
      if (Boom.isBoom(response)) {
        // Handle validation errors
        if (response.output.statusCode === 400) {
          const errorMessage = response.message || "Validation error";
          // Access validation details safely
          const errorDetails = response.data ? response.data : [];

          return h
            .response(
              ResponseUtil.error(errorMessage, "VALIDATION_ERROR", errorDetails)
            )
            .code(400);
        }

        // Handle authentication errors
        if (response.output.statusCode === 401) {
          return h
            .response(
              ResponseUtil.error(
                "Authentication failed",
                "AUTHENTICATION_FAILED"
              )
            )
            .code(401);
        }

        // Handle not found errors
        if (response.output.statusCode === 404) {
          return h
            .response(
              ResponseUtil.error("Resource not found", "RESOURCE_NOT_FOUND")
            )
            .code(404);
        }

        // Handle server errors
        if (response.output.statusCode >= 500) {
          // Log the error for server errors
          console.error(`[SERVER_ERROR] ${response.message}`);

          return h
            .response(
              ResponseUtil.error(
                "An internal server error occurred",
                "INTERNAL_SERVER_ERROR"
              )
            )
            .code(500);
        }

        // Handle any other errors
        return h
          .response(
            ResponseUtil.error(response.message || "An error occurred", "ERROR")
          )
          .code(response.output.statusCode);
      }

      // If not an error, continue
      return h.continue;
    });
  },
};
