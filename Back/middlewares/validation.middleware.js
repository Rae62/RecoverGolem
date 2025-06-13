// middlewares/validation.middleware.js - New validation middleware
const { body, validationResult } = require("express-validator");

// Validation middleware function
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array(), "Got body:", req.body);
    return res.status(400).json({
      success: false,
      message: "Données invalides.",
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for different endpoints
const signupValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 30 caractères.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores."
    ),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Format d'email invalide."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre."
    ),

  handleValidationErrors,
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Format d'email invalide."),

  body("password").notEmpty().withMessage("Mot de passe requis."),

  handleValidationErrors,
];

const passwordChangeValidation = [
  body("currentPassword").notEmpty().withMessage("Mot de passe actuel requis."),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Le nouveau mot de passe doit contenir au moins 8 caractères.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre."
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Les mots de passe ne correspondent pas.");
    }
    return true;
  }),

  handleValidationErrors,
];

const emailChangeValidation = [
  body("newEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Format d'email invalide."),

  handleValidationErrors,
];

const profileUpdateValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 30 caractères.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores."
    ),

  body("age")
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage("L'âge doit être entre 13 et 120 ans."),

  body("height")
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage("La taille doit être entre 100 et 250 cm."),

  body("currentWeight")
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage("Le poids actuel doit être entre 30 et 300 kg."),

  body("goalWeight")
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage("Le poids objectif doit être entre 30 et 300 kg."),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Le genre doit être: male, female ou other."),

  handleValidationErrors,
];

module.exports = {
  signupValidation,
  loginValidation,
  passwordChangeValidation,
  emailChangeValidation,
  profileUpdateValidation,
  handleValidationErrors,
};
