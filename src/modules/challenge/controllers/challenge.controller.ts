import Hapi from "@hapi/hapi";
import { ChallengeService } from "../services/challenge.service";

export class ChallengeController {
  private challengeService: ChallengeService;

  constructor() {
    this.challengeService = new ChallengeService();
  }

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
}
