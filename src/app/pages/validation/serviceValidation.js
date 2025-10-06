import Joi from "joi";

export const serviceSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": `"name" is required`,
  }),
  description: Joi.string().allow(""),
  cost: Joi.number().required().messages({
    "number.base": `"cost" must be a number`,
    "any.required": `"cost" is required`,
  }),
  category: Joi.string().required().messages({
    "string.empty": `"category" is required`,
  }),
 user: Joi.string().optional(),
userType: Joi.string().optional(),

  image: Joi.any()
  .custom((file, helpers) => {
    if (!file) return file;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/avif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return helpers.error("any.invalid");
    }
    return file;
  })
  .allow(null)
  .messages({
    "any.invalid": `"image" must be a valid image file`,
  }),

});
