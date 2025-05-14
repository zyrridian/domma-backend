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
}
