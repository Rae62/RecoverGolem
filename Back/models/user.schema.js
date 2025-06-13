const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
      validate: {
        validator: function (value) {
          if (value.startsWith("$2b$")) return true;
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          );
        },
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
      required: false,
    },
    age: {
      type: Number,
      min: [18, "Minimum age is 18."],
      max: [100, "Maximum age is 100."],
      default: null,

      required: false,
    },
    height: {
      type: Number,
      min: [100, "Minimum height is 100 cm."],
      max: [250, "Maximum height is 250 cm."],
      default: null,

      required: false,
    },
    heightUnit: {
      type: String,
      enum: ["cm", "inch"],
      default: "cm",

      required: false,
    },
    currentWeight: {
      type: Number,
      min: [30, "Minimum weight is 30 kg."],
      max: [300, "Maximum weight is 300 kg."],
      required: false,
      default: null,
    },
    currentWeightUnit: {
      type: String,
      enum: ["Kg", "Lb"],
      default: "Kg",
      required: false,
    },
    goalWeight: {
      type: Number,
      min: [30, "Minimum weight is 30 kg."],
      max: [300, "Maximum weight is 300 kg."],
      required: false,
      default: null,
    },
    goalWeightUnit: {
      type: String,
      enum: ["Kg", "Lb"],
      default: "Kg",
      required: false,
    },
    resetTokenId: { type: String, default: null },
    pendingEmail: { type: String },
    emailChangeToken: { type: String },
    emailChangeTokenExpires: { type: Date },
  },

  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (!this.password.startsWith("$2")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  next();
});

// Hide sensitive fields when returning user data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

userSchema.index({ emailChangeTokenExpires: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
