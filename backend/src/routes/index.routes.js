const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        mensaje: "API Sistema de Gestión Empresarial",
        version: "1.0.0"
    });
});

module.exports = router;