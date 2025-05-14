import Joi from "joi";

export const createRecurringTransactionSchema = Joi.object({
  frequency: Joi.string()
    .valid("daily", "weekly", "monthly", "yearly")
    .required(),
  end_type: Joi.string()
    .valid("never", "on_date", "after_occurrences")
    .required(),
  end_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .when("end_type", {
      is: "on_date",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  occurrences: Joi.number().integer().positive().when("end_type", {
    is: "after_occurrences",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});

export const updateRecurringTransactionSchema = Joi.object({
  frequency: Joi.string().valid("daily", "weekly", "monthly", "yearly"),
  end_type: Joi.string().valid("never", "on_date", "after_occurrences"),
  end_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .when("end_type", {
      is: "on_date",
      then: Joi.required(),
      otherwise: Joi.allow("", null),
    }),
  occurrences: Joi.number()
    .integer()
    .positive()
    .when("end_type", {
      is: "after_occurrences",
      then: Joi.required(),
      otherwise: Joi.allow(null),
    }),
});

export const createTransactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("income", "expense").required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  transaction_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  transaction_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/)
    .required(),
  payment_method: Joi.string().required(),
  notes: Joi.string().allow("", null),
  recurring: createRecurringTransactionSchema,
});

export const updateTransactionSchema = Joi.object({
  amount: Joi.number().positive(),
  type: Joi.string().valid("income", "expense"),
  description: Joi.string(),
  category: Joi.string(),
  transaction_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  transaction_time: Joi.string().pattern(
    /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/
  ),
  payment_method: Joi.string(),
  notes: Joi.string().allow("", null),
  recurring: Joi.alternatives().try(
    updateRecurringTransactionSchema,
    Joi.boolean().valid(false),
    Joi.allow(null)
  ),
});

export const getTransactionSummary = Joi.object({
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .description("Start date in YYYY-MM-DD format"),
  endDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .description("End date in YYYY-MM-DD format"),
}).and("startDate", "endDate");
