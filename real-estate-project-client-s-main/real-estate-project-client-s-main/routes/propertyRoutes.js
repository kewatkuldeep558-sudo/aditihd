const express = require("express")


const {
    createProperty,
    getProperties,
     updateProperty,
    deleteProperty,
    getPropertyStats,
} = require("../controller/propertyController");

const propertyRoutes = express.Router();

propertyRoutes.post("/properties", createProperty);
propertyRoutes.get("/properties", getProperties);
propertyRoutes.patch("/properties", updateProperty);
propertyRoutes.delete("/properties", deleteProperty);
propertyRoutes.get("/properties/stats", getPropertyStats);



module.exports = propertyRoutes;
