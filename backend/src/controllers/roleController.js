const prisma = require("../config/database");

const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(roles);
  } catch (error) {
    console.error("Error al obtener los roles:", error);

    res.status(500).json({
      mensaje: "Error al obtener los roles",
    });
  }
};
const createRole = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const nuevoRol = await prisma.role.create({
      data: {
        nombre,
        descripcion,
      },
    });

    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error("Error al crear el rol:", error);

    res.status(500).json({
      mensaje: "Error al crear el rol",
    });
  }
};

module.exports = {
  getRoles,
createRole,
};