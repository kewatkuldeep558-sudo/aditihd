const express = require("express")


const {
    getType,
    createType,
    updateType,
    deleteType,
} = require("../controller/typeContollers");

const typeRoutes = express.Router();

typeRoutes.post("/type", createType);
typeRoutes.get("/type", getType);
typeRoutes.patch("/type", updateType);
typeRoutes.delete("/type", deleteType);



module.exports = typeRoutes;
