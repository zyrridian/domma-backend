import Joi from "joi";

export const createChallengeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  total_days: Joi.number().integer().min(1).required(),
  target_amount: Joi.number().min(0).required(),
  color: Joi.string()
    .valid(
      "amber",
      "blue",
      "cyan",
      "emerald",
      "fuchsia",
      "green",
      "indigo",
      "lime",
      "orange",
      "pink",
      "purple",
      "red",
      "rose",
      "sky",
      "teal",
      "violet",
      "yellow"
    )
    .required(),
  difficulty: Joi.number().valid(1, 2, 3, 4, 5).required(),
  type: Joi.string().valid("saving", "spending", "habit").required(),
  targetText: Joi.string().required(),
  features: Joi.array().items(Joi.string()).required(),
  steps: Joi.array().items(Joi.string()).required(),
  tips: Joi.array().items(Joi.string()).required(),
});

export const updateChallengeSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  total_days: Joi.number().integer().min(1),
  target_amount: Joi.number().min(0),
  color: Joi.string()
    .valid(
      "amber",
      "blue",
      "cyan",
      "emerald",
      "fuchsia",
      "green",
      "indigo",
      "lime",
      "orange",
      "pink",
      "purple",
      "red",
      "rose",
      "sky",
      "teal",
      "violet",
      "yellow",
      "gray",
      "neutral",
      "stone",
      "zinc"
    )
    .required(),
  difficulty: Joi.number().integer().min(1).max(5),
  type: Joi.string().valid("saving", "spending", "habit"),
  targetText: Joi.string(),
  features: Joi.array().items(Joi.string()),
  tips: Joi.array().items(Joi.string()),
  steps: Joi.array().items(Joi.string()),
}).min(1); // At least one field must be provided

export const getPaginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
}).unknown();

export const getActiveChallengesSchema = getPaginationSchema;

export const getCatalogChallengesSchema = getPaginationSchema.keys({
  type: Joi.string().valid("saving", "spending", "habit"),
  difficulty: Joi.number().integer().min(1).max(5),
  category: Joi.string(),
});

export const checkInSchema = Joi.object({
  date: Joi.string().isoDate().required(),
  amount: Joi.number().positive().allow(null),
  completed: Joi.boolean().required(),
  difficulty: Joi.number().min(1).max(5).allow(null),
  notes: Joi.string().allow("", null),
  shareProgress: Joi.boolean().required(),
});

export const getChallengeHistorySchema = getPaginationSchema.keys({
  sortBy: Joi.string()
    .valid("completedDate", "totalSaved", "consistency", "duration")
    .default("completedDate"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

export const getChallengeActivitySchema = getPaginationSchema.keys({
  startDate: Joi.string().isoDate(),
  endDate: Joi.string().isoDate(),
});

export const getChallengeStatisticsSchema = Joi.object({
  period: Joi.string()
    .valid("all-time", "yearly", "monthly")
    .default("all-time"),
});

export const getLeaderboardSchema = Joi.object({
  challengeId: Joi.string().uuid(),
  period: Joi.string()
    .valid("weekly", "monthly", "all-time")
    .default("all-time"),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

export const shareProgressSchema = Joi.object({
  platform: Joi.string()
    .valid("facebook", "twitter", "instagram", "whatsapp")
    .required(),
  message: Joi.string().allow("", null),
});
