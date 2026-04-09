const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/auth.middleware");
const controller = require("../controllers/orders.me.controller");

// EXISTENTE: POST /api/orders (NO TOCAR)

// NUEVO
router.get("/me", requireAuth, controller.getMyOrders);
router.get("/:id", requireAuth, controller.getOrderById);

module.exports = router;