import multer from "multer"
import multerS3 from "multer-s3"
import { S3Client } from "@aws-sdk/client-s3"
import path from 'path'
import fs from 'fs'
// const {config} =  require("../config/config")


const isProd = true

//check if the folder exist to save the image
const uploadDir = path.resolve('uploads')
//if not exist, create new folder with the name 'uploads'
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive:true}) //create nested parent folder if needed
}
 
// -------------------------handle storage destination and filename for image--------------
const localStorage = multer.diskStorage({
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
// -------------------- S3 CLIENT --------------------
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// -------------------- S3 STORAGE --------------------
const s3Storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const filename = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// -------------------- FINAL MIDDLEWARE --------------------
const upload = multer({
  storage: isProd ? s3Storage : localStorage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});

export default upload




// cloudinary

// function ProductForm() {
//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       price: "",
//       images: []
//     },
//     onSubmit: async (values) => {
//       console.log(values);
//       await axios.post("/api/products", values);
//     }
//   });

//   const handleFileChange = async (e) => {
//     const files = e.target.files;
//     const formData = new FormData();

//     for (let file of files) {
//       formData.append("images", file);
//     }

//     const res = await fetch("http://localhost:5000/api/upload-images", {
//       method: "POST",
//       body: formData
//     });

//     const data = await res.json();

//     formik.setFieldValue("images", [
//       ...formik.values.images,
//       ...data.files
//     ]);
//   };

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <input
//         name="name"
//         value={formik.values.name}
//         onChange={formik.handleChange}
//       />

//       <input
//         name="price"
//         type="number"
//         value={formik.values.price}
//         onChange={formik.handleChange}
//       />

//       <input 
//         type="file" 
//         multiple 
//         onChange={handleFileChange} 
//       />

//       <div>
//         {formik.values.images.map((img, i) => (
//           <img key={i} src={img.url} width={100} alt="" />
//         ))}
//       </div>

//       <button type="submit">Submit</button>
//     </form>
//   );
// }