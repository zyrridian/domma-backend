import { Plugin, Server } from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import { swaggerOptions } from "../config/swagger.config";

/**
 * Swagger plugin registration
 */
export const swaggerPlugin: Plugin<void> = {
  name: "swagger-documentation",
  version: "1.0.0",
  register: async (server: Server) => {
    try {
      // Register required plugins for Swagger
      await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions,
        },
      ]);

      console.log("Swagger documentation plugin registered successfully");
    } catch (error) {
      console.error("Error registering swagger plugin:", error);
      throw error;
    }
  },
};
