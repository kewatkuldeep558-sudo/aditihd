const express = require("express")
const {   authRegisterUser,
  authLoginUser,
  authUserDelete,
  authUserUpdate,
  authUsersDetails, } = require("../controller/authControllers")

const authRoutes = express.Router()

authRoutes.post("/auth/register", authRegisterUser);
authRoutes.post("/auth/login", authLoginUser);
authRoutes.patch("/auth/update", authUserUpdate);
authRoutes.delete("/auth/delete", authUserDelete);
authRoutes.get("/auth/details", authUsersDetails);


module.exports = authRoutes