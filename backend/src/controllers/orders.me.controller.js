const service = require("../services/orders.me.service");

async function getMyOrders(req, res) {
  const userId = req.user.id;

  const data = await service.getMyOrders(userId);

  res.json({ ok: true, data });
}

async function getOrderById(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const order = await service.getOrderById(userId, id);

  if (!order) {
    return res.status(404).json({
      ok: false,
      message: "Order not found"
    });
  }

  res.json({ ok: true, data: order });
}

module.exports = {
  getMyOrders,
  getOrderById
};