import Joi from "joi";

export const registerSchema = Joi.object({
  full_name: Joi.string().required(),
  university: Joi.string().required(),
  major: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().optional(),
  university: Joi.string().optional(),
  major: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
