import jwt from "jsonwebtoken";
import User from "../config/db.js";
import JWT_USER_SECRET from "../config/config.js";
import type { Request, Response, NextFunction } from "express";
import { success } from "zod";
const JWT_SECRET = JWT_USER_SECRET


export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] as string | undefined;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(' ')[1];

  try{
const payload = jwt.verify(token,JWT_SECRET)
const user = await User.findById(payload.id).select('-password')  
if(!user){
    return res.status(401).json({success:false,Message:"user not found"})
}
req.user=user
next()
  }catch(err){
    console.log("jwt verification failed",err)
    return res.status(401).json({success:false,Message:"token invalid or expired"})
  }
}


