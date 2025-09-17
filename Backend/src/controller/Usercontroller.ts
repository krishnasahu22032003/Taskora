import { UserModel } from "../config/db.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import JWT_USER_SECRET from "../config/config.js"; 
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

// signup logic
export async function UserSignUp(req: Request, res: Response) {
  const requiredbody = z.object({
    username: z.string(),
    email: z.string().email().min(5).max(50),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/),
  });

  const parsedata = requiredbody.safeParse(req.body);
  if (!parsedata.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsedata.error.format(),
    });
  }

  const { username, email, password } = parsedata.data;

  if (await UserModel.findOne({ email })) {
    return res
      .status(409)
      .json({ success: false, message: "User with this email already exists" });
  }

  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    await UserModel.create({ username, email, password: hashedpassword });
    return res.status(201).json({
      success: true,
      message: "You are signed up successfully",
    });
  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// sign in logic
export async function UsersignIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(403).json({ success: false, message: "User does not exist, please sign up first" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(403).json({ success: false, message: "Incorrect credentials" });

    const token = jwt.sign({ id: user._id }, JWT_USER_SECRET, { expiresIn: "7d" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// get current user
export async function GetCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await UserModel.findById(req.user.id).select("username email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// update profile
export async function UpdateProfile(req: Request, res: Response) {
  const updateSchema = z.object({ username: z.string().min(1), email: z.string().email() });
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success) return res.status(400).json({ success: false, message: parseResult.error.issues.map(e => e.message).join(", ") });

    const { username, email } = parseResult.data;
    const exists = await UserModel.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) return res.status(409).json({ success: false, message: "Email already used by another account" });

    const user = await UserModel.findByIdAndUpdate(req.user.id, { username, email }, { new: true, runValidators: true }).select("username email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// change password
export async function ChangePassword(req: Request, res: Response) {
  const { currentpassword, newpassword } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  if (!currentpassword || !newpassword || !passwordRegex.test(newpassword)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 chars, include uppercase, lowercase, number, and special char",
    });
  }

  try {
    const user = await UserModel.findById(req.user?.id).select("password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(currentpassword, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();
    return res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// logout
export async function Logout(req: Request, res: Response) {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
