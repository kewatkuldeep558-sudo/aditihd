const prisma = require("../lib/prisma");

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Manage user profiles
 */

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new profile
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - name
 *               - email
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Profile already exists or missing required fields
 *       500:
 *         description: Server error
 */
const createProfile = async (req, res) => {
    try {
        const { userId, name, email } = req.body;

        if (!userId || !name || !email) {
            return res.status(400).json({ message: "userId, name and email are required" });
        }

        const existingProfile = await prisma.profile.findUnique({ where: { userId } });

        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists for this user" });
        }

        const profile = await prisma.profile.create({ data: req.body });

        return res.status(201).json({ message: "Profile created successfully", data: profile });
    } catch (error) {
        return res.status(500).json({ message: "Error creating profile", error: error.message });
    }
};

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get profiles (optionally by userId)
 *     tags: [Profiles]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter profiles by userId
 *     responses:
 *       200:
 *         description: List of profiles
 *       404:
 *         description: Profile not found (if filtered by userId)
 *       500:
 *         description: Server error
 */
const getProfiles = async (req, res) => {
    try {
        const { userId } = req.query;
        let whereCondition = {};
        if (userId) whereCondition.userId = userId;

        const profiles = await prisma.profile.findMany({
            where: whereCondition,
            include: { roles: true, properties: true },
            orderBy: { createdAt: "desc" }
        });

        if (userId && profiles.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({ total: profiles.length, data: profiles });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching profiles", error: error.message });
    }
};

/**
 * @swagger
 * /profiles/{userId}:
 *   put:
 *     summary: Update a profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the profile to update
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
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Missing userId
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "userId is required" });

        const checkProfile = await prisma.profile.findUnique({ where: { userId } });
        if (!checkProfile) return res.status(404).json({ message: "Profile not found" });

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: req.body
        });

        return res.status(200).json({ message: "Profile updated successfully", data: updatedProfile });
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

/**
 * @swagger
 * /profiles/{userId}:
 *   delete:
 *     summary: Delete a profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the profile to delete
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       400:
 *         description: Missing userId
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "userId is required" });

        const checkProfile = await prisma.profile.findUnique({ where: { userId } });
        if (!checkProfile) return res.status(404).json({ message: "Profile not found" });

        await prisma.profile.delete({ where: { userId } });
        return res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting profile", error: error.message });
    }
};

module.exports = {
    createProfile,
    getProfiles,
    updateProfile,
    deleteProfile
};
