import express from "express";
// const express = require("express")
// import statement gives us error sometimes as it is async 
// but this const express is synchronus so it doesn't error 
// and this const express statement is old statement as well as sync
const app = express()

app.get("/",(req,res)=>{
    res.send("Server is ready")
})

const port = process.env.PORT || 3000

app.listen(process.env.PORT,()=>{
   console.log(`Server is running on http://localhost:${port}`);
})

