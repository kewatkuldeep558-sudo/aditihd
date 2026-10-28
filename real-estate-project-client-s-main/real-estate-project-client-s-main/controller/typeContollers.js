const prisma = require("../lib/prisma");

/**
 * @swagger
 * tags:
 *   name: Property Type
 *   description: Property type management
 */

/**
 * @swagger
 * /api/type:
 *   get:
 *     summary: Get property types
 *     tags: [Property Type]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Type ID to filter
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Type name to filter
 *     responses:
 *       200:
 *         description: List of property types
 *       500:
 *         description: Server error
 */
const getType = async (req, res) => {
    try {
        const { id, name } = req.query;

        let whereClause = {};
        if (id) whereClause.id = id;
        if (name) whereClause.name = { contains: name, mode: "insensitive" };

        const types = await prisma.propertyType.findMany({ where: whereClause });

        res.status(200).json({
            status: true,
            message: "Property types fetched successfully",
            result: types,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

/**
 * @swagger
 * /api/type:
 *   post:
 *     summary: Create a new property type
 *     tags: [Property Type]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the property type
 *     responses:
 *       201:
 *         description: Type created successfully
 *       400:
 *         description: Type already exists or missing name
 *       500:
 *         description: Server error
 */
const createType = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ status: false, message: "Type name is required!" });

        const existing = await prisma.propertyType.findUnique({ where: { name } });
        if (existing) return res.status(400).json({ status: false, message: "Type already exists!" });

        const type = await prisma.propertyType.create({ data: { name } });

        res.status(201).json({
            status: true,
            message: "Type created successfully!",
            result: type,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

/**
 * @swagger
 * /api/type:
 *   patch:
 *     summary: Update a property type
 *     tags: [Property Type]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Type ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the property type
 *     responses:
 *       200:
 *         description: Type updated successfully
 *       400:
 *         description: Missing ID or name
 *       500:
 *         description: Server error
 */
const updateType = async (req, res) => {
    try {
        const { id } = req.query;
        const { name } = req.body;

        if (!id) return res.status(400).json({ status: false, message: "Type ID not found!" });
        if (!name) return res.status(400).json({ status: false, message: "Type name is required!" });

        const updated = await prisma.propertyType.update({
            where: { id },
            data: { name },
        });

        res.status(200).json({
            status: true,
            message: "Type updated successfully!",
            result: updated,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

/**
 * @swagger
 * /api/type:
 *   delete:
 *     summary: Delete a property type
 *     tags: [Property Type]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Type ID to delete
 *     responses:
 *       200:
 *         description: Type deleted successfully
 *       400:
 *         description: Type ID not provided
 *       500:
 *         description: Server error
 */
const deleteType = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ status: false, message: "Type ID not found!" });

        const deleted = await prisma.propertyType.delete({ where: { id } });

        res.status(200).json({
            status: true,
            message: "Type deleted successfully!",
            result: deleted,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

module.exports = {
    getType,
    createType,
    updateType,
    deleteType,
};
