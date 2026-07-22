const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Real Estate API",
            version: "1.0.0",
            description: "Real Estate Listing Platform API"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;