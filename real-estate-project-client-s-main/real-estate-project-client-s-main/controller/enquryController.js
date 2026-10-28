// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const { body, validationResult, query } = require('express-validator');

// /**
//  * @swagger
//  * tags:
//  *   name: Enquiry
//  *   description: Enquiry management APIs
//  */

// // ------------------ Validation Rules ------------------ //

// const validateEnquiry = [
//   body('name').trim().notEmpty().withMessage('Name is required'),
//   body('phone').trim().notEmpty().withMessage('Phone is required'),
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('message').trim().notEmpty().withMessage('Message is required'),
// ];

// const validateQuery = [
//   query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
//   query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be positive integer'),
//   query('search').optional().trim(),
//   query('id').optional().trim(),
// ];

// // ------------------ Helper Functions ------------------ //

// const handleErrors = (res, error) => {
//   console.error(error);
//   res.status(500).json({ success: false, error: 'Internal server error' });
// };

// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch((err) => handleErrors(res, err));
// };

// // ------------------ Controller Methods ------------------ //

// /**
//  * @swagger
//  * /api/enquiries:
//  *   get:
//  *     summary: Get all enquiries or single enquiry by ID
//  *     tags: [Enquiry]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         schema:
//  *           type: string
//  *         description: Get single enquiry by ID
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Search by name, email, or phone
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *         description: Page number
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *         description: Number of records per page
//  *     responses:
//  *       200:
//  *         description: Successful response
//  */
// const getEnquiries = asyncHandler(async (req, res) => {
//   const { id, search } = req.query;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   if (id) {
//     const enquiry = await prisma.enquiry.findUnique({ where: { id } });
//     if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

//     return res.status(200).json({ success: true, data: enquiry });
//   }

//   const where = search
//     ? {
//         OR: [
//           { name: { contains: search, mode: 'insensitive' } },
//           { email: { contains: search, mode: 'insensitive' } },
//           { phone: { contains: search, mode: 'insensitive' } },
//         ],
//       }
//     : {};

//   const total = await prisma.enquiry.count({ where });
//   const enquiries = await prisma.enquiry.findMany({
//     where,
//     skip,
//     take: limit,
//     orderBy: { createdAt: 'desc' },
//   });

//   res.status(200).json({
//     success: true,
//     page,
//     limit,
//     total,
//     totalPages: Math.ceil(total / limit),
//     data: enquiries,
//   });
// });

// /**
//  * @swagger
//  * /api/enquiries:
//  *   post:
//  *     summary: Create new enquiry
//  *     tags: [Enquiry]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - phone
//  *               - email
//  *               - message
//  *             properties:
//  *               name:
//  *                 type: string
//  *               phone:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               message:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Enquiry created successfully
//  */
// const createEnquiry = asyncHandler(async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

//   const { name, phone, email, message } = req.body;
//   console.log(req.body)
//   const newEnquiry = await prisma.enquiry.create({ data: { name, phone, email, message } });

//   res.status(201).json({ success: true, data: newEnquiry });
// });

// /**
//  * @swagger
//  * /api/enquiries:
//  *   put:
//  *     summary: Update enquiry by ID
//  *     tags: [Enquiry]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               phone:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               message:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Enquiry updated successfully
//  */
// const updateEnquiry = asyncHandler(async (req, res) => {
//   const { id } = req.query;
//   if (!id) return res.status(400).json({ success: false, message: 'Query parameter "id" is required' });

//   const { name, phone, email, message } = req.body;

//   const updated = await prisma.enquiry.update({
//     where: { id },
//     data: { name, phone, email, message },
//   });

//   res.status(200).json({ success: true, data: updated });
// });

// /**
//  * @swagger
//  * /api/enquiries:
//  *   delete:
//  *     summary: Delete enquiry by ID
//  *     tags: [Enquiry]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Enquiry deleted successfully
//  */
// const deleteEnquiry = asyncHandler(async (req, res) => {
//   const { id } = req.query;
//   if (!id) return res.status(400).json({ success: false, message: 'Query parameter "id" is required' });

//   await prisma.enquiry.delete({ where: { id } });
//   res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
// });

// module.exports = {
//   validateEnquiry,
//   validateQuery,
//   getEnquiries,
//   createEnquiry,
//   updateEnquiry,
//   deleteEnquiry,
// };
const prisma = require("../lib/prisma");
const nodemailer = require("nodemailer");
/**
 * @swagger
 * tags:
 *   name: Enquiry
 *   description: Enquiry management
 */

/**
 * @swagger
 * /api/enquiries:
 *   get:
 *     summary: Get enquiries
 *     tags: [Enquiry]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Enquiry ID to filter
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to filter
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email to filter
 *     responses:
 *       200:
 *         description: List of enquiries
 *       500:
 *         description: Server error
 */
const getEnquiry = async (req, res) => {
    try {
        const { id, name, email } = req.query;

        let whereClause = {};
        if (id) whereClause.id = id;
        if (name) whereClause.name = { contains: name, mode: "insensitive" };
        if (email) whereClause.email = { contains: email, mode: "insensitive" };

        const enquiries = await prisma.enquiry.findMany({ where: whereClause });

        res.status(200).json({
            status: true,
            message: "Enquiries fetched successfully",
            result: enquiries,
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
 * /api/enquiries:
 *   post:
 *     summary: Create a new enquiry and send email notification
 *     description: Saves enquiry to database and sends email to admin and user.
 *     tags:
 *       - Enquiry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               message:
 *                 type: string
 *                 example: I am interested in your 2BHK property.
 *     responses:
 *       201:
 *         description: Enquiry submitted successfully and email sent
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
 *                   example: Enquiry submitted successfully! Email sent to admin and user.
 *                 result:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: All fields are required!
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Networking problem!
 */


const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }

    // ✅ Save enquiry in DB
    const enquiry = await prisma.enquiry.create({
      data: { name, email, phone, message },
    });

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ===============================
    // 📩 ADMIN EMAIL (To You)
    // ===============================
    const adminMail = {
      from: `"Property Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🔥 New Property Enquiry Received",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2 style="color:#2c3e50;">New Enquiry Details</h2>
          <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <th align="left">Name</th>
              <td>${name}</td>
            </tr>
            <tr>
              <th align="left">Email</th>
              <td>${email}</td>
            </tr>
            <tr>
              <th align="left">Phone</th>
              <td>${phone}</td>
            </tr>
            <tr>
              <th align="left">Message</th>
              <td>${message}</td>
            </tr>
          </table>
          <br/>
          <p style="color:gray;">This enquiry was submitted from your website.</p>
        </div>
      `,
    };

    // ===============================
    // 📩 USER AUTO REPLY
    // ===============================
    const userMail = {
      from: `"Property Website" <${email}>`,
      to: email,
      subject: "Thank You for Your Enquiry 🙏",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2 style="color:#27ae60;">Hello ${name},</h2>
          <p>Thank you for contacting us. We have received your enquiry successfully.</p>
          
          <h3>Your Submitted Details:</h3>
          <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <th align="left">Phone</th>
              <td>${phone}</td>
            </tr>
            <tr>
              <th align="left">Message</th>
              <td>${message}</td>
            </tr>
          </table>

          <br/>
          <p>Our team will contact you shortly.</p>

          <p style="margin-top:30px;">
            Regards,<br/>
            <strong>aditi hd real estate</strong>
          </p>
        </div>
      `,
    };

    // ✅ Send both emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.status(201).json({
      status: true,
      message: "Enquiry submitted successfully! Email sent to admin and user.",
      result: enquiry,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Networking problem!",
      error: error.message,
    });
  }
};

// const createEnquiry = async (req, res) => {
//     try {
//         const { name, email, phone, message } = req.body;

//         if (!name || !email || !phone || !message) {
//             return res.status(400).json({
//                 status: false,
//                 message: "All fields are required!",
//             });
//         }

//         const enquiry = await prisma.enquiry.create({
//             data: { name, email, phone, message },
//         });

//         res.status(201).json({
//             status: true,
//             message: "Enquiry submitted successfully!",
//             result: enquiry,
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Networking problem!",
//             error: error.message,
//         });
//     }
// };

/**
 * @swagger
 * /api/enquiries:
 *   patch:
 *     summary: Update an enquiry
 *     tags: [Enquiry]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Enquiry ID to update
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
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enquiry updated successfully
 *       400:
 *         description: Missing ID
 *       500:
 *         description: Server error
 */
const updateEnquiry = async (req, res) => {
    try {
        const { id } = req.query;
        const { name, email, phone, message } = req.body;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Enquiry ID not found!",
            });
        }

        const updated = await prisma.enquiry.update({
            where: { id },
            data: { name, email, phone, message },
        });

        res.status(200).json({
            status: true,
            message: "Enquiry updated successfully!",
            result: updated,
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
 * /api/enquiries:
 *   delete:
 *     summary: Delete an enquiry
 *     tags: [Enquiry]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Enquiry ID to delete
 *     responses:
 *       200:
 *         description: Enquiry deleted successfully
 *       400:
 *         description: Missing ID
 *       500:
 *         description: Server error
 */
const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Enquiry ID not found!",
            });
        }

        const deleted = await prisma.enquiry.delete({
            where: { id },
        });

        res.status(200).json({
            status: true,
            message: "Enquiry deleted successfully!",
            result: deleted,
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
    getEnquiry,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
};
