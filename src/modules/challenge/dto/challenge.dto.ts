export interface CreateChallengeDto {
  name: string;
  startDate: string;
  notifications: {
    daily: boolean;
    progress: boolean;
  };
  goal?: string;
  type: "saving" | "spending" | "habit";
}

export interface ChallengeResponseDto {
  id: string;
  title: string;
  description: string;
  progress: string;
  percentComplete: number;
  color: string;
  savingsLabel: string;
  savingsAmount: number;
  actionText: string;
  type: "saving" | "spending" | "habit";
  checkInDescription: string;
  duration: string;
  difficulty: number;
  targetAmount: number;
  status: "active" | "completed" | "failed";
  startDate: string;
  endDate: string;
}
