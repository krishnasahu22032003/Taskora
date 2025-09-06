import type { JwtPayload } from "jsonwebtoken";
import type { Document } from "mongoose";
import type { UserModel } from "../config/db.js"; 

declare module "express-serve-static-core" {
  interface Request {
    user?: (typeof UserModel.prototype & Document) | ({ id: string } & JwtPayload);
  }
}
