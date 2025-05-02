import Joi from "joi";
import { ServerRoute } from "@hapi/hapi";
import { ResponseUtil } from "@/common/utils/response.util";
import { UserService } from "@/modules/user/services/user.service";

const userService = new UserService();

export const userRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/users",
    options: {
      auth: {
        strategy: "jwt",
        access: {
          scope: "admin",
        },
      },
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          pageSize: Joi.number().integer().min(1).max(100).default(10),
          role: Joi.string().valid("USER", "ADMIN").optional(),
        }),
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { page, pageSize, role } = request.query as any;
        const result = await userService.getAllUsers(page, pageSize, role);

        return h
          .response(
            ResponseUtil.success(result, "Users retrieved successfully")
          )
          .code(200);
      } catch (error: any) {
        return h
          .response(ResponseUtil.error(error.message, "USERS_FETCH_FAILED"))
          .code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    options: {
      auth: "jwt",
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.params.id;
        const currentUser = request.auth.credentials;

        // Only allow users to access their own profile or admins to access any profile
        if (userId !== currentUser.id && currentUser.role !== "ADMIN") {
          return h
            .response(ResponseUtil.error("Unauthorized access", "UNAUTHORIZED"))
            .code(403);
        }

        const user = await userService.getUserById(userId);

        if (!user) {
          return h
            .response(ResponseUtil.error("User not found", "USER_NOT_FOUND"))
            .code(404);
        }

        return h
          .response(ResponseUtil.success(user, "User retrieved successfully"))
          .code(200);
      } catch (error: any) {
        return h
          .response(ResponseUtil.error(error.message, "USER_FETCH_FAILED"))
          .code(500);
      }
    },
  },
  {
    method: "PUT",
    path: "/users/{id}",
    options: {
      auth: "jwt",
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
        payload: Joi.object({
          full_name: Joi.string().optional(),
          email: Joi.string().email().optional(),
          phone: Joi.string().optional(),
          university: Joi.string().optional(),
          major: Joi.string().optional(),
          role: Joi.string().valid("USER", "ADMIN").optional(),
        }),
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.params.id;
        const currentUser = request.auth.credentials;
        const updateData = request.payload as any;

        // Only allow users to update their own profile or admins to update any profile
        if (userId !== currentUser.id && currentUser.role !== "ADMIN") {
          return h
            .response(ResponseUtil.error("Unauthorized access", "UNAUTHORIZED"))
            .code(403);
        }

        // Only admins can update roles
        if (updateData.role && currentUser.role !== "ADMIN") {
          delete updateData.role;
        }

        const updatedUser = await userService.updateUser(userId, updateData);

        return h
          .response(
            ResponseUtil.success(updatedUser, "User updated successfully")
          )
          .code(200);
      } catch (error: any) {
        return h
          .response(ResponseUtil.error(error.message, "USER_UPDATE_FAILED"))
          .code(400);
      }
    },
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    options: {
      auth: {
        strategy: "jwt",
        access: {
          scope: "admin",
        },
      },
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
        failAction: async (request, h, err) => {
          throw err;
        },
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.params.id;
        await userService.deleteUser(userId);

        return h
          .response(ResponseUtil.success(null, "User deleted successfully"))
          .code(200);
      } catch (error: any) {
        return h
          .response(ResponseUtil.error(error.message, "USER_DELETE_FAILED"))
          .code(400);
      }
    },
  },
];
