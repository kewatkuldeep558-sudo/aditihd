const prisma = require("../lib/prisma");

/**
 * @swagger
 * tags:
 *   name: Property Status
 *   description: Property status management
 */

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get property statuses
 *     tags: [Property Status]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Status ID to filter
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Status name to filter
 *     responses:
 *       200:
 *         description: List of statuses
 *       500:
 *         description: Server error
 */
const getStatus = async (req, res) => {
    try {
        const { id, name } = req.query;

        let whereClause = {};
        if (id) whereClause.id = id;
        if (name) whereClause.name = { contains: name, mode: "insensitive" };

        const statuses = await prisma.propertyStatus.findMany({
            where: whereClause,
        });

        res.status(200).json({
            status: true,
            message: "Property statuses fetched successfully",
            result: statuses,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Networking problem!",
            error: error.message,
        });
    }
};

/**
 * @swagger
 * /api/status:
 *   post:
 *     summary: Create a new property status
 *     tags: [Property Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the status
 *     responses:
 *       201:
 *         description: Status created successfully
 *       400:
 *         description: Status already exists or missing name
 *       500:
 *         description: Server error
 */
const createStatus = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ status: false, message: "Status name is required!" });

        const existing = await prisma.propertyStatus.findUnique({ where: { name } });
        if (existing) return res.status(400).json({ status: false, message: "Status already exists!" });

        const status = await prisma.propertyStatus.create({ data: { name } });

        res.status(201).json({
            status: true,
            message: "Status created successfully!",
            result: status,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

/**
 * @swagger
 * /api/status:
 *   patch:
 *     summary: Update a property status
 *     tags: [Property Status]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Status ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the status
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Missing ID or name
 *       500:
 *         description: Server error
 */
const updateStatus = async (req, res) => {
    try {
        const { id } = req.query;
        const { name } = req.body;

        if (!id) return res.status(400).json({ status: false, message: "Status ID not found!" });
        if (!name) return res.status(400).json({ status: false, message: "Status name is required!" });

        const updated = await prisma.propertyStatus.update({
            where: { id },
            data: { name },
        });

        res.status(200).json({
            status: true,
            message: "Status updated successfully!",
            result: updated,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

/**
 * @swagger
 * /api/status:
 *   delete:
 *     summary: Delete a property status
 *     tags: [Property Status]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Status ID to delete
 *     responses:
 *       200:
 *         description: Status deleted successfully
 *       400:
 *         description: Status ID not provided
 *       500:
 *         description: Server error
 */
const deleteStatus = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ status: false, message: "Status ID not found!" });

        const deleted = await prisma.propertyStatus.delete({ where: { id } });

        res.status(200).json({
            status: true,
            message: "Status deleted successfully!",
            result: deleted,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

module.exports = {
    getStatus,
    createStatus,
    updateStatus,
    deleteStatus,
};
