import { ApiError } from "../utils/ApiError.js";
import { asyncHandler2 } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler2(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user = user;
        // here we are adding a new object in the req.body so we made another object user in which the above user 
        // info is stored.
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }

})