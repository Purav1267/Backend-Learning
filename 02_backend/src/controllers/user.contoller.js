import { ApiError } from "../utils/ApiError.js";
import { asyncHandler2 } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler2(async (req,res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, choeck for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response


    const {fullName, email, username, password} = req.body
    // console.log(req.body);
    console.log("Email: ",email);

    // if(fullName === ""){
    //     throw new ApiError(400,"fullname is required")
    // }

    // if we do this then we have to write multiple if statements like 
    // this and then throw error through this if statements 
    // there is another method of this too

    if([fullName, username, email, password].some((field)=>{
        return field?.trim() === ""
    })){
        throw new ApiError(400,"All Fields are compulsory/required.")
    }
    // this approach is somewhat advance approach and pro coder use it
    // it's something new for me too.
    // .some has the property that when returning if all the element 
    // return false then it will return false and if any element 
    // return true then it will return true and in this case 
    // it will check for all the element in the array and then 
    // tell us which element is returning true or false.

    // ? means optional chaining
    // and there is this field?.trim() it means that if field is 
    // undefined or null it will not work. it will only work when 
    // field is not null or not undefined. 
    // so it means when the field is having some data in it or it 
    // is not ( undefined or null ) then it will trim it and see if the 
    // field is "" exactly empty it means the data which was there 
    // was just empty spaces so we have to throw a error over there

    const existedUser = await User.findOne({
        $or: [{username},{email}]
        // User.findOne is also from mongodb/moongose query
        // $or is just a or conditonal operator that is from mongodb/moongose query
        // it just return the user if their username or email matches the given 
        // username or email in the database
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists.")
    }
    // this means if the existedUser is having any data or true then
    // it is an error


    const avatarLocalPath = req.files?.avatar[0]?.path
    // this is the way of getting the access of avatar and its path
    // it is just the way of getting the avatar through the user.routes
    // and the multer that we wrote it just gives us the exact path

    // const coverImageLocalPath = req.files?.coverImage[0]?.path


    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // this is the classical method of finding the path of the file

    // ? we have been using optional condition here cause of null 
    // and undefined feature as the data should not be null and undefined 
    // that we are talking to

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloundinary(avatarLocalPath)
    const coverImage = await uploadOnCloundinary(coverImageLocalPath)

    
    if(req.files)

    if(!avatar){
        throw new ApiError(400,"Avatar not uploaded correctly on cloudinary.")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        // like this is the case why we have done this cause in the case of avatar we have 
        // done all the exception handeling as in if the avatar is not there then throw the error
        // but in the case of coverImage we didn't do that so here we did something like 
        // optional condition on coverimage like if it exists then ok and give me the url but 
        // if it doesn't exist then just make it empty.
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    // this is the way of removing the password and refresh token 
    // while creating a new user and we are finding that new user with the help 
    // of _id firstly we did this and in continuatiuon we thought of removing password and refreshtoken too
    // and this .select method is used to select all in the first as by default but 
    // if you write "-password -refreshToken" then it will deselect 
    // both of them 


    // the concept in the the createduser is like first we made the user in the user variable using User.create()
    // and then we gave the details of the user and then in the created user we first find that user by using 
    // findbyid(user._id) and then select all the information while removing the password and the refresh token 
    // and then storing all the info in the createduser. and then in the last we can see we are returning the createduser only. 
   if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
    // we have used the apiresponse file that we made and in that the structure was defined
})

export {registerUser}