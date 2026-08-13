const express = require("express");

const {
  getRoles,
  createRole,
} = require("../controllers/roleController");

const router = express.Router();

router.get("/", getRoles);
router.post("/", createRole);

module.exports = router;