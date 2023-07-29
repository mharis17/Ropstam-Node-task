const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ROSPTAM CRUDAPI",
      version: "1.0.0",
      description: "Documentation for Car CRUD API",
    },
    servers: [
      {
        url: "http://localhost:4444",
      },
    ],
    components: {
      schemas: {
        Car: {
          type: "object",
          properties: {
            category: { type: "string" },
            color: { type: "string" },
            model: { type: "string" },
            make: { type: "string" },
            registrationNo: { type: "string" },
          },
        },
      },
    },
  },
  apis: [
    "./src/Routes/cars.js",
    "./src/Routes/users.js",
    "./src/Routes/metamask.js",
  ],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
