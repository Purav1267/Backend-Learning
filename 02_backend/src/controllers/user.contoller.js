import { asyncHandler2 } from "../utils/asyncHandler.js";

const registerUser = asyncHandler2(async (req,res) => {
    res.status(200).json({
        message: "Hey i am Purav."
    })
})

export {registerUser}