import { Decimal } from "@prisma/client/runtime/library";
import { ChallengeResponseDto, CreateChallengeDto } from "../dto/challenge.dto";
import { ChallengeRepository } from "../repositories/challenge.repository";

export class ChallengeService {
  private challengeRepository: ChallengeRepository;

  constructor() {
    this.challengeRepository = new ChallengeRepository();
  }

  async createChallenge(
    userId: string,
    data: CreateChallengeDto
  ): Promise<ChallengeResponseDto> {
    // Create the challenge with default values
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30); // Default 30 days duration

    const challengeData = {
      user_id: userId,
      title: data.name,
      description: "Custom challenge", // Default description
      status: "active",
      start_date: startDate,
      end_date: endDate,
      current_day: 1,
      total_days: 30, // Default duration
      target_amount: new Decimal(1000), // Default target
      current_amount: new Decimal(0),
      percent_complete: new Decimal(0),
      color: "#4CAF50", // Default color
      difficulty: 1, // Default difficulty
      type: data.type,
      category: "general", // Default category
      steps: [], // Default empty steps
      tips: [], // Default empty tips
      notifications: data.notifications,
      goal: data.goal || "",
    };

    const challenge = await this.challengeRepository.create(challengeData);

    // Create initial activity
    await this.challengeRepository.createActivity({
      challenge_id: challenge.id,
      action: "Started Challenge",
      date: new Date(),
      completed: true,
      notes: data.goal || "Started a new challenge",
    });

    return this.mapChallengeToResponseDto(challenge);
  }

  /**
   * Get all challenges for a user
   */
  async getChallenges(userId: string): Promise<ChallengeResponseDto[]> {
    const result = await this.challengeRepository.findActiveByUserId(
      userId,
      1,
      100
    );

    // Map challenges to DTO
    return result.challenges.map((challenge) =>
      this.mapChallengeToResponseDto(challenge)
    );
  }

  // Helper mapping methods
  private mapChallengeToResponseDto(challenge: any): ChallengeResponseDto {
    const currentDay = challenge.current_day;
    const totalDays = challenge.total_days;

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      progress: `Day ${currentDay}/${totalDays}`,
      percentComplete: Number(challenge.percent_complete),
      color: challenge.color,
      savingsLabel:
        challenge.type === "spending" ? "Potential Savings" : "Saved",
      savingsAmount: Number(challenge.current_amount),
      actionText: "Check In",
      type: challenge.type,
      checkInDescription: this.getCheckInDescription(challenge),
      duration: `${totalDays} Days`,
      difficulty: challenge.difficulty,
      targetAmount: Number(challenge.target_amount),
      status: challenge.status,
      startDate: challenge.start_date.toISOString().split("T")[0],
      endDate: challenge.end_date.toISOString().split("T")[0],
    };
  }

  private getCheckInDescription(challenge: any): string {
    switch (challenge.type) {
      case "saving":
        return "How much did you save today?";
      case "spending":
        return "How much did you save today by reducing expenses?";
      case "habit":
        return "Did you complete your habit today?";
      default:
        return "How did your challenge go today?";
    }
  }
}
