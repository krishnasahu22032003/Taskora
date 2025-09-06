import mongoose from "mongoose";
import { Schema,model } from "mongoose";
import dotenv from "dotenv"
dotenv.config()
mongoose
.connect(process.env.MONGO_URL as string)
.then(()=>{
    console.log("connected to database ")
})
.catch((err)=>{
console.log(err,"failed to connect to database")
})

const userSchema = new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
export  const UserModel = model("User",userSchema)