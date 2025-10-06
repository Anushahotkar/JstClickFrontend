// validations/category.validation.js
import Joi from "joi";

// ObjectId validator for MongoDB
export const objectIdSchema = Joi.string()
  .length(24)
  .hex()
  .required()
  .messages({
    "string.length": "Invalid category ID",
    "string.hex": "Invalid category ID",
    "any.required": "Category ID is required",
  });

// Category fields validation
export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Service category name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),

  description: Joi.string()
    .allow("")
    .max(300)
    .messages({
      "string.max": "Description cannot exceed 300 characters",
    }),

  image: Joi.any()
    .required()
    .messages({
      "any.required": "At least one image is required",
    }),
});

// Middleware to validate image
export const validateCategoryImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Category image is required",
    });
  }

  // Optional: check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid image type. Allowed: jpeg, png, webp",
    });
  }

  next();
};


//  Combined validation middleware: category fields + image

// export const editCategorySchema = createCategorySchema;

export const serviceCategorySchema=createCategorySchema;


// Edit category: image optional
export const editCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),
  description: Joi.string()
    .allow("")
    .max(300)
    .optional()
    .messages({
      "string.max": "Description cannot exceed 300 characters",
    }),
  image: Joi.any().optional(), // ✅ image is optional
});


// ✅ New: Delete category schema
export const deleteCategorySchema = Joi.object({
  categoryId: objectIdSchema,
  publicId: Joi.string().allow("").optional(), // Cloudinary public_id may be optional
});