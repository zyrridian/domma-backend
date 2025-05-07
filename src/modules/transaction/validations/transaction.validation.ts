import Joi from "joi";

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
});
