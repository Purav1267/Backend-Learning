import mongoose from "mongoose" 
import { DB_NAME } from "../constants.js"

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("MONGODB connection error. ",error)
        process.exit(1)
    }
}


export default connectDB







// import mongoose from "mongoose";

// const connectDB = async ()=>{
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`MongoDB${connectionInstance.connection.HOST}`)
//     } catch (error) {
//         console.error("MongoDB Error: ",error)
//         process.exit(1)
//     }
// }


// import mongoose from "mongoose"
// import { DB_NAME } from "../constants";
// import express from "express";

// const app = express()

// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("MongoDB Error: ",error);
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`Server is running on PORT Number: ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error: ",error)
//         throw error
//     }
// })()