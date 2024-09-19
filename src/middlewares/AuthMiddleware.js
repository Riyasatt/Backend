import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path"

export const verifyToken = (req,res,next) =>{

      const token = req.cookies.jwt;
      if (!token) return res.status(403).send('No authentication. You are not Logged in.');
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
      } catch (err) {
        return res.status(401).send('Invalid Token');
      }
      next();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and PDF files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter
});
