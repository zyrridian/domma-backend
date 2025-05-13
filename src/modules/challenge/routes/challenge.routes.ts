import Hapi from "@hapi/hapi";
import { ChallengeController } from "../controllers/challenge.controller";
import { createChallengeSchema } from "../validations/challenge.validation";

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
  ]);
};
