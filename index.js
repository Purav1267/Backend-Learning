require('dotenv').config()
console.log("PURAV - Chai aur Code");

const express = require('express')
const app = express()
const port = 4000

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.get('/twitter',(req,res)=>{
    res.send("puravmalik24")
})

app.get('/login',(req,res)=>{
    res.send('<h1> Please login at chai aur code </h1>')
})

app.get('/youtube',(req,res)=>{
    res.send("<h2>ElectroRyzen</h2>")
})

app.listen(process.env.PORT,()=>{
    console.log(`Example app listening on port ${process.env.PORT}`);
})