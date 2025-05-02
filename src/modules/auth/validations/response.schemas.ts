import Joi from "joi";

/**
 * Response schemas for API documentation
 */

// User schema
export const userSchema = Joi.object({
  id: Joi.string().uuid().description("User ID"),
  email: Joi.string().email().description("User email address"),
  full_name: Joi.string().description("User's full name"),
  phone: Joi.string().allow(null).description("User's phone number"),
  university: Joi.string().allow(null).description("User's university"),
  major: Joi.string().allow(null).description("User's major or field of study"),
  role: Joi.string().valid("USER", "ADMIN").description("User role"),
  created_at: Joi.date().description("Account creation timestamp"),
  updated_at: Joi.date().description("Account last update timestamp")
});

// Token response schema
export const tokenResponseSchema = Joi.object({
  access_token: Joi.string().description("JWT access token for API authorization"),
  refresh_token: Joi.string().description("Refresh token for obtaining new access tokens"),
  user: userSchema
});

// Success response schema
export const successResponseSchema = Joi.object({
  status: Joi.boolean().valid(true).required().description("Response status"),
  message: Joi.string().required().description("Success message"),
  data: Joi.alternatives().try(
    Joi.object(),
    Joi.array(),
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.allow(null)
  ).description("Response data payload")
});

// Error response schema
export const errorResponseSchema = Joi.object({
  status: Joi.boolean().valid(false).required().description("Response status"),
  message: Joi.string().required().description("Error message"),
  error: Joi.object({
    code: Joi.string().required().description("Error code"),
    details: Joi.any().description("Additional error details")
  }).required().description("Error details")
}); 