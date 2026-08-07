const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const indexRoutes = require("./routes/index.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/", indexRoutes);

module.exports = app;