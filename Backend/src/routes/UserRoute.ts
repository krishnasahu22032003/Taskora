import express from 'express'
import { ChangePassword, GetCurrentUser, UpdateProfile, UsersignIn, UserSingUp } from '../controller/Usercontroller.js';

const userRouter = express.Router();

// public routes
 
userRouter.post("/signup", UserSingUp)
userRouter.post("/signin", UsersignIn)

// private routes

userRouter.get("/me",GetCurrentUser)
userRouter.put("./profile",UpdateProfile)
userRouter.put("./password",ChangePassword)


