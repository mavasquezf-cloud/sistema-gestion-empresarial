const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Token no proporcionado",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
};
const soloAdministrador = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      mensaje: "Usuario no autenticado",
    });
  }

  if (req.usuario.roleId !== 2) {
    return res.status(403).json({
      mensaje: "No tienes permisos para realizar esta acción",
    });
  }

  next();
};

module.exports = {
  verificarToken,
  soloAdministrador,
};