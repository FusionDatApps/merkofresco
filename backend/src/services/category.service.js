const prisma = require("../config/prisma");

async function getAllCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

module.exports = {
  getAllCategories,
};