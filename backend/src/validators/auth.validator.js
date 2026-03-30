const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .trim(),
  email: z
    .string()
    .email("El email no tiene un formato válido")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("El email no tiene un formato válido")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

module.exports = {
  registerSchema,
  loginSchema,
};