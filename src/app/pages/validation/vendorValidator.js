// src/validations/vendorValidation.js
import Joi from "joi";

export const vendorActionSchema = Joi.object({
  action: Joi.string()
    .valid("Approve", "Dis Approved", "Block", "Dropdown")
    .required()
    .messages({
      "any.required": "Action is required",
      "any.only": "Invalid action selected",
    }),
  reason: Joi.string()
    .max(200)
    .allow("", null)
    .messages({
      "string.max": "Reason must be at most 200 characters",
    }),
});
