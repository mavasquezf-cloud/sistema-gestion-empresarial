const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios",
      });
    }

    const usuario = await prisma.user.findUnique({
      where: { correo },
      include: {
        role: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    if (!usuario.estado) {
      return res.status(403).json({
        mensaje: "Usuario inactivo",
      });
    }

    const passwordCorrecto = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecto) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        roleId: usuario.roleId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.role.nombre,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    res.status(500).json({
      mensaje: "Error al iniciar sesión",
    });
  }
};

module.exports = {
  login,
};