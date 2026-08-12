const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please fill a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
      ],
    },

    adresse: {
      type: String,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    role: {
      type: String,
      enum: ["admin", "babysitter", "parent"]
    },

    image: {
      type: String,
      default: "default.jpg",
    },

    block: {
      type: Boolean,
      default: false,
    },

    // --- Parent fields ---
    numberOfChildren: {
      type: Number,
      min: [0, "Number of children cannot be negative"],
    },

    specialRequirements: {
      type: String,
    },

    // --- Babysitter fields ---
    hourlyRate: {
      type: Number,
      required: function () {
        return this.role === "babysitter";
      },
      min: [0, "Hourly rate cannot be negative"],
    },

    experienceYears: {
      type: Number,
      min: [0, "Years of experience cannot be negative"],
    },

    hasBackgroundCheck: {
      type: Boolean,
      default: false,
    },

    experience: {
      type: String, // Text biography or summary
    },

    availability: {
      type: String,
    },

    certif: {
      type: String,
    },

    score: {
      type: Number,
      default: 5.0,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    // --- Admin fields ---
    adminCode: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password automatically before saving to database
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err; 
  }
});

/**
 * Static Login Method
 */
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Incorrect email");
  }

  if (user.block) {
    throw new Error("User is blocked");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const updatedUser = await this.findByIdAndUpdate(
      user._id,
      { $inc: { loginAttempts: 1 } },
      { new: true }
    );

    if (updatedUser.loginAttempts >= 5) {
      await this.findByIdAndUpdate(user._id, { block: true });
      throw new Error("User is blocked due to too many failed login attempts");
    }

    throw new Error("Incorrect password");
  }

  // Reset login attempts on successful login
  await this.findByIdAndUpdate(user._id, { loginAttempts: 0 });

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;