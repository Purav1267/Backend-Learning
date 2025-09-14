import express from "express";
// const express = require("express")
// import statement gives us error sometimes as it is async 
// but this const express is synchronus so it doesn't error 
// and this const express statement is old statement as well as sync


// to fix the import error coming due to async 
// we just have to go to package.json file and above the script 
// we just have to write "type":"module" in it to fix this error
// and this type: module means we have to assemble every js file in a 
// module not as regular js files 
// or in easy language we can say that we want to save every js file
// like in a structure based module not like every single file is running
// executing. it should be like many files share information with each other

const app = express()

app.get("/",(req,res)=>{
    res.send("Server is ready")
})

// get a list of 5 jokes

app.get("/api/jokes",(req,res)=>{
    const jokes = [
        {
            id:1,
            title:"A joke",
            content: "This is a joke"
        },
        {
            id:2,
            title:"A 2nd joke",
            content: "This is 2nd joke"
        },
        {
            id:3,
            title:"A 3rd joke",
            content: "This is 3rd joke"
        },
        {
            id:4,
            title:"A 4th joke",
            content: "This is 4th joke"
        },
        {
            id:5,
            title:"A 5th joke",
            content: "This is 5th joke"
        }
    ]
    res.send(jokes)
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
   console.log(`Server is running on http://localhost:${port}`);
})

