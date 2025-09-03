import express from "express"
const app =express()
const port = 5000

app.get('/',(req,res)=>{
res.json({
    Message:"hello dsdsworld"
})
})
app.listen(port,()=>{
    console.log(`running on port number ${port}`)
})