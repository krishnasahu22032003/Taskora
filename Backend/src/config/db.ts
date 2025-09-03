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