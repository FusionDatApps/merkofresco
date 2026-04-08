const express = require("express");
const { createOrder } = require("../controllers/order.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", requireAuth, createOrder);

module.exports = router;