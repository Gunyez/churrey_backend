import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional password update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(
        req.body.password,
        salt
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );

    const { password, ...userData } = updatedUser._doc;

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to update user");
  }
};