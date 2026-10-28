const express = require("express")


const {
       getStatus,
    createStatus,
    updateStatus,
    deleteStatus,
} = require("../controller/statusController");

const statusRoutes = express.Router();

statusRoutes.post("/status", createStatus);
statusRoutes.get("/status", getStatus);
statusRoutes.patch("/status", updateStatus);
statusRoutes.delete("/status", deleteStatus);



module.exports = statusRoutes;
