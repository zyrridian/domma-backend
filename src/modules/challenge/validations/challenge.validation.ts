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
