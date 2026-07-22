require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
const { inquiryRouter } = require("./routes/inquiryRoute");
const { propertyRouter } = require("./routes/propertyRoute");

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const { healthRouter } = require("./routes/healthRoutes");
const { authRouter } = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);

async function startServer() {
    try {
        await pool.connect();

        console.log("Database Connected...");

        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec)
        );


        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });

    } catch (err) {
        console.error("Database connection failed.");
        console.error(err.message);
    }
}

startServer();