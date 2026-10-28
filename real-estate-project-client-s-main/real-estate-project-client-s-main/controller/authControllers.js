const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecret";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
const authRegisterUser = async (req, res) => {
    try {
        const { name, email, password, roleId } = req.body;

        const checkEmailList = await prisma.users.findUnique({ where: { email } });

        if (checkEmailList) {
            return res.status(400).json({
                status: false,
                message: "User already exists!",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const mainRegisterPost = await prisma.users.create({
            data: { name, email, password: hashPassword, roleId },
            include: { role: true },
        });

        res.status(201).json({
            status: true,
            message: "User successfully created!",
            result: mainRegisterPost,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Server problem!",
            error: error.message,
        });
    }
};

/**
 * @swagger
 *  /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 *       400:
 *         description: User not found
 *       401:
 *         description: Password not matched
 *       500:
 *         description: Server error
 */
const authLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkUser = await prisma.users.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!checkUser) {
            return res.status(400).json({
                status: false,
                message: "User not found!",
            });
        }

        const checkPasswordCom = await bcrypt.compare(password, checkUser.password);

        if (!checkPasswordCom) {
            return res.status(401).json({
                status: false,
                message: "Password not matched!",
            });
        }

        const token = jwt.sign(
            { id: checkUser.id, email: checkUser.email, role: checkUser.role.name },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            status: true,
            message: "Login success!",
            token,
            user: checkUser,
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
 *  /api/auth/update:
 *   patch:
 *     summary: Update a user
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: User ID not found
 *       500:
 *         description: Server error
 */
const authUserUpdate = async (req, res) => {
    try {
        const { id } = req.query;
        const { name, email, password, roleId } = req.body;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "User ID not found!",
            });
        }

        let updateData = { name, email, roleId };
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const userUpdated = await prisma.users.update({
            where: { id },
            data: updateData,
            include: { role: true },
        });

        res.status(200).json({
            status: true,
            message: "User updated successfully!",
            result: userUpdated,
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
 *  /api/auth/details:
 *   get:
 *     summary: Get user details
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to search
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email to search
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       500:
 *         description: Server error
 */
const authUsersDetails = async (req, res) => {
    try {
        const { id, name, email } = req.query;

        let whereClause = {};
        if (id) whereClause.id = id;
        if (name) whereClause.name = { contains: name, mode: "insensitive" };
        if (email) whereClause.email = { contains: email, mode: "insensitive" };

        const users = await prisma.users.findMany({
            where: whereClause,
            include: { role: true },
        });

        res.status(200).json({
            status: true,
            message: "User details fetched successfully",
            result: users,
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
 *  /api/auth/delete:
 *   delete:
 *     summary: Delete a user
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User ID not found
 *       500:
 *         description: Server error
 */
const authUserDelete = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "User ID not found!",
            });
        }

        const userDeleted = await prisma.users.delete({ where: { id } });

        res.status(200).json({
            status: true,
            message: "User deleted successfully!",
            result: userDeleted.id,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Networking problem!",
            error: error.message,
        });
    }
};

module.exports = {
    authRegisterUser,
    authLoginUser,
    authUserDelete,
    authUserUpdate,
    authUsersDetails,
};
