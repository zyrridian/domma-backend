import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import { AuthController } from "../controllers/auth.controller";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/auth.validation";
import {
  successResponseSchema,
  errorResponseSchema,
  tokenResponseSchema,
  userSchema,
} from "../validations/response.schemas";

const authController = new AuthController();

export const authRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/auth/register",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Register a new user",
      notes: "Creates a new user account with the provided information",
      validate: {
        payload: registerSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "201": {
              description: "User registered successfully",
              schema: successResponseSchema,
            },
            "400": {
              description:
                "Bad Request - Invalid input or email already exists",
              schema: errorResponseSchema,
            },
          },
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
      tags: ["api", "auth"],
      description: "User login",
      notes: "Authenticates a user and returns access and refresh tokens",
      validate: {
        payload: loginSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Successfully authenticated",
              schema: successResponseSchema.keys({
                data: tokenResponseSchema,
              }),
            },
            "401": {
              description: "Unauthorized - Invalid credentials",
              schema: errorResponseSchema,
            },
          },
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
      tags: ["api", "auth"],
      description: "Refresh access token",
      notes: "Uses a valid refresh token to generate a new access token",
      validate: {
        payload: refreshTokenSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Token refreshed successfully",
              schema: successResponseSchema.keys({
                data: Joi.object({
                  access_token: Joi.string().required(),
                }),
              }),
            },
            "401": {
              description: "Unauthorized - Invalid or expired refresh token",
              schema: errorResponseSchema,
            },
          },
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
      tags: ["api", "auth"],
      description: "Logout user",
      notes: "Invalidates a refresh token, effectively logging out the user",
      validate: {
        payload: refreshTokenSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Logged out successfully",
              schema: successResponseSchema,
            },
            "400": {
              description: "Bad Request - Invalid refresh token format",
              schema: errorResponseSchema,
            },
          },
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
      tags: ["api", "auth", "profile"],
      description: "Get user profile",
      notes: "Retrieves the profile information of the authenticated user",
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Profile retrieved successfully",
              schema: successResponseSchema.keys({
                data: userSchema,
              }),
            },
            "401": {
              description: "Unauthorized - Invalid or missing token",
              schema: errorResponseSchema,
            },
            "404": {
              description: "Not Found - User not found",
              schema: errorResponseSchema,
            },
          },
          security: [{ jwt: [] }],
        },
      },
    },
    handler: (request, h) => authController.getProfile(request, h),
  },
  {
    method: "PUT",
    path: "/auth/profile",
    options: {
      auth: "jwt",
      tags: ["api", "auth", "profile"],
      description: "Update user profile",
      notes: "Updates the profile information of the authenticated user",
      validate: {
        payload: updateProfileSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Profile updated successfully",
              schema: successResponseSchema.keys({
                data: userSchema,
              }),
            },
            "400": {
              description: "Bad Request - Invalid input data",
              schema: errorResponseSchema,
            },
            "401": {
              description: "Unauthorized - Invalid or missing token",
              schema: errorResponseSchema,
            },
          },
          security: [{ jwt: [] }],
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
      tags: ["api", "auth", "profile"],
      description: "Change password",
      notes: "Changes the password of the authenticated user",
      validate: {
        payload: changePasswordSchema,
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Password changed successfully",
              schema: successResponseSchema,
            },
            "400": {
              description:
                "Bad Request - Current password is incorrect or invalid input",
              schema: errorResponseSchema,
            },
            "401": {
              description: "Unauthorized - Invalid or missing token",
              schema: errorResponseSchema,
            },
          },
          security: [{ jwt: [] }],
        },
      },
    },
    handler: (request, h) => authController.changePassword(request, h),
  },
];
