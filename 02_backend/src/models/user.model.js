import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avator: {
        type: String, // cloudinary URL
        required: true
    },
    coverImage: {
        type: String
    },
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    refreshToken: {
        type: String
    } 

},{timestamps: true})

// this pre is a Middleware hook
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// we can't use arrow functions here cause it doesnt have the context of this . 
// as we want the this password to be encrypted before saving and arrow function doesn't help us in that 
// that why using basic function here.


// So we are going with sessions and cookies. So to access the cokkie you want the accesstoken but to access the session you want the refresh token.
// we will be storing the refresh token in the database.
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)