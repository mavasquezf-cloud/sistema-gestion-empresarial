const express = require("express");
const cors = require("cors");

const roleRoutes = require("./routes/roleRoutes");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/roles", roleRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "API del Sistema de Gestión Empresarial funcionando",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});