


// // const express = require("express");
// // const router = express.Router();

// // const upload = require("../middleware/upload");

// // const {
// //   addImage,
// //   getImages,
// //   deleteImage,
// //   updateImage,
// //   setFeaturedImage,
// //   getImageCount,
// // } = require("../controller/propertyImageController");

// // // 🔥 FILE UPLOAD ROUTE
// // router.post("/property-images", upload.single("image"), addImage);

// // // GET
// // router.get("/property-images", getImages);

// // // DELETE
// // router.delete("/property-images", deleteImage);

// // // UPDATE IMAGE FILE
// // router.patch("/property-images", upload.single("image"), updateImage);


// // router.patch("/property-images/featured", setFeaturedImage);

// // router.get("/property-images/count", getImageCount);


// // module.exports = router;



const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinary");
// const upload = require("../middleware/upload");

const {
  addImage,
  getImages,
  deleteImage,
  updateImage,
  setFeaturedImage,
  getImageCount,
} = require("../controller/propertyImageController");

// ✅ ADD IMAGE
router.post("/property-images", upload.single("image"), addImage);
// ✅ GET ALL IMAGES
router.get("/property-images", getImages);

// ✅ GET IMAGE COUNT
router.get("/property-images/count", getImageCount);

// ✅ SET FEATURED IMAGE (Query Based)
router.patch("/property-images/featured", setFeaturedImage);

// ✅ UPDATE IMAGE FILE (Query Based)
router.patch("/property-images", upload.single("image"), updateImage);

// ✅ DELETE IMAGE (Query Based)
router.delete("/property-images", deleteImage);

module.exports = router;