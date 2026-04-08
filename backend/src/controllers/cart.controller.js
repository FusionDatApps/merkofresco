const { ZodError, z } = require("zod");
const {
  getCartService,
  addCartItemService,
  updateCartItemQuantityService,
  removeCartItemService,
  clearCartService,
} = require("../services/cart.service");

const addItemSchema = z.object({
  productId: z.number().int("productId inválido").positive("productId inválido"),
  quantity: z.number().int("quantity inválida").positive("quantity debe ser mayor a 0"),
});

const updateItemSchema = z.object({
  quantity: z.number().int("quantity inválida").positive("quantity debe ser mayor a 0"),
});

const handleCartError = (res, error) => {
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
    message: error.message || "Error interno del servidor",
  });
};

const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const cart = await getCartService(userId);

    return res.status(200).json({
      ok: true,
      data: cart,
    });
  } catch (error) {
    return handleCartError(res, error);
  }
};

const addItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const parsedBody = addItemSchema.parse(req.body);

    const cart = await addCartItemService(
      userId,
      parsedBody.productId,
      parsedBody.quantity
    );

    return res.status(200).json({
      ok: true,
      message: "Producto agregado al carrito",
      data: cart,
    });
  } catch (error) {
    return handleCartError(res, error);
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const itemId = Number(req.params.id);
    const parsedBody = updateItemSchema.parse(req.body);

    const cart = await updateCartItemQuantityService(
      userId,
      itemId,
      parsedBody.quantity
    );

    return res.status(200).json({
      ok: true,
      message: "Cantidad actualizada correctamente",
      data: cart,
    });
  } catch (error) {
    return handleCartError(res, error);
  }
};

const removeItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const itemId = Number(req.params.id);

    const cart = await removeCartItemService(userId, itemId);

    return res.status(200).json({
      ok: true,
      message: "Producto eliminado del carrito",
      data: cart,
    });
  } catch (error) {
    return handleCartError(res, error);
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const cart = await clearCartService(userId);

    return res.status(200).json({
      ok: true,
      message: "Carrito vaciado correctamente",
      data: cart,
    });
  } catch (error) {
    return handleCartError(res, error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};