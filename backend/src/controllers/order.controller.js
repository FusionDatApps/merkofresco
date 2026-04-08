const { ZodError } = require("zod");
const { createOrderSchema } = require("../validators/order.validator");
const { createOrderService } = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const parsedBody = createOrderSchema.parse(req.body);
    const userId = req.user?.userId ?? null; 

    const order = await createOrderService(parsedBody, userId);

    return res.status(201).json({
      ok: true,
      message: "Orden creada correctamente",
      data: {
        orderId: order.id,
        status: order.status,
        total: order.total,
        itemsCount: order.itemsCount,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Payload inválido",
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      ok: false,
      message: error.message || "Error interno al crear la orden",
    });
  }
};

module.exports = {
  createOrder,
};