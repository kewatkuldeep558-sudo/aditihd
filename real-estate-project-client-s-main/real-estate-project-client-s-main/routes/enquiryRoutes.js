// const express = require('express');
// const enquiryRoutes = express.Router();
// const enquiryController = require('../controller/enquryController');

// // ------------------ Routes ------------------ //

// // GET /api/enquiries?id=&search=&page=&limit=
// enquiryRoutes.get(
//   '/enquiries',
//   enquiryController.validateQuery,
//   enquiryController.getEnquiries
// );

// // POST /api/enquiries
// enquiryRoutes.post(
//   '/enquiries',
//   enquiryController.validateEnquiry,
//   enquiryController.createEnquiry
// );

// // PUT /api/enquiries?id=
// enquiryRoutes.patch(
//   '/enquiries',
//   enquiryController.validateEnquiry,
//   enquiryController.updateEnquiry
// );

// // DELETE /api/enquiries?id=
// enquiryRoutes.delete('/enquiries', enquiryController.deleteEnquiry);

// module.exports = enquiryRoutes;


const express = require("express")


const {
   getEnquiry,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
} = require("../controller/enquryController");

const enquiryRoutes = express.Router();

enquiryRoutes.post("/enquiries", createEnquiry);
enquiryRoutes.get("/enquiries", getEnquiry);
enquiryRoutes.patch("/enquiries", updateEnquiry);
enquiryRoutes.delete("/enquiries", deleteEnquiry);



module.exports = enquiryRoutes;
