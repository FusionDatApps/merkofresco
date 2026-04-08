const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware");
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:id", updateItemQuantity);
router.delete("/items/:id", removeItem);
router.delete("/", clearCart);

module.exports = router;