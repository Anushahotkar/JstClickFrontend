import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name should be at least 2 characters",
    "string.max": "Product name should not exceed 100 characters",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),
  cost: Joi.number().min(0).required().messages({
    "number.base": "Cost must be a number",
    "number.min": "Cost must be greater than or equal to 0",
    "any.required": "Cost is required",
  }),
  description: Joi.string().allow("").max(500).messages({
    "string.max": "Description should not exceed 500 characters",
  }),
  image: Joi.string().uri().required().messages({
    "any.required": "Product image is required",
  }),
});


export const editProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name should be at least 2 characters",
    "string.max": "Product name should not exceed 100 characters",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),
  cost: Joi.number().min(0).required().messages({
    "number.base": "Cost must be a number",
    "number.min": "Cost must be greater than or equal to 0",
    "any.required": "Cost is required",
  }),
  description: Joi.string().allow("").max(500).messages({
    "string.max": "Description should not exceed 500 characters",
  }),
  image: Joi.string().uri().required().messages({
    "any.required": "Product image is required",
  }),
});

