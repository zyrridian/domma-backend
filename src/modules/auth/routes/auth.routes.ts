import { ServerRoute } from "@hapi/hapi";
import { AuthController } from "../controllers/auth.controller";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/auth.validation";

const authController = new AuthController();

export const authRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/auth/register",
    options: {
      auth: false,
      validate: {
        payload: registerSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: (request, h) => authController.register(request, h),
  },
  {
    method: "POST",
    path: "/auth/login",
    options: {
      auth: false,
      validate: {
        payload: loginSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: (request, h) => authController.login(request, h),
  },
  {
    method: "POST",
    path: "/auth/refresh-token",
    options: {
      auth: false,
      validate: {
        payload: refreshTokenSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: (request, h) => authController.refreshToken(request, h),
  },
  {
    method: "POST",
    path: "/auth/logout",
    options: {
      auth: false,
      validate: {
        payload: refreshTokenSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: (request, h) => authController.logout(request, h),
  },
  {
    method: "GET",
    path: "/auth/profile",
    options: {
      auth: "jwt",
    },
    handler: (request, h) => authController.getProfile(request, h),
  },
  {
    method: "PUT",
    path: "/auth/profile",
    options: {
      auth: "jwt",
      validate: {
        payload: updateProfileSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: (request, h) => authController.updateProfile(request, h),
  },
  {
    method: "POST",
    path: "/auth/change-password",
    options: {
      auth: "jwt",
      validate: {
        payload: changePasswordSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: (request, h) => authController.changePassword(request, h),
  },
];
