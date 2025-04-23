import Joi from "joi";
import { AuthService } from "@/services/auth.service";
import { ServerRoute } from "@hapi/hapi";
import { ResponseUtil } from "@/utils/response.util";

const authService = new AuthService();

export const authRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/auth/register",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
          name: Joi.string().required(),
        }),
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: async (request, h) => {
      try {
        const user = await authService.register(request.payload as any);
        return h
          .response(ResponseUtil.success(user, "User registered successfully"))
          .code(201);
      } catch (error: any) {
        return h
          .response(
            ResponseUtil.error(
              error.message,
              "REGISTRATION_FAILED",
              error.details
            )
          )
          .code(400);
      }
    },
  },
  {
    method: "POST",
    path: "/auth/login",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: async (request, h) => {
      try {
        const result = await authService.login(request.payload as any);
        return h
          .response(ResponseUtil.success(result, "Login successful"))
          .code(200);
      } catch (error: any) {
        return h
          .response(
            ResponseUtil.error(error.message, "LOGIN_FAILED", error.details)
          )
          .code(401);
      }
    },
  },
];
