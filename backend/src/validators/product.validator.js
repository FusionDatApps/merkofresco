const { z } = require("zod");

const createProductSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  slug: z
    .string({ required_error: "El slug es obligatorio" })
    .trim()
    .min(1, "El slug es obligatorio"),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  price: z.coerce
    .number({ invalid_type_error: "El precio debe ser numérico" })
    .positive("El precio debe ser mayor que 0"),

  stock: z.coerce
    .number({ invalid_type_error: "El stock debe ser numérico" })
    .int("El stock debe ser un entero")
    .min(0, "El stock no puede ser negativo"),

  categoryId: z.coerce
    .number({ invalid_type_error: "categoryId debe ser numérico" })
    .int("categoryId debe ser un entero")
    .positive("categoryId debe ser mayor que 0"),

  unit: z
    .string()
    .trim()
    .min(1, "La unidad no puede estar vacía")
    .optional()
    .default("unidad"),
});

const updateProductSchema = z
  .object({
    name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
    slug: z.string().trim().min(1, "El slug es obligatorio").optional(),
    description: z.string().trim().optional().or(z.literal("")),
    price: z.coerce.number().positive("El precio debe ser mayor que 0").optional(),
    stock: z.coerce.number().int("El stock debe ser un entero").min(0, "El stock no puede ser negativo").optional(),
    categoryId: z.coerce.number().int("categoryId debe ser un entero").positive("categoryId debe ser mayor que 0").optional(),
    unit: z.string().trim().min(1, "La unidad no puede estar vacía").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

module.exports = {
  createProductSchema,
  updateProductSchema,
};