import jwt from "jsonwebtoken";
import { UserModel } from "../config/db.js";
import JWT_USER_SECRET from "../config/config.js";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = JWT_USER_SECRET;

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] as string | undefined;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;

    const user = await UserModel.findById(payload.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
}
