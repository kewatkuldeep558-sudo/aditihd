

// const prisma = require("../lib/prisma");
// const upload = require("../middleware/upload");
// const fs = require("fs");
// const path = require("path");

// /**
//  * @swagger
//  * tags:
//  *   name: Property Images
//  *   description: Property image upload & management
//  */



// /**
//  * @swagger
//  * /api/property-images:
//  *   post:
//  *     summary: Upload image for a property
//  *     tags: [Property Images]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - propertyId
//  *               - image
//  *             properties:
//  *               propertyId:
//  *                 type: string
//  *                 example: 65b9d2f8c4f0e9b123456789
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       201:
//  *         description: Image uploaded successfully
//  *       400:
//  *         description: Validation error
//  *       500:
//  *         description: Server error
//  */
// const addImage = async (req, res) => {
//   try {
//     const { propertyId } = req.query;

//     if (!propertyId) {
//       return sendResponse(res, 400, "propertyId is required");
//     }

//     if (!req.file) {
//       return sendResponse(res, 400, "Image file is required");
//     }

//     const imageUrl = `/uploads/property-images/${req.file.filename}`;

//     // 🔢 Auto displayOrder per property
//     const lastImage = await prisma.propertyImage.findFirst({
//       where: { propertyId },
//       orderBy: { displayOrder: "desc" }
//     });

//     const displayOrder = lastImage ? lastImage.displayOrder + 1 : 1;

//     const image = await prisma.propertyImage.create({
//       data: {
//         propertyId,
//         imageUrl,
//         displayOrder
//       }
//     });

//     return sendResponse(res, 201, "Image uploaded successfully", image);

//   } catch (error) {
//     console.error("ADD IMAGE ERROR:", error);
//     return sendResponse(res, 500, "Error uploading image", error.message);
//   }
// };

// /**
//  * @swagger
//  * /api/property-images:
//  *   get:
//  *     summary: Get property images
//  *     tags: [Property Images]
//  *     parameters:
//  *       - in: query
//  *         name: propertyId
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: imageId
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Images fetched successfully
//  *       500:
//  *         description: Server error
//  */
// const getImages = async (req, res) => {
//   try {
//     const { propertyId, imageId } = req.query;

//     const where = {};
//     if (propertyId) where.propertyId = propertyId;
//     if (imageId) where.id = imageId;

//     const images = await prisma.propertyImage.findMany({
//       where,
//       orderBy: { displayOrder: "asc" }
//     });

//     return sendResponse(res, 200, "Images fetched successfully", {
//       total: images.length,
//       images
//     });

//   } catch (error) {
//     console.error("GET IMAGE ERROR:", error);
//     return sendResponse(res, 500, "Error fetching images", error.message);
//   }
// };



// /**
//  * @swagger
//  * /api/property-images:
//  *   delete:
//  *     summary: Delete a property image
//  *     tags: [Property Images]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the image to delete
//  *     responses:
//  *       200:
//  *         description: Image deleted successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Image deleted successfully"
//  *       400:
//  *         description: Validation error (missing id)
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Image id is required"
//  *       404:
//  *         description: Image not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Image not found"
//  *       500:
//  *         description: Server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Server Error"
//  */

// // Delete property image controller
// const deleteImage = async (req, res) => {
//   try {
//     const { id } = req.query;

//     if (!id) return sendResponse(res, 400, "Image id is required");

//     // 1️⃣ Find the image in database
//     const image = await prisma.propertyImage.findUnique({
//       where: { id },
//     });

//     if (!image) return sendResponse(res, 404, "Image not found");

//     // 2️⃣ Delete physical file from 'uploads/property-images/' folder
//     if (image.imageUrl) {
//       const fileName = path.basename(image.imageUrl); // Extract file name
//       const filePath = path.join(process.cwd(), "uploads", "property-images", fileName);

//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//         console.log(`Deleted file: ${filePath}`);
//       } else {
//         console.warn(`File not found: ${filePath}`);
//       }
//     }

//     // 3️⃣ Delete the database record
//     await prisma.propertyImage.delete({
//       where: { id },
//     });

//     return sendResponse(res, 200, "Image deleted successfully");
//   } catch (error) {
//     console.error("DELETE IMAGE ERROR:", error);
//     return sendResponse(res, 500, "Server Error", error.message);
//   }
// };

// // Simple sendResponse function
// const sendResponse = (res, status, message, data = null) => {
//   res.status(status).json({ success: status < 400, message, data });
// };


// /**
//  * @swagger
//  * /api/property-images:
//  *   patch:
//  *     summary: Update property image
//  *     tags: [Property Images]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - id
//  *               - image
//  *             properties:
//  *               id:
//  *                 type: string
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Image updated successfully
//  *       400:
//  *         description: Validation error
//  *       500:
//  *         description: Server error
//  */
// const updateImage = async (req, res) => {
//   try {
//     const { id } = req.query;

//     if (!id) return sendResponse(res, 400, "id is required");
//     if (!req.file) return sendResponse(res, 400, "Image file is required");

//     const imageUrl = `/uploads/property-images/${req.file.filename}`;

//     const updated = await prisma.propertyImage.update({
//       where: { id },
//       data: { imageUrl }
//     });

//     return sendResponse(res, 200, "Image updated successfully", updated);

//   } catch (error) {
//     console.error("UPDATE IMAGE ERROR:", error);
//     return sendResponse(res, 500, "Server Error", error.message);
//   }
// };
// /**
//  * @swagger
//  * /api/property-images/featured:
//  *   patch:
//  *     summary: Set a property image as featured and update display order
//  *     tags: [Property Images]
//  *     description: >
//  *       Sets a specific image as the featured image for a property. The selected image's `isFeatured` is set to `true` and `displayOrder` becomes 1. 
//  *       All other images for the property have `isFeatured` set to `false` and their `displayOrder` is updated starting from 2.
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the image to set as featured
//  *       - in: query
//  *         name: propertyId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the property
//  *     responses:
//  *       200:
//  *         description: Featured image updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Featured image updated successfully"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                     imageUrl:
//  *                       type: string
//  *                     isFeatured:
//  *                       type: boolean
//  *                       example: true
//  *                     displayOrder:
//  *                       type: integer
//  *                       example: 1
//  *       400:
//  *         description: Validation error (missing id or propertyId)
//  *       404:
//  *         description: Image not found
//  *       500:
//  *         description: Server error
//  */


// const setFeaturedImage = async (req, res) => {
//   try {
//     const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
//     const propertyId = Array.isArray(req.query.propertyId) ? req.query.propertyId[0] : req.query.propertyId;

//     if (!id || !propertyId) {
//       return sendResponse(res, 400, "Image id and propertyId are required");
//     }

//     // Check image exists
//     const image = await prisma.propertyImage.findUnique({ where: { id } });
//     if (!image) return sendResponse(res, 404, "Image not found");

//     // Get all other images of this property excluding the selected one
//     const otherImages = await prisma.propertyImage.findMany({
//       where: {
//         propertyId,
//         NOT: { id }
//       },
//       orderBy: { displayOrder: 'asc' } // maintain current order
//     });

//     // 1️⃣ Set selected image as featured with displayOrder = 1
//     const updatedFeatured = await prisma.propertyImage.update({
//       where: { id },
//       data: {
//         isFeatured: true,
//         displayOrder: 1
//       },
//     });

//     // 2️⃣ Update other images: isFeatured = false and displayOrder = 2,3,4...
//     for (let i = 0; i < otherImages.length; i++) {
//       await prisma.propertyImage.update({
//         where: { id: otherImages[i].id },
//         data: {
//           isFeatured: false,
//           displayOrder: i + 2, // starts from 2
//         },
//       });
//     }

//     // 3️⃣ Update property table featuredImageUrl
//     await prisma.property.update({
//       where: { id: propertyId },
//       data: { featuredImageUrl: updatedFeatured.imageUrl },
//     });

//     return sendResponse(res, 200, "Featured image updated successfully", updatedFeatured);
//   } catch (error) {
//     console.error("SET FEATURED ERROR:", error);
//     return sendResponse(res, 500, "Server Error", error.message);
//   }
// };



// /**
//  * @swagger
//  * /api/property-images/count:
//  *   get:
//  *     summary: Get total number of images for a property
//  *     tags: [Property Images]
//  *     parameters:
//  *       - in: query
//  *         name: propertyId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the property to count images for
//  *     responses:
//  *       200:
//  *         description: Image count fetched successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Image count fetched successfully"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     count:
//  *                       type: integer
//  *                       example: 5
//  *       400:
//  *         description: Validation error (missing propertyId)
//  *       500:
//  *         description: Server error
//  */
// const getImageCount = async (req, res) => {
//   try {
//     const { propertyId } = req.query;

//     if (!propertyId) {
//       return sendResponse(res, 400, "propertyId is required");
//     }

//     // Count images for this property
//     const count = await prisma.propertyImage.count({
//       where: { propertyId },
//     });

//     return sendResponse(res, 200, "Image count fetched successfully", { count });
//   } catch (error) {
//     console.error("GET IMAGE COUNT ERROR:", error);
//     return sendResponse(res, 500, "Error fetching image count", error.message);
//   }
// };


// module.exports = {
//   addImage,
//   getImages,
//   deleteImage,
//   updateImage,
//   setFeaturedImage,
//   getImageCount
// };



const prisma = require("../lib/prisma");
const { v2: cloudinary } = require("cloudinary");

/**
 * @swagger
 * tags:
 *   name: Property Images
 *   description: Property Image Upload & Management APIs
 */
const sendResponse = (res, status, message, data = null, error = null) => {
  res.status(status).json({
    success: status < 400,
    message,
    data,
    error: error ? error.message || error : null
  });
};

// ===============================
// ADD IMAGE
// ===============================

/**
 * @swagger
 * /api/property-images:
 *   post:
 *     summary: Upload property image
 *     tags: [Property Images]
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
const addImage = async (req, res) => {
  try {
    const { propertyId } = req.query;

    if (!propertyId)
      return sendResponse(res, 400, "propertyId is required");

    if (!req.file)
      return sendResponse(res, 400, "Image file is required");

    const lastImage = await prisma.propertyImage.findFirst({
      where: { propertyId },
      orderBy: { displayOrder: "desc" },
    });

    const displayOrder = lastImage ? lastImage.displayOrder + 1 : 1;

    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        imageUrl: req.file.path,
        publicId: req.file.filename,
        displayOrder,
      },
    });

    return sendResponse(res, 201, "Image uploaded successfully", image);
  } catch (error) {
    return sendResponse(res, 500, "Error uploading image", error.message);
  }
};

// ===============================
// GET IMAGES
// ===============================

/**
 * @swagger
 * /api/property-images:
 *   get:
 *     summary: Get property images
 *     tags: [Property Images]
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *       - in: query
 *         name: imageId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Images fetched successfully
 *       500:
 *         description: Server error
 */
const getImages = async (req, res) => {
  try {
    const { propertyId, imageId } = req.query;

    const where = {};
    if (propertyId) where.propertyId = propertyId;
    if (imageId) where.id = imageId;

    const images = await prisma.propertyImage.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return sendResponse(res, 200, "Images fetched successfully", {
      total: images.length,
      images,
    });
  } catch (error) {
    return sendResponse(res, 500, "Error fetching images", error);
  }
};

// ===============================
// DELETE IMAGE
// ===============================

/**
 * @swagger
 * /api/property-images:
 *   delete:
 *     summary: Delete property image
 *     tags: [Property Images]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
const deleteImage = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return sendResponse(res, 400, "Image id is required");

    const image = await prisma.propertyImage.findUnique({
      where: { id },
    });

    if (!image) return sendResponse(res, 404, "Image not found");

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await prisma.propertyImage.delete({
      where: { id },
    });

    return sendResponse(res, 200, "Image deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, "Server Error", error.message);
  }
};

// ===============================
// UPDATE IMAGE
// ===============================

/**
 * @swagger
 * /api/property-images:
 *   patch:
 *     summary: Update property image
 *     tags: [Property Images]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
const updateImage = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return sendResponse(res, 400, "id is required");
    if (!req.file) return sendResponse(res, 400, "Image file is required");

    const existing = await prisma.propertyImage.findUnique({
      where: { id },
    });

    if (!existing) return sendResponse(res, 404, "Image not found");

    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    const updated = await prisma.propertyImage.update({
      where: { id },
      data: {
        imageUrl: req.file.path,
        publicId: req.file.filename,
      },
    });

    return sendResponse(res, 200, "Image updated successfully", updated);
  } catch (error) {
    return sendResponse(res, 500, "Server Error", error.message);
  }
};

// ===============================
// SET FEATURED IMAGE
// ===============================

/**
 * @swagger
 * /api/property-images/featured:
 *   patch:
 *     summary: Set featured image for property
 *     tags: [Property Images]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Featured image updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: No images found
 *       500:
 *         description: Server error
 */
const setFeaturedImage = async (req, res) => {
  try {
    const { id, propertyId } = req.query;

    if (!id || !propertyId)
      return sendResponse(res, 400, "id and propertyId required");

    const images = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { displayOrder: "asc" },
    });

    if (!images.length)
      return sendResponse(res, 404, "No images found");

    for (let i = 0; i < images.length; i++) {
      await prisma.propertyImage.update({
        where: { id: images[i].id },
        data: {
          isFeatured: images[i].id === id,
          displayOrder: images[i].id === id ? 1 : i + 2,
        },
      });
    }

    const featured = await prisma.propertyImage.findUnique({
      where: { id },
    });

    await prisma.property.update({
      where: { id: propertyId },
      data: { featuredImageUrl: featured.imageUrl },
    });

    return sendResponse(res, 200, "Featured image updated", featured);
  } catch (error) {
    return sendResponse(res, 500, "Server Error", error.message);
  }
};

// ===============================
// IMAGE COUNT
// ===============================

/**
 * @swagger
 * /api/property-images/count:
 *   get:
 *     summary: Get total image count for property
 *     tags: [Property Images]
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image count fetched
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
const getImageCount = async (req, res) => {
  try {
    const { propertyId } = req.query;

    if (!propertyId)
      return sendResponse(res, 400, "propertyId is required");

    const count = await prisma.propertyImage.count({
      where: { propertyId },
    });

    return sendResponse(res, 200, "Image count fetched", { count });
  } catch (error) {
    return sendResponse(res, 500, "Error fetching image count", error.message);
  }
};

module.exports = {
  addImage,
  getImages,
  deleteImage,
  updateImage,
  setFeaturedImage,
  getImageCount,
};