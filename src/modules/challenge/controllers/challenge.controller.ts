import Hapi from "@hapi/hapi";
import { ChallengeService } from "../services/challenge.service";

export class ChallengeController {
  private challengeService: ChallengeService;

  constructor() {
    this.challengeService = new ChallengeService();
  }

  /**
   * Create a new challenge
   */
  createChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const challenge = await this.challengeService.createChallenge(
        userId,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Challenge created successfully!",
          data: challenge,
        })
        .code(201);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get all challenges for the user
   */
  getChallenges = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const challenges = await this.challengeService.getChallenges(userId);

      return h
        .response({
          status: true,
          message: "Challenges fetched successfully!",
          data: { challenges },
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get a challenge by ID
   */
  getChallengeById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const challenge = await this.challengeService.getChallengeById(
        id,
        userId
      );

      if (!challenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found",
          })
          .code(404);
      }

      return h
        .response({
          status: true,
          message: "Challenge fetched successfully!",
          data: challenge,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Update a challenge
   */
  updateChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const existingChallenge = await this.challengeService.getChallengeById(
        id,
        userId
      );

      if (!existingChallenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found",
          })
          .code(404);
      }

      const updatedChallenge = await this.challengeService.updateChallenge(
        id,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Challenge updated successfully!",
          data: updatedChallenge,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Delete a challenge
   */
  deleteChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const existingChallenge = await this.challengeService.getChallengeById(
        id,
        userId
      );

      if (!existingChallenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found",
          })
          .code(404);
      }

      await this.challengeService.deleteChallenge(id);

      return h
        .response({
          status: true,
          message: "Challenge deleted successfully!",
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge summary
   */
  getChallengeSummary = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const summary = await this.challengeService.getChallengeSummary(userId);

      return h
        .response({
          status: true,
          message: "Challenge summary fetched successfully!",
          data: summary,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get active challenges for the current user
   */
  getActiveChallenges = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const { page = 1, limit = 10 } = request.query as any;

      const result = await this.challengeService.getActiveChallenges(
        userId,
        Number(page),
        Number(limit)
      );

      return h
        .response({
          status: true,
          message: "Active challenges fetched successfully!",
          data: result,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenges by status
   */
  getChallengesByStatus = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const status = request.query.status as string;

      if (!["active", "completed", "failed"].includes(status)) {
        return h
          .response({
            status: false,
            message:
              "Invalid status. Must be 'active', 'completed', or 'failed'",
          })
          .code(400);
      }

      const challenges = await this.challengeService.getChallengesByStatus(
        userId,
        status
      );

      return h
        .response({
          status: true,
          message: `${
            status.charAt(0).toUpperCase() + status.slice(1)
          } challenges fetched successfully!`,
          data: { challenges },
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get available challenges from catalog
   */
  getCatalogChallenges = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        difficulty,
        category,
      } = request.query as any;

      const filters: any = {};
      if (type) filters.type = type;
      if (difficulty) filters.difficulty = Number(difficulty);
      if (category) filters.category = category;

      const result = await this.challengeService.getCatalogChallenges(
        Number(page),
        Number(limit),
        filters
      );

      return h
        .response({
          status: true,
          message: "Challenge catalog fetched successfully!",
          data: result,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Join a new challenge
   */
  joinChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const challenge = await this.challengeService.joinChallenge(
        userId,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Challenge joined successfully!",
          data: challenge,
        })
        .code(201);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Record progress through check-in
   */
  checkIn = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const updatedChallenge = await this.challengeService.checkIn(
        id,
        userId,
        request.payload as any
      );

      if (!updatedChallenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found",
          })
          .code(404);
      }

      return h
        .response({
          status: true,
          message: "Check-in recorded successfully!",
          data: updatedChallenge,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };
}
