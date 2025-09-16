import { UserModel } from "../config/db.js";
import { success, z } from "zod"
import jwt from "jsonwebtoken";
import JWT_USER_SECRET from "../config/config.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt"

// signup logic

export async function UserSingUp(req: Request, res: Response) {
  const requiredbody = z.object({
    username: z.string(),
    email: z.string().email().min(5).max(50),
    password: z.string().min(5).max(50).regex(/[a-z]/).regex(/[A-Z]/)
  })
  const parsedata = requiredbody.safeParse(req.body)
  if (!parsedata.success) {
    res.status(401).json({
      message: "incorrect credentials"
    })
    return
  }
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    res.status(400).json({ success: false, Message: "All fields required" })
  }
  if (await UserModel.findOne({ email })) {
    return res.status(409).json({ success: false, Message: "User with this email already exists" })
  }

  let throwerror = false
  try {
    const hashedpassword = await bcrypt.hash(password, 10)
    await UserModel.create({
      username: username,
      email: email,
      password: hashedpassword
    })
  } catch (e) {
    res.status(401).json({
      Message: "Server error"
    })
    throwerror = true
  }
  if (!throwerror) {
    res.status(200).json({
      success:true,
     message: "You are signed up successfully"
    })
  }
}
// sing in logic
export async function UsersignIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User does not exist, please sign up first",
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(403)
        .json({ success: false, message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_SECRET, {
      expiresIn: "7d",
    });

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
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error, please try again later" });
  }
}

// get current user function
export async function GetCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, Message: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user.id).select("username email");

    if (!user) {
      return res.status(404).json({ success: false, Message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, Message: "Server error" });
  }
}

// update profile function

export async function UpdateProfile(req: Request, res: Response) {
  const updateSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
  });
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, Message: "Unauthorized" });
    }


    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        Message: parseResult.error.issues.map(e => e.message).join(", ")
      });
    }

    const { username, email } = parseResult.data;

    const exists = await UserModel.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res.status(409).json({
        success: false,
        Message: "Email already used by another account"
      });
    }

    // Update user
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select("username email");

    if (!user) {
      return res.status(404).json({ success: false, Message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, Message: "Server error" });
  }
}

// update password function 

export async function ChangePassword(req: Request, res: Response) {
  const { currentpassword, newpassword } = req.body
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
  if (!currentpassword || !newpassword || !passwordRegex.test(newpassword)) {
    return res.status(400).json({ success: false, Message: "Password must be at least 8 characters long and include one uppercase letter, one number, and one special character" })
  }
  try {
   
    const user = await UserModel.findById(req.user?.id).select("password")
    if (!user) {
      return res.status(404).json({ success: false, Message: "User not found" })
    }
    const match = await bcrypt.compare(currentpassword, user.password)
    if (!match) {
      return res.status(401).json({ success: false, Message: "Current password is incorrect" })
    }
    user.password = await bcrypt.hash(newpassword, 10)
    await user.save()
    res.json({ success: true, Message: "Password changed successfully" })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, Message: "Server error" })
  }
}



