import { Decimal } from "@prisma/client/runtime/library";
import {
  ActivityLogDto,
  ChallengeResponseDto,
  ChallengeSummaryDto,
  CreateChallengeDto,
  DetailedChallengeResponseDto,
  PaginatedResponseDto,
} from "../dto/challenge.dto";
import { ChallengeRepository } from "../repositories/challenge.repository";

export class ChallengeService {
  private challengeRepository: ChallengeRepository;

  constructor() {
    this.challengeRepository = new ChallengeRepository();
  }

  /**
   * Create a new challenge
   */
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

  /**
   * Get detailed challenge information by ID
   */
  async getChallengeById(
    id: string,
    userId: string
  ): Promise<DetailedChallengeResponseDto | null> {
    const challenge = await this.challengeRepository.findById(id);

    if (!challenge || challenge.user_id !== userId) {
      return null;
    }

    return this.mapChallengeToDetailedDto(challenge);
  }

  /**
   * Update a challenge
   */
  async updateChallenge(
    id: string,
    data: any
  ): Promise<DetailedChallengeResponseDto> {
    // Prepare the data for update
    const updateData: any = {};

    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.targetAmount)
      updateData.target_amount = new Decimal(data.targetAmount);
    if (data.startDate) updateData.start_date = new Date(data.startDate);
    if (data.endDate) updateData.end_date = new Date(data.endDate);
    if (data.status) updateData.status = data.status;
    if (data.category) updateData.category = data.category;
    if (data.color) updateData.color = data.color;
    if (data.difficulty) updateData.difficulty = data.difficulty;
    if (data.type) updateData.type = data.type;
    if (data.steps) updateData.steps = data.steps;
    if (data.tips) updateData.tips = data.tips;
    if (data.notifications !== undefined)
      updateData.notifications = data.notifications;
    if (data.goal) updateData.goal = data.goal;

    // Update the challenge
    const updatedChallenge = await this.challengeRepository.update(
      id,
      updateData
    );

    return this.mapChallengeToDetailedDto(updatedChallenge);
  }

  /**
   * Delete a challenge
   */
  async deleteChallenge(id: string): Promise<void> {
    await this.challengeRepository.delete(id);
  }

  /**
   * Get challenge summary for a user
   */
  async getChallengeSummary(userId: string): Promise<ChallengeSummaryDto> {
    return this.challengeRepository.getChallengeSummary(userId);
  }

  /**
   * Get active challenges for a user
   */
  async getActiveChallenges(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponseDto<ChallengeResponseDto>> {
    const { challenges, totalItems } =
      await this.challengeRepository.findActiveByUserId(userId, page, limit);

    // Map challenges to DTO
    const mappedChallenges = challenges.map((challenge) =>
      this.mapChallengeToResponseDto(challenge)
    );

    return {
      data: mappedChallenges,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * Get challenges by status for a user
   */
  async getChallengesByStatus(
    userId: string,
    status: string
  ): Promise<ChallengeResponseDto[]> {
    if (status === "active") {
      const result = await this.challengeRepository.findActiveByUserId(
        userId,
        1,
        100
      );
      return result.challenges.map((challenge) =>
        this.mapChallengeToResponseDto(challenge)
      );
    } else if (status === "completed") {
      const result = await this.challengeRepository.findCompletedByUserId(
        userId,
        1,
        100
      );
      return result.challenges.map((challenge) =>
        this.mapChallengeToResponseDto(challenge)
      );
    } else {
      // For failed status or any other status
      const challenges = await this.challengeRepository.findByStatus(
        userId,
        status
      );

      return challenges.map((challenge) =>
        this.mapChallengeToResponseDto(challenge)
      );
    }
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

  private mapChallengeToDetailedDto(
    challenge: any
  ): DetailedChallengeResponseDto {
    const basicInfo = this.mapChallengeToResponseDto(challenge);

    // Map activities to activity log
    const activityLog = (challenge.activities || []).map((activity: any) =>
      this.mapToActivityLogDto(activity)
    );

    return {
      ...basicInfo,
      steps: challenge.steps || [],
      tips: challenge.tips || [],
      activityLog,
    };
  }

  private mapToActivityLogDto(activity: any): ActivityLogDto {
    return {
      id: activity.id,
      action: activity.action,
      date: activity.date.toISOString().split("T")[0],
      amount: activity.amount ? Number(activity.amount) : undefined,
      completed: activity.completed,
      difficulty: activity.difficulty || undefined,
      notes: activity.notes || undefined,
      shared: activity.shared,
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
