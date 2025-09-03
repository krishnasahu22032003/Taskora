import { UserModel } from "../config/db.js";
import  {success, z} from "zod"
import   jwt  from "jsonwebtoken";
import JWT_USER_SECRET from "../config/config.js";
import type { Request,Response } from "express";
import bcrypt from "bcrypt"

// signin logic

export async function UserSingUp(req:Request, res:Response){
    const requiredbody = z.object({
        username:z.string(),
                email: z.string().email().min(5).max(50),
        password: z.string().min(5).max(50).regex(/[a-z]/).regex(/[A-Z]/)
    })
    const parsedata = requiredbody.safeParse(req.body)
    if(!parsedata.success){
        res.status(401).json({
            message:"incorrect credentials"
        })
            return 
    }
       const {username,email,password} = req.body
       if(!username || !email || !password ){
        res.status(400).json({success:false,Message:"All fields required"})
       }
    if(await UserModel.findOne({email})){
      return res.status(409).json({success:false,Message:"User with this email already exists"})
    }

       let throwerror =false
       try{
        const hashedpassword =await bcrypt.hash(password,10)
        await UserModel.create({
            username:username,
            email:email,
            password:hashedpassword
        })
       }catch(e){
        res.status(401).json({
            Message:"Server error"
        })
        throwerror=true
       }
       if(!throwerror){
        res.status(200).json({
            Message:"You are signed Up"
        })
       }
} 
// sing up logic
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


