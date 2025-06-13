// middlewares/authMiddleware.js - Enhanced version
const jwt = require("jsonwebtoken");
const User = require("../models/user.schema");

const authentication = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Token manquant.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded.sub) {
      return res.status(401).json({
        success: false,
        message: "Token invalide.",
      });
    }

    // Get user from database (ensure user still exists)
    const user = await User.findById(decoded.sub).select(
      "-password -resetTokenId -emailChangeToken -emailChangeTokenExpires"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé.",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré. Veuillez vous reconnecter.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erreur d'authentification.",
    });
  }
};

// Optional authentication middleware (for routes that work with or without auth)
const optionalAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.sub).select(
        "-password -resetTokenId -emailChangeToken -emailChangeTokenExpires"
      );
      req.user = user;
    }

    next();
  } catch (error) {
    // If token is invalid, continue without user (optional auth)
    req.user = null;
    next();
  }
};

module.exports = {
  authentication,
  optionalAuthentication,
};
