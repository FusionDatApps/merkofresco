const { ZodError } = require("zod");
const productService = require("../services/product.service");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

async function getProducts(req, res) {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      ok: true,
      data: products,
    });
  } catch (error) {
    return handleError(res, error, "Error interno al obtener productos");
  }
}

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: "El id debe ser numérico",
      });
    }

    const product = await productService.getProductById(id);

    return res.status(200).json({
      ok: true,
      data: product,
    });
  } catch (error) {
    return handleError(res, error, "Error interno al obtener el producto");
  }
}

async function createProduct(req, res) {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);

    return res.status(201).json({
      ok: true,
      data: product,
    });
  } catch (error) {
    return handleError(res, error, "Error interno al crear el producto");
  }
}

async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: "El id debe ser numérico",
      });
    }

    const validatedData = updateProductSchema.parse(req.body);
    const updatedProduct = await productService.updateProduct(id, validatedData);

    return res.status(200).json({
      ok: true,
      data: updatedProduct,
    });
  } catch (error) {
    return handleError(res, error, "Error interno al actualizar el producto");
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: "El id debe ser numérico",
      });
    }

    const deletedProduct = await productService.softDeleteProduct(id);

    return res.status(200).json({
      ok: true,
      data: deletedProduct,
    });
  } catch (error) {
    return handleError(res, error, "Error interno al eliminar el producto");
  }
}

function handleError(res, error, defaultMessage) {
  console.error(defaultMessage, error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      message: error.issues.map((issue) => issue.message).join(", "),
    });
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      ok: false,
      message: "Ya existe un registro con un valor único duplicado",
    });
  }

  if (error.code && error.code.startsWith("P")) {
    return res.status(500).json({
      ok: false,
      message: "Error de base de datos",
    });
  }

  return res.status(error.statusCode || 500).json({
    ok: false,
    message: error.message || defaultMessage,
  });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};