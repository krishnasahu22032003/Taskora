import express from "express"
import userRouter from "./routes/UserRoute.js"
import taskrouter from "./routes/TaskRoute.js"
import cookieParser from "cookie-parser";
const app =express()
const port = 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/user",userRouter)
app.use("/api/Task",taskrouter)

app.listen(port,()=>{
    console.log(`running on port number ${port}`)
})