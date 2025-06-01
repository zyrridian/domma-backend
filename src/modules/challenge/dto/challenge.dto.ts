export interface CreateChallengeDto {
  title: string;
  description: string;
  total_days: number;
  target_amount: number;
  color: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: "saving" | "spending" | "habit";
  targetText: string;
  features: string[];
  steps: string[];
  tips: string[];
}

export interface GetChallengeDto {
  id: string;
  title: string;
  description: string;
  total_days: number;
  target_amount: number;
  color: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: "saving" | "spending" | "habit";
  targetText: string;
  features: string[];
}

export interface GetChallengeDetailDto {
  id: string;
  title: string;
  description: string;
  total_days: number;
  target_amount: number;
  color: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: "saving" | "spending" | "habit";
  targetText: string;
  features: string[];
  steps: string[];
  tips: string[];
}

export interface ChallengeResponseDto {
  id: string;
  challenge_id?: string;
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

export interface DetailedChallengeResponseDto extends ChallengeResponseDto {
  steps: string[];
  tips: string[];
  activityLog: ActivityLogDto[];
}

export interface ActivityLogDto {
  id: string;
  action: string;
  date: string;
  amount?: number;
  completed: boolean;
  difficulty?: number;
  notes?: string;
  shared: boolean;
}

export interface ChallengeSummaryDto {
  activeChallenges: number;
  completedChallenges: number;
  failedChallenges: number;
  totalSaved: number;
}

export interface PaginationDto {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  itemCount: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationDto;
}

export interface CatalogChallengeDto {
  id: string;
  title: string;
  description: string;
  features: string[];
  targetText: string;
  color: string;
  duration: string;
  difficulty: number;
  category: string;
  type: "saving" | "spending" | "habit";
}

export interface CheckInDto {
  date: string;
  amount?: number;
  completed: boolean;
  difficulty?: number;
  notes?: string;
  shareProgress: boolean;
}

export interface CompletedChallengeDto {
  id: string;
  title: string;
  description: string;
  completedDate: string;
  duration: string;
  totalSaved: number;
  consistency: number;
  color: string;
  type: "saving" | "spending" | "habit";
}

export interface ChallengeStatisticsDto {
  totalCompleted: number;
  totalSaved: number;
  totalDays: number;
  averageConsistency: number;
}

export interface BadgeDto {
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
}

export interface ChallengeOptionDto {
  name: string;
  description: string;
  type: "saving" | "spending" | "habit";
  duration: string;
}

export interface JoinChallengeDto {
  challenge_id: string;
  goal?: string;
  notifications?: Record<string, any> | null;
  start_date: string;
}
