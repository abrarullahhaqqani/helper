import getToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Signs up a user
 * @param {Object} req.body - The request body
 * @param {string} req.body.name - The user's name
 * @param {string} req.body.email - The user's email
 * @param {string} req.body.password - The user's password
 * @returns {Object} res - The response object
 * @returns {number} res.status - The status code
 * @returns {Object} res.json - The response body
/*******  c5a96c26-753d-4d90-838d-f26fc2be762a  *******/
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "Email already exist",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });
    const token = getToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false, //Remember to change to true and sameSite: "none" when in production/deploying
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Sign up error: ${error}`,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = getToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false, //Remember to change to true and sameSite: "none" when in production/deploying
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Login error: ${error}`,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: `Logout error: ${error}`,
    });
  }
};
