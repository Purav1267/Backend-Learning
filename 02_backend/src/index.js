// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:"./env"
})
connectDB()




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