const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const tempUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      match: [
        /^(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/,
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
      ],
    },
    tokenId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Expiration automatique après 15 minutes
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

// Hash le mot de passe avant sauvegarde
tempUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Cache les champs sensibles
tempUserSchema.methods.toJSON = function () {
  const tempUser = this.toObject();
  delete tempUser.password;
  delete tempUser.__v;
  delete tempUser.token; // tu peux le retirer aussi si inutile côté front
  return tempUser;
};

const TempUser = mongoose.model("TempUser", tempUserSchema);
module.exports = TempUser;
