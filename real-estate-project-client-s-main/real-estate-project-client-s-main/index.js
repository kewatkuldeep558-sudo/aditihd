

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const swaggerDocs = require("./lib/swagger");
const authRoutes = require("./routes/authRoute");
const propertyRoutes = require("./routes/propertyRoutes");
const roleRoutes = require("./routes/userRoleRoutes");
const ImageRoutes = require("./routes/propertyImageRoutes");
const profileRoutes = require("./routes/profileRoutes");
const statusRoutes = require("./routes/statusRoute");
const typeRoutes = require("./routes/typeRoute");
const enquiryRoutes = require("./routes/enquiryRoutes");

const app = express();

const port = 4400;
app.use(express.urlencoded({ extended: true }));


app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

app.use(cors({
  origin: "",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "application/json"],
  credentials: true
}));

app.use(cors({
  origin: [
    "https://aditihdrealestate.com",
    "https://www.aditihdrealestate.com",
    "https://realestate-rxwv.onrender.com",
    "https://real-estate-project-client-s.onrender.com"
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));


app.use(express.json());

swaggerDocs(app);

// API Routes
app.use("/api", authRoutes);
app.use("/api", propertyRoutes);
app.use("/api", profileRoutes);
app.use("/api", ImageRoutes);
app.use("/api", roleRoutes);
app.use("/api", statusRoutes);
app.use("/api", typeRoutes);
app.use('/api', enquiryRoutes);
// Static folder for uploads
// app.use("/uploads", express.static("uploads"));

// Test Route
app.get("/test", (req, res) => {
  res.json("server is running !");
});

// Temporarily app.js mein add karo, fix hone ke baad hata dena
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET ? "loaded ✓" : "missing ✗",
});

// Serve React Build Files
// Serve React Build Files
app.use(express.static(path.join(__dirname, "dist")));

// React Routing Support - EXPRESS 5 SAFE METHOD
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


// Start Server
app.listen(port, () => {
  console.log("app is running port ", port);
});
