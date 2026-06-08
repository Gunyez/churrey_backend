import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { sendResetEmail } from "../utils/sendEmail.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(32).toString("hex");
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken : token,
    });
    await newUser.save();
    

    // 🔥 TRY sending email but don't break registration
   try {
      console.log("📧 Sending verification email...");
      await sendVerificationEmail(email, token);
      console.log("✅ Verification email sent");
    } catch (err) {
      console.error("❌ Verification email failed:");
      console.error(err);
    }

    res.status(201).json(
      "Account created. Please check your email to verify."
    );
  } catch (err) {
    console.error(err);
    res.status(500).json("Registration failed");
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json("Invalid token");
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.status(200).json("Email verified successfully");
  } catch (err) {
    res.status(500).json("Verification failed");
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User not found");
    }
    if (!user.isVerified) {
      return res.status(403).json("Please verify your email first");
    }

    // compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("Invalid credentials");
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // remove password from response
    const { password: _, ...userData } = user._doc;

    // send cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });

  } catch (err) {
      console.error("🔥 LOGIN ERROR FULL:", err);
      console.error("🔥 STACK:", err.stack);

      res.status(500).json({
        message: err.message || "Server error",
      });
    }
};
// ================= RESET PASSWORD =================
// Request Reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json("Email is required");
    }

    const user = await User.findOne({ email });

    // For security: don't reveal if email exists
    if (!user) {
      return res.status(200).json(
        "If that email exists, a reset link has been sent"
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    await sendResetEmail(user.email, token);

    res.status(200).json(
      "If that email exists, a reset link has been sent"
    );
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json("Failed to process request");
  }
};

console.log("JWT:", process.env.JWT_SECRET);

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json("Password is required");
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json("Invalid or expired token");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json("Password reset successful");
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json("Reset failed");
  }
};


// ================= LOGOUT =================
export const logout = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json("Logged out successfully");
};
