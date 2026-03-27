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

module.exports = {
  getAllProducts,
};