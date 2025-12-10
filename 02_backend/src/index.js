// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:"./env"
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ",err);
})



// const app = express()

// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("Error: ",error)
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`Server is running on Port Number: ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("Error: ",error)
//         throw error
//     }
// })()
// // here in the catch block we can also use console.log too both are same thing.







// import mongoose from "mongoose"
// import { DB_NAME } from "./constants.js"
// import express from "express"

// const app = express()


// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)   
//         app.on("error",(error)=>{
//             console.log(`DB Connected but error is coming: ${error}`);
//             throw error
//         })
        
//         app.listen(process.env.PORT || 8000,()=>{
//             console.log(`Server is running on PORT: ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error(`Error is: `,error)
//         throw error
//     }
// })()

import mongoose from "mongoose"
require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
dotenv.config({path: '/.env'})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Error is: ",error);
})



// catch block is different in both trycatch block and promise block. so it means in try catch block the error is inside only but in promise
// you have to give a callback function in catch block of the promise.