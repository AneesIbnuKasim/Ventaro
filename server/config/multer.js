import multer from "multer"
import path from 'path'
import fs from 'fs'


//check if the folder exist to save the image
const uploadDir = path.resolve('uploads')
//if not exist, create new folder with the name 'uploads'
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive:true}) //create nested parent folder if needed
}
 
// -------------------------handle storage destination and filename for image--------------
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename:(req, file, cb)=>{
        const filename = Date.now()+'-'+Math.round(Math.random())
        cb(null, filename+path.extname(file.originalname))
    }
})

// ---------------------filter to only allow images-----------------------
const fileFilter = (req, file, cb)=>{
    const allowed = /jpeg|jpg|png|webp/
    const ext = path.extname(file.originalname).toLowerCase()
    allowed.test(ext) ? cb(null,true) : cb(new Error('Only images are allowed'))
}

// --------------------------Upload middleware-------------------
const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize:3*1024*1024}  //to limit size to 3 mb
})

export default upload