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

    // Validar que el nombre sea obligatorio
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del rol es obligatorio",
      });
    }

    // Comprobar si ya existe
    const rolExistente = await prisma.role.findUnique({
      where: {
        nombre: nombre,
      },
    });

    if (rolExistente) {
      return res.status(409).json({
        mensaje: "Ya existe un rol con ese nombre",
      });
    }

    // Crear rol
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
const updateRole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, estado } = req.body;

    const rolExistente = await prisma.role.findUnique({
      where: { id },
    });

    if (!rolExistente) {
      return res.status(404).json({
        mensaje: "Rol no encontrado",
      });
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        estado,
      },
    });

    res.json(role);
  } catch (error) {
    console.error("Error al actualizar el rol:", error);

    res.status(500).json({
      mensaje: "Error al actualizar el rol",
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const rolExistente = await prisma.role.findUnique({
      where: { id },
    });

    if (!rolExistente) {
      return res.status(404).json({
        mensaje: "Rol no encontrado",
      });
    }

    await prisma.role.delete({
      where: { id },
    });

    res.json({
      mensaje: "Rol eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar el rol:", error);

    res.status(500).json({
      mensaje: "Error al eliminar el rol",
    });
  }
};
module.exports = {
  getRoles,
  createRole,
 updateRole,
  deleteRole,
};