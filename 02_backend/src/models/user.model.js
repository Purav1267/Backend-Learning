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
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
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
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password , 10)
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
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// An access token is a short-lived credential used to authenticate API requests, while
// a refresh token is a long-lived credential used to obtain new access tokens without 
// requiring the user to log in again, improving both security and user experience.
export const User = mongoose.model("User",userSchema) 
// the concept of accesstoken and refresh token is 
// Ahh got it 👍 — you want the **USER’S POV journey**, not backend theory.
// Let’s walk through it **exactly how a real user experiences it**, step by step.

// ---

// ## 📱 Real User Journey (Access Token + Refresh Token)

// Imagine you’re using **Instagram / Amazon / Swiggy**.

// ---

// ### 1️⃣ First time login (User sees this)

// 👤 **User action**

// * Opens the app
// * Enters email & password
// * Clicks **Login**


// 🧠 **Behind the scenes**

// * Server verifies credentials
// * Server sends:

//   * Access token
//   * Refresh token

// 👀 **User experience**
// ✅ User is logged in
// ❌ User doesn’t see tokens

// ---

// ### 2️⃣ Using the app normally

// 👤 **User action**

// * Scrolls feed
// * Likes posts
// * Adds items to cart
// * Checks orders

// 👀 **User experience**
// ✅ Everything works smoothly
// ❌ No login prompts

// 🧠 **Behind the scenes**

// * App automatically sends **access token** with every action

// ---

// ### 3️⃣ App stays open for a long time

// 👤 **User action**

// * Locks phone
// * Comes back after 30–40 minutes
// * Continues scrolling

// 👀 **User experience**
// ✅ Still logged in
// ❌ No “session expired” popup

// 🧠 **Behind the scenes**

// * Old access token expired
// * App uses **refresh token**
// * Gets a new access token silently

// ---

// ### 4️⃣ User refreshes page / reopens app

// 👤 **User action**

// * Refreshes browser
// * Closes and reopens app

// 👀 **User experience**
// ✅ Still logged in
// ❌ No need to enter password again

// 🧠 **Behind the scenes**

// * Refresh token still valid 
// and it checks in the database that both the refresh token are same or not?
// like whatever the user is sending the refresh token it should be saved in the database then only new 
// access token is issued and the refreshtoken is accessed through the cookies at the login time.
// * New access token is issued

// ---

// ### 5️⃣ User logs out

// 👤 **User action**

// * Clicks **Logout**

// 👀 **User experience**
// 🔒 Redirected to login screen
// 🧠 **Behind the scenes**

// * Refresh token deleted
// * Access token eventually expires
// * Session fully ended

// ---

// ### 6️⃣ User opens app next day

// 👤 **User action**

// * Opens app again

// 👀 **User experience**
// ❌ Login required again

// 🧠 **Behind the scenes**

// * Refresh token expired or removed
// * User must authenticate again

// ---

// ## 🧠 Why user NEVER notices tokens

// From the user’s perspective:

// * No sudden logouts
// * No frequent password prompts
// * Seamless experience

// That smoothness is **because of refresh tokens**.

// ---

// ## 🚫 What user WOULD notice without refresh tokens

// ❌ Logged out every 10–15 minutes
// ❌ “Session expired” popups
// ❌ Bad UX

// ---

// ## Interview One-Liner (User POV) 🧠

// > From a user’s perspective, access and refresh tokens allow them to stay logged in seamlessly while using the app, without frequent login prompts, even when the app is reopened or kept idle for long periods.

// ---

// If you want, I can also explain:

// * What the user sees when tokens are **stolen**
// * Why logout from **one device** doesn’t log out from others
// * How “Log out from all devices” works IRL

// Just tell me 😄
