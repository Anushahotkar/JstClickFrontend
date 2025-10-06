// src/validations/providerAction.validation.js
import Joi from "joi";

export const providerActionSchema = Joi.object({
  action: Joi.string()
    .valid("Approve", "Dis Approved", "Suspend / Block", "Pending")
    .required()
    .messages({
      "any.only": "Invalid action selected",
      "string.empty": "Action is required",
    }),
  reason: Joi.string().allow("").max(200).messages({
    "string.max": "Reason must not exceed 200 characters",
  }),
});
