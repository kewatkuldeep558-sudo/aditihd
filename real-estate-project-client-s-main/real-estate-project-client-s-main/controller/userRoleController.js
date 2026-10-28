const prisma = require("../lib/prisma");

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: User role management
 */

/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Get roles
 *     tags: [Role]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Role ID to filter
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Role name to filter
 *     responses:
 *       200:
 *         description: List of roles
 *       500:
 *         description: Server error
 */
const authRole = async (req, res) => {
    try {
        const { id, name } = req.query;

        let whereClause = {};
        if (id) whereClause.id = id;
        if (name) whereClause.name = { contains: name, mode: "insensitive" };

        const roles = await prisma.role.findMany({ where: whereClause });

        res.status(200).json({
            status: true,
            message: "Role details fetched successfully",
            result: roles,
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
 * /api/role:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the role
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Role already exists or missing name
 *       500:
 *         description: Server error
 */
const authRoleCreate = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: false, message: "Role name is required!" });
        }

        const existingRole = await prisma.role.findUnique({ where: { name } });
        if (existingRole) {
            return res.status(400).json({ status: false, message: "Role already exists!" });
        }

        const newRole = await prisma.role.create({
            data: { name: name }
        });

        res.status(201).json({
            status: true,
            message: "Role created successfully!",
            result: newRole,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

/**
 * @swagger
 * /api/role:
 *   patch:
 *     summary: Update a role
 *     tags: [Role]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New role name
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Missing ID or name
 *       500:
 *         description: Server error
 */
const authRoleUpdate = async (req, res) => {
    try {
        const { id } = req.query;
        const { name } = req.body;

        if (!id) return res.status(400).json({ status: false, message: "Role ID not found!" });
        if (!name) return res.status(400).json({ status: false, message: "Role name is required!" });

        const roleUpdated = await prisma.role.update({
            where: { id:id },
            data: { name },
        });

        res.status(200).json({
            status: true,
            message: "Role updated successfully!",
            result: roleUpdated,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

/**
 * @swagger
 * /api/role:
 *   delete:
 *     summary: Delete a role
 *     tags: [Role]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       400:
 *         description: Role ID not provided
 *       500:
 *         description: Server error
 */
const authRoleDelete = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ status: false, message: "Role ID not found!" });

        const roleDeleted = await prisma.role.delete({ where: { id } });

        res.status(200).json({
            status: true,
            message: "Role deleted successfully!",
            result: roleDeleted,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Networking problem!", error: error.message });
    }
};

module.exports = {
    authRole,
    authRoleCreate,
    authRoleUpdate,
    authRoleDelete,
};
