const express = require("express");
require("dotenv").config();
require("./mongo");
const { swaggerUi, swaggerSpec } = require("./swagger"); // Swagger configuration

const app = express();

const userRoutes = require("./src/Routes/users");
const metamaskRoutes = require("./src/Routes/metamask");
const carsRouter = require("./SRC/Routes/cars");
const authenticateToken = require("./src/Middleware/auth");

// Parse incoming JSON data
app.use(express.json());

// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// User API endpoints
app.use("/api/users", userRoutes);

// MetaMask API endpoints (protected with JWT authentication)
// app.use("/api/metamask", authenticateToken, metamaskRoutes);
app.use("/api/metamask", metamaskRoutes);

app.use("/api/cars", carsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on port ${process.env.PORT}`);
});
