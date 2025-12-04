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