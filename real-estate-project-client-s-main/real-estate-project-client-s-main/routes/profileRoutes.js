const express = require("express")

const {
    createProfile,
    getProfiles,
    updateProfile,
    deleteProfile
} = require("../controller/profileController");

const profileRoutes = express.Router();

profileRoutes.post("/profile/createProfile", createProfile);
profileRoutes.get("/profile/getProfiles", getProfiles);
profileRoutes.patch("/profile/updateProfile", updateProfile);
profileRoutes.delete("/profile/deleteProfile", deleteProfile);

module.exports = profileRoutes
