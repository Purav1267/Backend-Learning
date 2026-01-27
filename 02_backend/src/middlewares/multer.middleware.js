// middleware means jaane se pehle yeh kaam karke jaana

import multer from "multer"
import fs from "fs"
import path from "path"


const storage = multer.diskStorage({
    destination: function (req,file,cb){
        const uploadPath = path.resolve(process.cwd(), "public", "temp")
        fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, uploadPath)
    },
    filename: function (req,file,cb) {
        cb(null,file.originalname)
    }
})

export const upload = multer({
    storage
})