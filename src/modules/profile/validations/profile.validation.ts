import Joi from "joi";

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(1).max(100).optional(),
  phone: Joi.string()
    .allow("", null)
    .pattern(/^[0-9+\-().\s]{7,20}$/)
    .optional(),
  university: Joi.string().min(1).max(100).optional(),
  major: Joi.string().min(1).max(100).optional(),
});

export const uploadProfilePictureSchema = Joi.object({
  file: Joi.any()
    .meta({ swaggerType: "file" })
    .required()
    .description("Profile picture file"),
});
