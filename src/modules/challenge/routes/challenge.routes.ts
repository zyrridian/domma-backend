import Hapi from "@hapi/hapi";
import { ChallengeController } from "../controllers/challenge.controller";
import {
  checkInSchema,
  createChallengeSchema,
  getActiveChallengesSchema,
  getCatalogChallengesSchema,
  getChallengeActivitySchema,
  getChallengeHistorySchema,
  getChallengeStatisticsSchema,
  getChallengesSchema,
  getLeaderboardSchema,
  joinChallengeSchema,
  shareProgressSchema,
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
        validate: {
          query: getChallengesSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
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
    {
      method: "GET",
      path: "/challenges/summary",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengeSummary,
        description: "Get challenge summary",
        notes:
          "Returns a summary of challenge statistics for the authenticated user",
        tags: ["api", "challenges"],
      },
    },
    {
      method: "GET",
      path: "/challenges/status",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengesByStatus,
        description: "Get challenges by status",
        notes:
          "Returns challenges filtered by status (active, completed, failed)",
        tags: ["api", "challenges"],
      },
    },
    {
      method: "GET",
      path: "/challenges/active",
      options: {
        auth: "jwt",
        handler: challengeController.getActiveChallenges,
        description: "Get active challenges",
        notes: "Returns active challenges for the authenticated user",
        tags: ["api", "challenges"],
        validate: {
          query: getActiveChallengesSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/challenges/catalog",
      options: {
        auth: "jwt",
        handler: challengeController.getCatalogChallenges,
        description: "Get challenge catalog",
        notes: "Returns available challenges from the catalog",
        tags: ["api", "challenges"],
        validate: {
          query: getCatalogChallengesSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "POST",
      path: "/challenges/join",
      options: {
        auth: "jwt",
        handler: challengeController.joinChallenge,
        description: "Join a new challenge",
        notes: "Creates a user challenge for the authenticated user",
        tags: ["api", "challenges"],
        validate: {
          payload: joinChallengeSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "POST",
      path: "/challenges/{id}/check-in",
      options: {
        auth: "jwt",
        handler: challengeController.checkIn,
        description: "Check in to a challenge",
        notes: "Records progress for a challenge",
        tags: ["api", "challenges"],
        validate: {
          payload: checkInSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/challenges/history",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengeHistory,
        description: "Get challenge history",
        notes: "Returns completed challenges for the authenticated user",
        tags: ["api", "challenges"],
        validate: {
          query: getChallengeHistorySchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/challenges/{id}/activity",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengeActivity,
        description: "Get challenge activity",
        notes: "Returns activity log for a specific challenge",
        tags: ["api", "challenges"],
        validate: {
          query: getChallengeActivitySchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/challenges/statistics",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengeStatistics,
        description: "Get challenge statistics",
        notes:
          "Returns overall challenge statistics for the authenticated user",
        tags: ["api", "challenges"],
        validate: {
          query: getChallengeStatisticsSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "GET",
      path: "/challenges/badges",
      options: {
        auth: "jwt",
        handler: challengeController.getBadges,
        description: "Get challenge badges",
        notes: "Returns earned and available badges for the authenticated user",
        tags: ["api", "challenges"],
      },
    },
    {
      method: "GET",
      path: "/challenges/options",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengeOptions,
        description: "Get challenge options",
        notes: "Returns available challenge options",
        tags: ["api", "challenges"],
      },
    },
    {
      method: "GET",
      path: "/challenges/categories",
      options: {
        auth: "jwt",
        handler: challengeController.getChallengeCategories,
        description: "Get challenge categories",
        notes: "Returns challenge categories",
        tags: ["api", "challenges"],
      },
    },
    {
      method: "GET",
      path: "/challenges/leaderboard",
      options: {
        auth: "jwt",
        handler: challengeController.getLeaderboard,
        description: "Get challenge leaderboard",
        notes: "Returns top performers in various challenges",
        tags: ["api", "challenges"],
        validate: {
          query: getLeaderboardSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: "POST",
      path: "/challenges/{id}/share",
      options: {
        auth: "jwt",
        handler: challengeController.shareChallenge,
        description: "Share challenge",
        notes: "Shares challenge results on social media",
        tags: ["api", "challenges"],
        validate: {
          payload: shareProgressSchema,
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
    },
  ]);
};
