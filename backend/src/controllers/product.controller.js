const productService = require("../services/product.service");

async function getProducts(req, res) {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      ok: true,
      data: products,
    });
  } catch (error) {
    console.error("Error obteniendo productos:", error);

    return res.status(500).json({
      ok: false,
      message: "Error interno al obtener productos",
    });
  }
}

module.exports = {
  getProducts,
};