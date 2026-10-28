const express = require("express")


const {
    authRole,
    authRoleCreate,
    authRoleUpdate,
    authRoleDelete,
} = require("../controller/userRoleController");

const roleRoutes = express.Router();

roleRoutes.post("/role", authRoleCreate);
roleRoutes.get("/role", authRole);
roleRoutes.patch("/role", authRoleUpdate);
roleRoutes.delete("/role", authRoleDelete);

module.exports = roleRoutes;
