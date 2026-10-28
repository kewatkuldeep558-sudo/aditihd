
const prisma = require("../lib/prisma");
const fs = require("fs");
const path = require("path");

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Property management
 */

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Property]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               city:
 *                 type: string
 *               price:
 *                 type: number
 *               priceLabel:
 *                 type: string
 *               beds:
 *                 type: number
 *               baths:
 *                 type: number
 *               area:
 *                 type: string
 *               description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               featuredImageUrl:
 *                 type: string
 *               createdByUserId:
 *                 type: string
 *               statusId:
 *                 type: string
 *               typeId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                     isFeatured:
 *                       type: boolean
 *                     displayOrder:
 *                       type: number
 *     responses:
 *       201:
 *         description: Property created successfully
 *       500:
 *         description: Server error
 */
const createProperty = async (req, res) => {
  try {
    const data = req.body;

    const property = await prisma.property.create({
      data: {
        title: data.title,
        location: data.location,
        city: data.city,
        price: data.price,
        priceLabel: data.priceLabel,
        beds: data.beds || 0,
        baths: data.baths || 0,
        area: data.area,
        description: data.description || "",
        features: data.features || [],
        featuredImageUrl: data.featuredImageUrl,
        createdByUserId: data.createdByUserId,
        statusId: data.statusId,
        typeId: data.typeId,
        createdAt:new Date(),
        updatedAt:new Date(),
        images: data.images
          ? {
              create: data.images.map((img) => ({
                imageUrl: img.imageUrl,
                isFeatured: img.isFeatured || false,
                displayOrder: img.displayOrder || 0,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        creator: true,
        status: true,
        type: true,
      },
    });

    res.status(201).json({
      status: true,
      message: "Property created successfully!",
      result: property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Property]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Property ID to filter
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to search for
 *     responses:
 *       200:
 *         description: List of properties
 *       500:
 *         description: Server error
 */
const getProperties = async (req, res) => {
  try {
    const { id, title } = req.query;

    const whereClause = {};
    if (id) whereClause.id = id;
    if (title) whereClause.title = { contains: title, mode: "insensitive" };

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: true,
        creator: true,
        status: true,
        type: true,
      },
    });

    res.status(200).json({
      status: true,
      message: "Properties fetched successfully",
      result: properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/properties:
 *   patch:
 *     summary: Update a property
 *     tags: [Property]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               city:
 *                 type: string
 *               price:
 *                 type: number
 *               priceLabel:
 *                 type: string
 *               beds:
 *                 type: number
 *               baths:
 *                 type: number
 *               area:
 *                 type: string
 *               description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               featuredImageUrl:
 *                 type: string
 *               createdByUserId:
 *                 type: string
 *               statusId:
 *                 type: string
 *               typeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       500:
 *         description: Server error
 */
const updateProperty = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;

    const property = await prisma.property.update({
      where: { id:id },
      data: {
        title: data.title,
        location: data.location,
        city: data.city,
        price: data.price,
        priceLabel: data.priceLabel,
        beds: data.beds,
        baths: data.baths,
        area: data.area,
        description: data.description,
        features: data.features || undefined,
        featuredImageUrl: data.featuredImageUrl,
        createdByUserId: data.createdByUserId,
        statusId: data.statusId,
        typeId: data.typeId,
      },
      include: {
        images: true,
        creator: true,
        status: true,
        type: true,
      },
    });

    res.status(200).json({
      status: true,
      message: "Property updated successfully",
      result: property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/properties:
 *   delete:
 *     summary: Delete a property and its images
 *     tags: [Property]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID to delete
 *     responses:
 *       200:
 *         description: Property and its images deleted successfully
 *       500:
 *         description: Server error
 */

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Property id is required",
      });
    }

    // 1️⃣ Find all images for this property
    const images = await prisma.propertyImage.findMany({
      where: { propertyId: id },
    });

    // 2️⃣ Delete each physical file
    images.forEach((img) => {
      const filePath = path.join(__dirname, "..", img.imageUrl.replace(/^\/+/, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 3️⃣ Delete images from DB
    await prisma.propertyImage.deleteMany({ where: { propertyId: id } });

    // 4️⃣ Delete the property itself
    await prisma.property.delete({ where: { id } });

    res.status(200).json({
      status: true,
      message: "Property and its images deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};




/**
 * @swagger
 * /api/properties/stats:
 *   get:
 *     summary: Get total properties and total images count
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Stats fetched successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     totalProperties:
 *                       type: integer
 *                       example: 10
 *                     totalImages:
 *                       type: integer
 *                       example: 56
 *       500:
 *         description: Server error
 */
const getPropertyStats = async (req, res) => {
  try {
    const totalProperties = await prisma.property.count();
    const totalImages = await prisma.propertyImage.count();

    return res.status(200).json({
      status: true,
      message: "Stats fetched successfully",
      result: { totalProperties, totalImages },
    });
  } catch (error) {
    console.error("GET PROPERTY STATS ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};





module.exports = {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  getPropertyStats
};
