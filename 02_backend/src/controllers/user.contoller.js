import { ApiError } from "../utils/ApiError.js";
import { asyncHandler2 } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token.")
    }
}

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

const loginUser = asyncHandler2(async(req,res)=>{
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie


    const {email,username,password} = req.body

    if(!username && !email){
        throw new ApiError(400,"username or email is required.")
    }

    // here is an alternative for the above code snippet
    // if(!(username || email)){
    //     throw new ApiError(400,"username or email is required.")
    // }

   const user = await User.findOne({
    $or: [{username}, {email} ]
    })

    if(!user){
        throw new ApiError(404,"user does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials")
   }

    const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    // so this options variable is for cookies and in this if we write the following httpOnly as true, 
    // and secure as true then it will only get updated through server side otherwise cookies can get 
    // updated in the frontend too if we dont true these parameters

    // so by default cookie can be modified in frontend too. and with these security steps frontend can only 
    // see the cookie , can't modify it further.
    
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(
          200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler2(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        },
        // here new is like jo aapko response milega usme new updated value milegi   
    )
        const options = {
        httpOnly : true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out"))
})


const refreshAccessToken = asyncHandler2(async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request / token")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used.")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        } 
        // so this options make the cookie powerfull enough to get updated through backend only 
        // frontend cannot edit it but can see it.
        const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken , options)
        .cookie("refreshToken",newrefreshToken, options)
        .json(new ApiResponse(200,{accessToken,refreshToken: newrefreshToken},"Access Token refreshed."))
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler2(async (req,res) => {
    const {oldPassword,newPassword} = req.body
    // we have used req.user.id because for changing the password user must be loggedin and if it is loggedin 
    // that means it should have came through our middleware and if it came throguh our middleware then 
    // req.user = user is an object stored in the user database which has all the information about the user
    // and from that we can get the user.id and then the process is simple
    const user  = await User.findById(req.user?._id)
    // as this is a database call then it must have await cause for not getting error afterwards as there can 
    // be possibility that database se saman laane mai time lgta ho.

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    // so this isPasswordCorrect and it is a special method we made 
    // came from user.model.js file in which we have defined it as 
    // a bcrypt comparison between passwords
    // and it gives output as true or false.

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})
    // i am saving this because then only that pre function in user.model will run and check
    // if password was changed or not if changed then make a new hash of 10 character and save it 

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Changed Successfully."))
})

const getCurrentUser = asyncHandler2(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,"Current user fetched successfully")
})

const updateAccountDetails = asyncHandler2(async(req,res)=>{
    const {fullName,email} = req.body

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        {new: true}
        // so this {new: true} is there for returning the new saved info that we updated right now. 
        // means update hone baad jo information hai voh return hoti hai
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account Details updated successfully"))
})

const updateUserAvatar = asyncHandler2(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    // the is the new avatar file path which we are talking about so like it is 
    // the new avatar which is being locally saved with multer and then the local path is saved over here
    // and then this local path file is uploaded to the cloudinary and then from the cloudinary we'll get the 
    // response back and in the response there will be the avatar.url adn public id 
    // and then we are just left with updating the new avatar with the previous one
    // so for that we'll find the user._id and then set the new avatar.url over there 
    // and atlast we'll return the status with a great happy message.

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar = await uploadOnCloundinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Updated User Avatar successfully."))
    
})

const updateUserCoverImage = asyncHandler2(async(req,res)=>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing.")
    }

    const coverImage = await uploadOnCloundinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200,user,"Cover Image is successfully updated."))
})

export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser
    ,updateAccountDetails,updateUserAvatar,updateUserCoverImage}