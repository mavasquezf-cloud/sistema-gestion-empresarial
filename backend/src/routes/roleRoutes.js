const express = require("express");

const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

const {
  verificarToken,
  soloAdministrador,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  verificarToken,
  getRoles
);

router.post(
  "/",
  verificarToken,
  soloAdministrador,
  createRole
);

router.put(
  "/:id",
  verificarToken,
  soloAdministrador,
  updateRole
);

router.delete(
  "/:id",
  verificarToken,
  soloAdministrador,
  deleteRole
);

module.exports = router;