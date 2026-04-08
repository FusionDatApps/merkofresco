const { z } = require("zod");

const createOrderSchema = z.object({
  customerName: z.string().trim().min(1, "Nombre requerido"),
  customerPhone: z.string().trim().min(1, "Teléfono requerido"),
  customerAddress: z.string().trim().min(1, "Dirección requerida"),
});

module.exports = {
  createOrderSchema,
};