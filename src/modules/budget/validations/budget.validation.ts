import Joi from "joi";

export const createBudgetSchema = Joi.object({
  category: Joi.string().required(),
  amount: Joi.number().positive().required(),
  month_year: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .description("Month in YYYY-MM format"),
  notes: Joi.string().allow("", null),
});

export const updateBudgetSchema = Joi.object({
  category: Joi.string(),
  amount: Joi.number().positive(),
  month_year: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .description("Month in YYYY-MM format"),
  notes: Joi.string().allow("", null),
});

export const getBudgetSummarySchema = Joi.object({
  month_year: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .description("Month in YYYY-MM format"),
});
