import { UserModel } from "../config/db.js";
import { z} from "zod"
import type { Request,Response } from "express";
import bcrypt from "bcrypt"
export async function UserRegister(req:Request, res:Response){
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