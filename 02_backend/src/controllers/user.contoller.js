import { ApiError } from "../utils/ApiError.js";
import { asyncHandler2 } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

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

    const existedUser = User.findOne({
        $or: [{username},{email}]
        // User.findOne is also from mongodb/moongose query
        // $or is just a or conditonal operator that is from mongodb/moongose query
        // it just return the user if their username or email matches the given 
        // username or email in the database
    })
    if(existedUser){
        throw new ApiError
    }
    // this means if the existedUser is having any data or true then
    // it is an error
})

export {registerUser}