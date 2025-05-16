import { Decimal } from "@prisma/client/runtime/library";
import {
  ActivityLogDto,
  BadgeDto,
  CatalogChallengeDto,
  ChallengeOptionDto,
  ChallengeResponseDto,
  ChallengeStatisticsDto,
  ChallengeSummaryDto,
  CheckInDto,
  CompletedChallengeDto,
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

  /**
   * Get challenges from catalog
   */
  async getCatalogChallenges(
    page: number = 1,
    limit: number = 10,
    filters: { type?: string; difficulty?: number; category?: string } = {}
  ): Promise<PaginatedResponseDto<CatalogChallengeDto>> {
    const { catalogItems, totalItems } =
      await this.challengeRepository.findCatalogItems(page, limit, filters);

    // Map catalog items to DTO
    const mappedItems = catalogItems.map((item) =>
      this.mapToCatalogChallengeDto(item)
    );

    return {
      data: mappedItems,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * Join a new challenge from catalog
   */
  async joinChallenge(
    userId: string,
    data: CreateChallengeDto
  ): Promise<ChallengeResponseDto> {
    // Get the challenge template from catalog by name
    const catalogItems = await this.challengeRepository.findCatalogItems(
      1,
      100
    );
    const challengeTemplate = catalogItems.catalogItems.find(
      (item) => item.title.toLowerCase() === data.name.toLowerCase()
    );

    if (!challengeTemplate) {
      throw new Error("Challenge template not found in catalog");
    }

    // Calculate end date based on start date and duration
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    const durationDays = parseInt(challengeTemplate.duration.split(" ")[0], 10);
    endDate.setDate(startDate.getDate() + durationDays);

    // Create the challenge
    const challengeData = {
      user_id: userId,
      title: challengeTemplate.title,
      description: challengeTemplate.description,
      status: "active",
      start_date: startDate,
      end_date: endDate,
      current_day: 1,
      total_days: durationDays,
      target_amount: new Decimal(0), // Will be updated based on challenge type
      current_amount: new Decimal(0),
      percent_complete: new Decimal(0),
      color: challengeTemplate.color,
      difficulty: challengeTemplate.difficulty,
      type: challengeTemplate.type,
      category: challengeTemplate.category,
      steps: challengeTemplate.steps,
      tips: challengeTemplate.tips,
      notifications: data.notifications,
      goal: data.goal,
    };

    // Set target amount based on challenge description or default
    if (challengeTemplate.target_text) {
      const targetMatch = challengeTemplate.target_text.match(/\d+(\.\d+)?/);
      if (targetMatch) {
        challengeData.target_amount = new Decimal(targetMatch[0]);
      }
    }

    const challenge = await this.challengeRepository.create(challengeData);

    // Create initial activity
    await this.challengeRepository.createActivity({
      challenge_id: challenge.id,
      action: "Joined Challenge",
      date: new Date(),
      completed: true,
      notes: data.goal || "Started a new challenge",
    });

    return this.mapChallengeToResponseDto(challenge);
  }

  /**
   * Record progress through check-in
   */
  async checkIn(
    id: string,
    userId: string,
    data: CheckInDto
  ): Promise<DetailedChallengeResponseDto | null> {
    const challenge = await this.challengeRepository.findById(id);

    if (!challenge || challenge.user_id !== userId) {
      return null;
    }

    // Create activity record
    const checkInDate = new Date(data.date);
    await this.challengeRepository.createActivity({
      challenge_id: challenge.id,
      action: `Check-in: Day ${challenge.current_day}`,
      date: checkInDate,
      amount: data.amount ? new Decimal(data.amount.toString()) : null,
      completed: data.completed,
      difficulty: data.difficulty || null,
      notes: data.notes || null,
      shared: data.shareProgress,
    });

    // Update challenge progress
    const updateData: any = {
      current_day: challenge.current_day + 1,
    };

    // Update current amount if amount is provided
    if (data.amount) {
      const newAmount = Number(challenge.current_amount) + data.amount;
      updateData.current_amount = new Decimal(newAmount.toString());
    }

    // Update percentage complete
    const percentComplete =
      (updateData.current_day / challenge.total_days) * 100;
    updateData.percent_complete = new Decimal(
      Math.min(100, percentComplete).toString()
    );

    // Check if challenge is complete
    if (updateData.current_day > challenge.total_days) {
      updateData.status = "completed";
    }

    // Update challenge
    const updatedChallenge = await this.challengeRepository.update(
      challenge.id,
      updateData
    );

    return this.mapChallengeToDetailedDto(updatedChallenge);
  }

  /**
   * Get completed challenges history
   */
  async getChallengeHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "completedDate",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<PaginatedResponseDto<CompletedChallengeDto>> {
    const { challenges, totalItems } =
      await this.challengeRepository.findCompletedByUserId(
        userId,
        page,
        limit,
        sortBy,
        sortOrder
      );

    // Map challenges to completed challenge DTO
    const mappedChallenges = challenges.map((challenge) =>
      this.mapToCompletedChallengeDto(challenge)
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
   * Get challenge activity log
   */
  async getChallengeActivity(
    challengeId: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<PaginatedResponseDto<ActivityLogDto> | null> {
    // First verify the challenge belongs to the user
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge || challenge.user_id !== userId) {
      return null;
    }

    // Get activities
    const { activities, totalItems } =
      await this.challengeRepository.findActivitiesByChallengeId(
        challengeId,
        page,
        limit,
        startDate,
        endDate
      );

    // Map activities to DTO
    const mappedActivities = activities.map((activity) =>
      this.mapToActivityLogDto(activity)
    );

    return {
      data: mappedActivities,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * Get challenge statistics
   */
  async getChallengeStatistics(
    userId: string,
    period: string = "all-time"
  ): Promise<ChallengeStatisticsDto> {
    const stats = await this.challengeRepository.getUserChallengeStats(
      userId,
      period
    );
    return {
      totalCompleted: stats.totalCompleted,
      totalSaved: stats.totalSaved,
      totalDays: stats.totalDays,
      averageConsistency: Math.round(stats.averageConsistency * 100) / 100,
    };
  }

  /**
   * Get user badges
   */
  async getBadges(userId: string): Promise<BadgeDto[]> {
    // Get all badges
    const allBadges = await this.challengeRepository.findBadges();

    // Get user badges
    const userBadges = await this.challengeRepository.findUserBadges(userId);
    const earnedBadgeIds = userBadges.map((ub) => ub.badge_id);

    // Map to DTOs with earned status
    return allBadges.map((badge) => ({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      color: badge.color,
      earned: earnedBadgeIds.includes(badge.id),
    }));
  }

  /**
   * Get challenge options for joining
   */
  async getChallengeOptions(): Promise<ChallengeOptionDto[]> {
    const options = await this.challengeRepository.getChallengeOptions();

    return options.map((option) => ({
      name: option.title,
      description: option.description,
      type: option.type,
      duration: option.duration,
    }));
  }

  /**
   * Get challenge categories
   */
  async getChallengeCategories(): Promise<string[]> {
    return this.challengeRepository.getChallengeCategories();
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(
    challengeId?: string,
    period: string = "all-time",
    limit: number = 10
  ): Promise<any[]> {
    // For now return mock data since real leaderboard would require more complex processing
    return [
      {
        userId: "user1",
        username: "JohnDoe",
        amountSaved: 125000,
        position: 1,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4x5rOmfOcPxJbvGrDbE3Tr74D2F_V_U0Jaw&s",
      },
      {
        userId: "user2",
        username: "JaneDoe",
        amountSaved: 100000,
        position: 2,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4x5rOmfOcPxJbvGrDbE3Tr74D2F_V_U0Jaw&s",
      },
      {
        userId: "user3",
        username: "BobSmith",
        amountSaved: 75000,
        position: 3,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4x5rOmfOcPxJbvGrDbE3Tr74D2F_V_U0Jaw&s",
      },
    ];
  }

  /**
   * Share challenge progress on social media
   */
  async shareChallenge(
    id: string,
    userId: string,
    platform: string,
    message?: string
  ): Promise<any> {
    const challenge = await this.challengeRepository.findById(id);

    if (!challenge || challenge.user_id !== userId) {
      return null;
    }

    // For now just return success with sharing link
    // I will not integrate with social media APIs
    return {
      success: true,
      platform,
      sharingLink: `https://domma.netlify.app/dashboard/challenges/share/${id}`,
      message:
        message || `Check out my progress on the ${challenge.title} challenge!`,
    };
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

  private mapToCatalogChallengeDto(item: any): CatalogChallengeDto {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      features: item.features,
      targetText: item.target_text,
      color: item.color,
      duration: item.duration,
      difficulty: item.difficulty,
      category: item.category,
      type: item.type,
    };
  }

  private mapToCompletedChallengeDto(challenge: any): CompletedChallengeDto {
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      completedDate: challenge.updated_at.toISOString(),
      duration: `${challenge.total_days} Days`,
      totalSaved: Number(challenge.current_amount),
      consistency: Number(challenge.percent_complete),
      color: challenge.color,
      type: challenge.type,
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
