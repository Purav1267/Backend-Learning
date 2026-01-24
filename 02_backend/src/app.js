import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

//routes routes

import userRouter from './routes/user.routes.js'



// routes declaration

app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users/anyroutewecanwritehere

// so this is the basic route that whenever anyone will go to our 
// site it will look like this the users will be there first and then
// anything or anywhere we can go from there. so here the route is being
// declared first. it is just here for helping us to not import 
// again and again of userRouter just the way we did right now 
// if we dont use this approach then we have to import every route 
// here in app.js too for making the website route clear to the code 
// because of this it is easy for the app.js to direclty route it to 
// user.route file and then we can go anywhere. it just removes the 
// extra code that we would write if we dont make user.route.js file 
// as otherwise we have to write every route here in app.js only. this
// makes the app.js less clumsy.
export  {app}