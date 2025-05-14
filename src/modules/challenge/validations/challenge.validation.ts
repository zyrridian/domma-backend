import Joi from "joi";

export const createChallengeSchema = Joi.object({
  name: Joi.string().required(),
  startDate: Joi.string().isoDate().required(),
  notifications: Joi.object({
    daily: Joi.boolean().required(),
    progress: Joi.boolean().required(),
  }).required(),
  goal: Joi.string().allow("", null),
  type: Joi.string().valid("saving", "spending", "habit").required(),
});

export const updateChallengeSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  targetAmount: Joi.number().positive(),
  startDate: Joi.string().isoDate(),
  endDate: Joi.string().isoDate(),
  status: Joi.string().valid("active", "completed", "failed"),
  category: Joi.string(),
  color: Joi.string(),
  difficulty: Joi.number().integer().min(1).max(5),
  type: Joi.string().valid("saving", "spending", "habit"),
  steps: Joi.array().items(Joi.string()),
  tips: Joi.array().items(Joi.string()),
  notifications: Joi.object({
    daily: Joi.boolean(),
    progress: Joi.boolean(),
  }),
  goal: Joi.string().allow("", null),
}).min(1); // At least one field must be provided
