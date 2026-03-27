const { PrismaClient, UserRole, CartStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@merkofresco.com" },
    update: {},
    create: {
      name: "Admin MerKofresco",
      email: "admin@merkofresco.com",
      password: "HASH_TEMPORAL_REEMPLAZAR_DIA_3",
      role: UserRole.ADMIN,
    },
  });

  const categoriesData = [
    {
      name: "Frutas",
      slug: "frutas",
      description: "Frutas frescas seleccionadas",
    },
    {
      name: "Verduras",
      slug: "verduras",
      description: "Verduras frescas del día",
    },
    {
      name: "Carnes",
      slug: "carnes",
      description: "Carnes frescas y de alta calidad",
    },
    {
      name: "Pescados",
      slug: "pescados",
      description: "Pescados frescos",
    },
    {
      name: "Mariscos",
      slug: "mariscos",
      description: "Mariscos frescos y congelados",
    },
  ];

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const frutas = await prisma.category.findUnique({ where: { slug: "frutas" } });
  const verduras = await prisma.category.findUnique({ where: { slug: "verduras" } });
  const carnes = await prisma.category.findUnique({ where: { slug: "carnes" } });
  const pescados = await prisma.category.findUnique({ where: { slug: "pescados" } });

  const productsData = [
    {
      name: "Mojarra Roja",
      slug: "mojarra-roja",
      description: "Mojarra roja fresca por unidad",
      price: "18000.00",
      stock: 25,
      unit: "unidad",
      categoryId: pescados.id,
      image: {
        url: "https://placehold.co/600x400?text=Mojarra+Roja",
        altText: "Mojarra roja fresca",
        isPrimary: true,
        sortOrder: 1,
      },
    },
    {
      name: "Salmón en Filete",
      slug: "salmon-en-filete",
      description: "Filete de salmón fresco",
      price: "42000.00",
      stock: 15,
      unit: "kg",
      categoryId: pescados.id,
      image: {
        url: "https://placehold.co/600x400?text=Salmon+Filete",
        altText: "Salmón en filete",
        isPrimary: true,
        sortOrder: 1,
      },
    },
    {
      name: "Pechuga de Pollo",
      slug: "pechuga-de-pollo",
      description: "Pechuga de pollo fresca",
      price: "16000.00",
      stock: 40,
      unit: "kg",
      categoryId: carnes.id,
      image: {
        url: "https://placehold.co/600x400?text=Pechuga+de+Pollo",
        altText: "Pechuga de pollo",
        isPrimary: true,
        sortOrder: 1,
      },
    },
    {
      name: "Tomate Chonto",
      slug: "tomate-chonto",
      description: "Tomate fresco seleccionado",
      price: "3500.00",
      stock: 80,
      unit: "kg",
      categoryId: verduras.id,
      image: {
        url: "https://placehold.co/600x400?text=Tomate+Chonto",
        altText: "Tomate chonto fresco",
        isPrimary: true,
        sortOrder: 1,
      },
    },
    {
      name: "Banano",
      slug: "banano",
      description: "Banano fresco por kilo",
      price: "2800.00",
      stock: 100,
      unit: "kg",
      categoryId: frutas.id,
      image: {
        url: "https://placehold.co/600x400?text=Banano",
        altText: "Banano fresco",
        isPrimary: true,
        sortOrder: 1,
      },
    },
  ];

  const createdProducts = [];

  for (const item of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        unit: item.unit,
        categoryId: item.categoryId,
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        stock: item.stock,
        unit: item.unit,
        categoryId: item.categoryId,
        isActive: true,
      },
    });

    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    await prisma.productImage.create({
      data: {
        url: item.image.url,
        altText: item.image.altText,
        isPrimary: item.image.isPrimary,
        sortOrder: item.image.sortOrder,
        productId: product.id,
      },
    });

    createdProducts.push(product);
  }

  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany({
    where: { userId: user.id },
  });

  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      status: CartStatus.ACTIVE,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: createdProducts[0].id,
      quantity: 2,
      unitPrice: createdProducts[0].price,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: createdProducts[2].id,
      quantity: 1,
      unitPrice: createdProducts[2].price,
    },
  });

  console.log("Seed ejecutado correctamente.");
}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });