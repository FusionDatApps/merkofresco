const prisma = require("../config/prisma");

async function getAllProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
          sortOrder: true,
        },
      },
    },
  });
}

async function getProductById(id) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
      category: {
        isActive: true,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
          sortOrder: true,
        },
      },
    },
  });

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function validateCategoryExists(categoryId) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isActive: true,
    },
  });

  if (!category) {
    const error = new Error("La categoría indicada no existe o está inactiva");
    error.statusCode = 400;
    throw error;
  }

  return category;
}

async function validateSlugUnique(slug, currentProductId = null) {
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct && existingProduct.id !== currentProductId) {
    const error = new Error("Ya existe un producto con ese slug");
    error.statusCode = 409;
    throw error;
  }
}

async function createProduct(data) {
  await validateCategoryExists(data.categoryId);
  await validateSlugUnique(data.slug);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price: data.price,
      stock: data.stock,
      unit: data.unit || "unidad",
      categoryId: data.categoryId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
          sortOrder: true,
        },
      },
    },
  });

  return product;
}

async function updateProduct(id, data) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },
  });

  if (!existingProduct) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (data.categoryId !== undefined) {
    await validateCategoryExists(data.categoryId);
  }

  if (data.slug !== undefined) {
    await validateSlugUnique(data.slug, id);
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
          sortOrder: true,
        },
      },
    },
  });

  return updatedProduct;
}

async function softDeleteProduct(id) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },
  });

  if (!existingProduct) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const deletedProduct = await prisma.product.update({
    where: { id },
    data: {
      isActive: false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
          sortOrder: true,
        },
      },
    },
  });

  return deletedProduct;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
};