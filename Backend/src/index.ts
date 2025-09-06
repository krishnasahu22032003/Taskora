import express from "express"
import { UserModel } from "./config/db.js"
import userRouter from "./routes/UserRoute.js"
const app =express()
const port = 5000
app.use(express.json())
app.use("/api/user",userRouter)
app.get('/',(req,res)=>{
res.json({
    Message:"hello dsdsworld"
})
})
app.listen(port,()=>{
    console.log(`running on port number ${port}`)
})