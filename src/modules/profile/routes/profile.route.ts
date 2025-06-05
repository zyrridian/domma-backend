import Hapi from "@hapi/hapi";
import { ProfileController } from "../controllers/profile.controller";
import {
  updateProfileSchema,
  uploadProfilePictureSchema,
} from "../validations/profile.validation";

export const registerProfileRoutes = (server: Hapi.Server): void => {
  const profileController = new ProfileController();

  server.route([
    {
      method: "GET",
      path: "/profile",
      options: {
        auth: "jwt",
        handler: profileController.getProfile,
        description: "Get user profile",
        notes: "Returns user profile for the authenticated user",
        tags: ["api", "profile"],
      },
    },
    {
      method: "PUT",
      path: "/profile",
      options: {
        auth: "jwt",
        handler: profileController.updateProfile,
        description: "Update a profile",
        notes: "Updates a specific user profile",
        tags: ["api", "profile"],
        validate: {
          payload: updateProfileSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "POST",
      path: "/profile/picture",
      options: {
        auth: "jwt",
        handler: profileController.uploadProfilePicture,
        description: "Upload user profile picture",
        notes: "Upload user profile picture",
        tags: ["api", "profile"],
        payload: {
          maxBytes: 5 * 1024 * 1024, // 5MB max file size
          output: "data",
          parse: true,
          allow: "multipart/form-data",
          multipart: {
            output: "data",
          },
        },
        validate: {
          payload: uploadProfilePictureSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
  ]);
};
