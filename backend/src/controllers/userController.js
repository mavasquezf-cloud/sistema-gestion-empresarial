const bcrypt = require("bcrypt");
const prisma = require("../config/database");

const createUser = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      correo,
      password,
      telefono,
      roleId,
    } = req.body;

    if (!nombre || !apellido || !correo || !password || !roleId) {
      return res.status(400).json({
        mensaje: "Nombre, apellido, correo, contraseña y rol son obligatorios",
      });
    }

    const usuarioExistente = await prisma.user.findUnique({
      where: {
        correo,
      },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "Ya existe un usuario con ese correo",
      });
    }

    const rolExistente = await prisma.role.findUnique({
      where: {
        id: parseInt(roleId),
      },
    });

    if (!rolExistente) {
      return res.status(404).json({
        mensaje: "El rol indicado no existe",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        nombre,
        apellido,
        correo,
        password: passwordHash,
        telefono,
        roleId: parseInt(roleId),
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        estado: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear el usuario:", error);

    res.status(500).json({
      mensaje: "Error al crear el usuario",
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        estado: true,
        roleId: true,
        role: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);

    res.status(500).json({
      mensaje: "Error al obtener los usuarios",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      nombre,
      apellido,
      correo,
      password,
      telefono,
      roleId,
      estado,
    } = req.body;

    // Comprobar que el usuario exista
    const usuarioExistente = await prisma.user.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    // Comprobar que el correo no pertenezca a otro usuario
    if (correo) {
      const correoExistente = await prisma.user.findUnique({
        where: { correo },
      });

      if (correoExistente && correoExistente.id !== id) {
        return res.status(409).json({
          mensaje: "Ya existe otro usuario con ese correo",
        });
      }
    }

    // Comprobar que el rol exista
    if (roleId) {
      const rolExistente = await prisma.role.findUnique({
        where: {
          id: parseInt(roleId),
        },
      });

      if (!rolExistente) {
        return res.status(404).json({
          mensaje: "El rol indicado no existe",
        });
      }
    }

    // Datos que se actualizarán
    const datosActualizar = {
      nombre,
      apellido,
      correo,
      telefono,
      estado,
    };

    if (roleId) {
      datosActualizar.roleId = parseInt(roleId);
    }

    // Solo cambiar contraseña si se envió una nueva
    if (password) {
      datosActualizar.password = await bcrypt.hash(password, 10);
    }

    const usuarioActualizado = await prisma.user.update({
      where: { id },
      data: datosActualizar,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        estado: true,
        roleId: true,
        role: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);

    res.status(500).json({
      mensaje: "Error al actualizar el usuario",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const usuarioExistente = await prisma.user.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);

    res.status(500).json({
      mensaje: "Error al eliminar el usuario",
    });
  }
};

module.exports = {
  createUser,
   getUsers,
   updateUser,
   deleteUser,
};