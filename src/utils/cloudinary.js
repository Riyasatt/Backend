import { v2 as cloudinary } from "cloudinary";
import expressAsyncHandler from "express-async-handler";

// Configuration
cloudinary.config({
  cloud_name: "dbmxqjy4i",
  api_key: "295574326499383",
  api_secret: "ntvi7KbhvAS6MHP6wjhHAj0clpc", // Click 'View API Keys' above to copy your API secret
});

const uploadMultiple = expressAsyncHandler(async(req,res,next)=>{
      try {
            const images = req.files

            const imageUrls = {}

            for (const [fieldName, files] of Object.entries(images)) {
                  // Handle each file in the field
                  const uploadPromises = files.map(file =>
                    cloudinary.uploader.upload(file.path, { resource_type: "auto" })
                  );
            
                  // Wait for all files in the field to upload
                  const results = await Promise.all(uploadPromises);
            
                  // Collect URLs
                  imageUrls[fieldName] = results.map(result => result.secure_url);
                }
            
                req.imageUrls = imageUrls;
                console.log(req.imageUrls);
            

            next();
      } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server error while uploading image to cloudinary")
      }
})

export default uploadMultiple