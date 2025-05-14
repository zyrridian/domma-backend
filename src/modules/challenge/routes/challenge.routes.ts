import Hapi from "@hapi/hapi";
import { ChallengeController } from "../controllers/challenge.controller";
import {
  createChallengeSchema,
  updateChallengeSchema,
} from "../validations/challenge.validation";

export const registerChallengeRoutes = (server: Hapi.Server): void => {
  const challengeController = new ChallengeController();

  server.route([
    {
      method: "POST",
      path: "/challenges",
      options: {
        auth: "jwt",
        handler: challengeController.createChallenge,
        description: "Create a new challenge",
        notes: "Creates a new challenge for the authenticated user",
        tags: ["api", "challenges"],
        validate: {
          payload: createChallengeSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/challenges",
      options: {
        auth: "jwt",
        handler: challengeController.getChallenges,
        description: "Get all challenges",
        notes: "Returns all challenges for the authenticated user",
        tags: ["api", "challenges"],
      },
    },
    {
      method: "GET",
      path: "/challenges/{id}",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengeById,
        description: "Get challenge by ID",
        notes: "Returns a specific challenge by ID",
        tags: ["api", "challenges"],
      },
    },
    {
      method: "PUT",
      path: "/challenges/{id}",
      options: {
        auth: "jwt",
        handler: challengeController.updateChallenge,
        description: "Update a challenge",
        notes: "Updates a specific challenge by ID",
        tags: ["api", "challenges"],
        validate: {
          payload: updateChallengeSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "DELETE",
      path: "/challenges/{id}",
      options: {
        auth: "jwt",
        handler: challengeController.deleteChallenge,
        description: "Delete a challenge",
        notes: "Deletes a specific challenge by ID",
        tags: ["api", "challenges"],
      },
    },
  ]);
};
