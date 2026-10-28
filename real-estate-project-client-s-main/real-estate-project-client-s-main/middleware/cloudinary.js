const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "property-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // transformation: [
    //   { width: 1200, height: 900, crop: "limit" },
    //   { quality: "auto" },
    //   { fetch_format: "auto" },
    // ],
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

// Error wrapper — multer/cloudinary errors ko JSON mein convert karta hai
const upload = {
  single: (fieldName) => (req, res, next) => {
    multerUpload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary Error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }
      next();
    });
  },
  array: (fieldName, maxCount) => (req, res, next) => {
    multerUpload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary Error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }
      next();
    });
  },
};

module.exports = upload;