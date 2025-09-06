import express from 'express'
import { ChangePassword, GetCurrentUser, UpdateProfile, UsersignIn, UserSingUp } from '../controller/Usercontroller.js';
import authMiddleware from '../middleware/Auth.js';
const userRouter = express.Router();

// public routes
 
userRouter.post("/signup", UserSingUp)
userRouter.post("/signin", UsersignIn)

// private routes

userRouter.get("/me", authMiddleware ,GetCurrentUser)
userRouter.put("/profile",authMiddleware,UpdateProfile)
userRouter.put("/password",authMiddleware,ChangePassword)

export default userRouter
