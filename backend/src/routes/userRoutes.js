const express = require("express");
const {
  verificarToken,
  soloAdministrador,
} = require("../middleware/authMiddleware");

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", verificarToken, getUsers);

router.post(
  "/",
  verificarToken,
  soloAdministrador,
  createUser
);

router.put(
  "/:id",
  verificarToken,
  soloAdministrador,
  updateUser
);

router.delete(
  "/:id",
  verificarToken,
  soloAdministrador,
  deleteUser
);

module.exports = router;