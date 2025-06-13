const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Basic disk storage (adjust as needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars/");
  },
  filename: function (req, file, cb) {
    // Safer: prepend userID and timestamp
    const ext = path.extname(file.originalname);
    cb(null, `${req.user ? req.user._id : "anon"}_${Date.now()}${ext}`);
  },
});

// Only allow images (JPEG, PNG, WebP, GIF)
function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

const {
  signup,
  verifyMail,
  checkEmailValidation,
  updateOptionalUserData,
  login,
  logout,
  currentUser,
  forgotMyPassword,
  resetPassword,
  updateProfile,
  requestEmailChange,
  confirmEmailChange,
  changePassword,
  updateAvatar,
} = require("../controllers/auth.controller");

const {
  authentication,
  optionalAuthentication,
} = require("../middlewares/auth.middleware.js");
const {
  loginLimiter,
  generalLimiter,
  strictLimiter,
  passwordResetLimiter,
} = require("../middlewares/rateLimit.middleware");

const {
  signupValidation,
  loginValidation,
  passwordChangeValidation,
  emailChangeValidation,
  profileUpdateValidation,
} = require("../middlewares/validation.middleware");

// 📝 PUBLIC ROUTES (No authentication required)

// Registration with validation
router.post("/signup", generalLimiter, signupValidation, signup);

// Login with validation and stricter rate limiting
router.post("/login", loginLimiter, loginValidation, login);

// Email verification (no rate limit for better UX)
router.get("/verify-email/:token", verifyMail);

// Password reset flow
router.post("/forgot-password", passwordResetLimiter, forgotMyPassword);

router.post("/reset-password", strictLimiter, resetPassword);

// Email validation check (for registration flow)
router.get("/check-email-validation", generalLimiter, checkEmailValidation);

// Optional data update (for registration completion)
// Uses userId from body, so no auth required but could be enhanced
router.post("/update-optional", generalLimiter, updateOptionalUserData);

// Email change confirmation (uses token, no auth needed)
router.get("/confirm-email-change", generalLimiter, confirmEmailChange);

// 🔐 PROTECTED ROUTES (Authentication required)

// User session management
router.get("/current-user", authentication, currentUser);

router.post("/logout", authentication, logout);

// Profile management (unified endpoint with validation)
router.put(
  "/profile",
  authentication,
  generalLimiter,
  profileUpdateValidation,
  updateProfile
);

// Password management with strict validation and rate limiting
router.post(
  "/change-password",
  authentication,
  strictLimiter,
  passwordChangeValidation,
  changePassword
);

// Email change request with validation and strict rate limiting
router.post(
  "/request-email-change",
  authentication,
  strictLimiter,
  emailChangeValidation,
  requestEmailChange
);

// 🔧 ALTERNATIVE ROUTES (Enhanced versions)

// Enhanced optional data update that works with or without authentication
router.post(
  "/update-optional-enhanced",
  optionalAuthentication,
  generalLimiter,
  profileUpdateValidation,
  (req, res, next) => {
    // If user is authenticated, use their ID from token
    // If not authenticated, require userId in body (legacy support)
    if (req.user) {
      req.body.userId = req.user._id;
    } else if (!req.body.userId) {
      return res.status(400).json({
        success: false,
        message: "ID utilisateur requis ou authentification nécessaire.",
      });
    }
    next();
  },
  updateOptionalUserData
);

router.patch("/avatar", authentication, generalLimiter, updateAvatar);
module.exports = router;
