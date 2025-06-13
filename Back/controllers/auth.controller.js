const mongoose = require("mongoose");
const User = require("../models/user.schema");
const TempUser = require("../models/tempuser.schema");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendValidationAccount,
  sendForgotPasswordEmail,
  validateNewPassword,
  sendModifyPassword,
  sendEmailChangeConfirmation,
} = require("../email/email");

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;

// 🔐 Utility Functions
const createTokenEmail = (email, tokenId) => {
  return jwt.sign({ email, tokenId }, SECRET_KEY, { expiresIn: "15m" });
};

const createAuthToken = (userId) => {
  return jwt.sign({ sub: userId.toString() }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};

const setCookieToken = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: isProd ? "none" : "lax", // <<== critical line!
    path: "/",
  });
};
// 🛡️ Validation Functions
const validateUserInput = (data, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Champs requis manquants: ${missingFields.join(", ")}`);
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkUserExists = async (email, username) => {
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  const tempUserExists = await TempUser.findOne({
    $or: [{ email }, { username }],
  });

  return { userExists, tempUserExists };
};

// 📩 Authentication Controllers
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    validateUserInput(req.body, ["username", "email", "password"]);

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Format d'email invalide.",
      });
    }

    const { userExists, tempUserExists } = await checkUserExists(
      email,
      username
    );

    if (userExists || tempUserExists) {
      return res.status(400).json({
        success: false,
        message:
          "Les identifiants fournis sont déjà utilisés. Veuillez en choisir d'autres ou vérifier votre boîte mail.",
      });
    }

    const tokenId = uuidv4();
    const token = createTokenEmail(email, tokenId);

    await sendConfirmationEmail(email, token);

    const tempUser = new TempUser({ username, email, password, tokenId });
    await tempUser.save();

    return res.status(201).json({
      success: true,
      message: "Confirmation envoyée. Consultez votre boîte mail.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur.",
    });
  }
};

const verifyMail = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.redirect(`${CLIENT_URL}/register?message=error`);
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const { email, tokenId } = decoded;

    const tempUser = await TempUser.findOne({ email, tokenId });
    if (!tempUser) {
      return res.redirect(`${CLIENT_URL}/register?message=error`);
    }

    const existingUser = await User.findOne({ email: tempUser.email });
    if (existingUser) {
      await tempUser.deleteOne();
      return res.redirect(`${CLIENT_URL}/register?message=alreadyRegistered`);
    }

    const avatar =
      tempUser.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        tempUser.username
      )}&background=random`;

    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      avatar,
    });
    await newUser.save();

    await tempUser.deleteOne();
    await sendValidationAccount(newUser.email);

    const authToken = createAuthToken(newUser._id);
    setCookieToken(res, authToken);

    return res.send(`<!DOCTYPE html>
<html><head><title>Email confirmé</title></head>
<body>
  <h2>Email confirmé ✅</h2>
  <p>Vous pouvez revenir sur votre onglet précédent.</p>
  <script>
    const bc = new BroadcastChannel("mail_verification_channel");
    bc.postMessage(${JSON.stringify({
      verified: true,
      userId: newUser._id.toString(),
    })});
    bc.close();
  </script>
</body>
</html>`);
  } catch (err) {
    console.error("Email verification error:", err);

    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.redirect(`${CLIENT_URL}/register?message=error`);
    }

    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const login = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    validateUserInput(req.body, ["email", "password"]);

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects.",
      });
    }

    const token = createAuthToken(user._id);
    setCookieToken(res, token);

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur.",
    });
  }
};

const currentUser = async (req, res) => {
  try {
    return res.status(200).json(req.user || null);
  } catch (error) {
    console.error("Current user error:", error);
    return res.status(400).json(null);
  }
};

const checkEmailValidation = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        validated: false,
        message: "Email requis.",
      });
    }

    const user = await User.findOne({ email });
    return res.json({
      validated: !!user,
      userId: user ? user._id : null,
    });
  } catch (err) {
    console.error("Check email validation error:", err);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur.",
    });
  }
};

// 🔄 Password Reset
const forgotMyPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis." });
    }

    const user = await User.findOne({ email });
    if (user) {
      const tokenId = uuidv4();
      const token = createTokenEmail(email, tokenId);

      await sendForgotPasswordEmail(email, token);

      user.resetTokenId = tokenId;
      await user.save();
    }

    // Always return success to prevent email enumeration
    return res.json({
      message: "Si un compte est associé, vous recevrez un mail.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    validateUserInput(req.body, ["password", "token"]);

    const decoded = jwt.verify(token, SECRET_KEY);
    const { email, tokenId } = decoded;

    const user = await User.findOne({ email, resetTokenId: tokenId });
    if (!user) {
      return res.status(400).json({
        message: "Jeton d'authentification invalide ou expiré",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetTokenId = null;
    await user.save();

    await validateNewPassword(user.email);

    return res.status(200).json({
      messageOk: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(400).json({
      message: "Jeton d'authentification invalide ou expiré",
    });
  }
};

// 👤 Profile Management
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated through this endpoint
    const restrictedFields = [
      "password",
      "email",
      "_id",
      "resetTokenId",
      "emailChangeToken",
    ];
    restrictedFields.forEach((field) => delete updates[field]);

    // Define allowed fields for profile updates
    const allowedFields = [
      "username",
      "gender",
      "age",
      "height",
      "heightUnit",
      "currentWeight",
      "currentWeightUnit",
      "goalWeight",
      "goalWeightUnit",
    ];

    // Filter updates to only include allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucun champ valide à mettre à jour.",
      });
    }

    // Check if username is being updated and if it's already taken
    if (filteredUpdates.username) {
      const existingUser = await User.findOne({
        username: filteredUpdates.username,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Ce nom d'utilisateur est déjà pris.",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
      select:
        "-password -resetTokenId -emailChangeToken -emailChangeTokenExpires -pendingEmail",
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Erreur serveur.",
    });
  }
};

// Legacy function for optional data updates during registration
const updateOptionalUserData = async (req, res) => {
  try {
    const { userId, ...fields } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID utilisateur invalide.",
      });
    }

    const allowedFields = [
      "gender",
      "age",
      "height",
      "heightUnit",
      "currentWeight",
      "currentWeightUnit",
      "goalWeight",
      "goalWeightUnit",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (fields[field] !== undefined) {
        updates[field] = fields[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucune donnée à mettre à jour.",
      });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select:
        "-password -resetTokenId -emailChangeToken -emailChangeTokenExpires -pendingEmail",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil mis à jour.",
      user,
    });
  } catch (err) {
    console.error("Update optional user data error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Erreur serveur.",
    });
  }
};

// 📧 Email Management
const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const userId = req.user.id || req.user._id;

    if (!newEmail || !validateEmail(newEmail)) {
      return res.status(400).json({
        message: "Format d'email invalide.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.email === newEmail) {
      return res.status(400).json({
        message: "Le nouvel email est identique à l'actuel.",
      });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

    user.pendingEmail = newEmail;
    user.emailChangeToken = token;
    user.emailChangeTokenExpires = expires;
    await user.save();

    await sendEmailChangeConfirmation(newEmail, token);

    return res.status(200).json({
      message: "Email de confirmation envoyé.",
    });
  } catch (err) {
    console.error("Request email change error:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const confirmEmailChange = async (req, res) => {
  try {
    let { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Lien invalide - token manquant.",
      });
    }

    token = decodeURIComponent(token).trim();

    const user = await User.findOne({
      emailChangeToken: token,
      emailChangeTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      const expiredUser = await User.findOne({ emailChangeToken: token });
      if (expiredUser) {
        return res.status(400).json({
          message:
            "Le lien de confirmation a expiré. Veuillez refaire une demande.",
        });
      }

      return res.status(400).json({
        message: "Lien invalide ou déjà utilisé.",
      });
    }

    const newEmail = user.pendingEmail;

    user.email = newEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email mis à jour avec succès !",
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Confirm email change error:", err);
    return res.status(500).json({
      message: "Erreur serveur. Veuillez réessayer.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id || req.user.id;

    validateUserInput(req.body, [
      "currentPassword",
      "newPassword",
      "confirmPassword",
    ]);

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Les mots de passe ne correspondent pas.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Mot de passe actuel incorrect.",
      });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit être différent de l'ancien.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await sendModifyPassword(user.email);

    return res.status(200).json({
      messageOk: "Mot de passe modifié avec succès.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: error.message || "Erreur serveur.",
    });
  }
};

// 🚪 Logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Déconnexion réussie.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion.",
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { avatar } = req.body;
    if (!avatar || typeof avatar !== "string" || !avatar.startsWith("http")) {
      return res.status(400).json({ message: "Invalid avatar URL." });
    }

    // Optionally: extra validation for avatar origin
    if (!avatar.includes("supabase.co")) {
      return res
        .status(400)
        .json({ message: "Avatar must be a Supabase URL." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
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
};
