const { z } = require("zod");

const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Nombre requerido"),

  customerPhone: z
    .string()
    .trim()
    .min(1, "Teléfono requerido"),

  customerAddress: z
    .string()
    .trim()
    .min(1, "Dirección requerida"),

  items: z
    .array(
      z.object({
        productId: z.number().int("productId inválido"),
        productName: z.string().trim().min(1, "Nombre de producto requerido"),
        unitPrice: z.number().nonnegative("unitPrice inválido"),
        quantity: z.number().int("quantity inválida").positive("quantity debe ser mayor a 0"),
        lineTotal: z.number().nonnegative("lineTotal inválido"),
      })
    )
    .min(1, "La orden debe tener al menos un item"),

  total: z.number().nonnegative("Total inválido"),
});

module.exports = {
  createOrderSchema,
};