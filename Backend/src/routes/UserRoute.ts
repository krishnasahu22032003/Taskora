import express from 'express'
import { ChangePassword, GetCurrentUser, UpdateProfile, UsersignIn, UserSignUp } from '../controller/Usercontroller.js';
import authMiddleware from '../middleware/Auth.js';
import { Logout } from '../controller/Usercontroller.js';
const userRouter = express.Router();

// public routes
 
userRouter.post("/signup", UserSignUp)
userRouter.post("/signin", UsersignIn)

// private routes

userRouter.get("/me", authMiddleware ,GetCurrentUser)
userRouter.put("/profile",authMiddleware,UpdateProfile)
userRouter.put("/password",authMiddleware,ChangePassword)
userRouter.post("/logout", authMiddleware, Logout);

export default userRouter
