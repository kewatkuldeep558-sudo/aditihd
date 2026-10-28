const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Real Estate Management API",
            version: "1.0.0",
            description: "API for user authentication, profiles, properties, roles, types, and statuses",
        },
        servers: [
            {
                url: "https://aditihdrealestate.com", // Replace with your server URL if needed
            },
        ],
    },

    apis: ["./controller/authControllers.js",
        // "./controller/profileController.js",
        "./controller/propertyController.js",
        "./controller/propertyImageController.js",
        "./controller/statusController.js",
        "./controller/typeContollers.js",
        "./controller/userRoleController.js",
         "./controller/enquryController.js",
    ]

};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger docs available at https://realestate-rxwv.onrender.com/api-docs");
};

module.exports = swaggerDocs;
