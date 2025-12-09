const asyncHandler1 = (requestHandler)=>{
    async(req,res,next)=>{
        try {
            await requestHandler(req,res,next)
        } catch (error) {
            res.status(err.code || 500).json({
                success: false,
                message: err.message
            })
        }
    }
}

// export {asyncHandler1}

// So there are 2 methods of asyncHandler 

const asyncHandler2 = (requestHandler) => {
    async(req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>{next(error)})
    }
}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {()=>{}}   it just means a function inside a function or function is having a return as a function
// it means a callback function mai he andar ek aur callback function.
// const asyncHandler = (func) => {async()=>{}}
// const asyncHandler = (func) => async()=>{}
// higher order function
const asyncHandler = (func) => async(req,res,next) => {
    try {
        await func(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}


export {asyncHandler}