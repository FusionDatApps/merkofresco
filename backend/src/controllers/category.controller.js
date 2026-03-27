const categoryService = require("../services/category.service");

async function getCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();

    return res.status(200).json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error obteniendo categorías:", error);

    return res.status(500).json({
      ok: false,
      message: "Error interno al obtener categorías",
    });
  }
}

module.exports = {
  getCategories,
};
