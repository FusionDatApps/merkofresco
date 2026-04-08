const prisma = require("../config/prisma");

const toNumber = (value) => Number(Number(value).toFixed(2));

const getActiveCartOrCreate = async (userId, tx = prisma) => {
  let cart = await tx.cart.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!cart) {
    cart = await tx.cart.create({
      data: {
        userId,
        status: "ACTIVE",
      },
    });
  }

  return cart;
};

const buildCartResponse = async (userId, tx = prisma) => {
  const cart = await getActiveCartOrCreate(userId, tx);

  const items = await tx.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: {
        include: {
          images: {
            orderBy: [
              { isPrimary: "desc" },
              { sortOrder: "asc" },
              { id: "asc" },
            ],
          },
          category: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const normalizedItems = items.map((item) => {
    const price = toNumber(item.unitPrice);
    const subtotal = toNumber(price * item.quantity);
    const primaryImage = item.product.images?.[0] || null;

    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price,
      quantity: item.quantity,
      subtotal,
      image: primaryImage?.url || null,
      unit: item.product.unit || null,
      stock: item.product.stock,
    };
  });

  const total = toNumber(
    normalizedItems.reduce((acc, item) => acc + item.subtotal, 0)
  );

  return {
    items: normalizedItems,
    total,
  };
};

const getCartService = async (userId) => {
  return buildCartResponse(userId);
};

const addCartItemService = async (userId, productId, quantity) => {
  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error("productId inválido");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    const error = new Error("quantity inválida");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    const cart = await getActiveCartOrCreate(userId, tx);

    const product = await tx.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
    });

    if (!product) {
      const error = new Error("Producto no encontrado o inactivo");
      error.statusCode = 404;
      throw error;
    }

    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const nextQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (product.stock < nextQuantity) {
      const error = new Error("Stock insuficiente");
      error.statusCode = 400;
      throw error;
    }

    if (existingItem) {
      await tx.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: nextQuantity,
        },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.price,
        },
      });
    }
  });

  return buildCartResponse(userId);
};

const updateCartItemQuantityService = async (userId, itemId, quantity) => {
  if (!Number.isInteger(itemId) || itemId <= 0) {
    const error = new Error("Item inválido");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    const error = new Error("quantity inválida");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    const item = await tx.cartItem.findUnique({
      where: {
        id: itemId,
      },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!item || item.cart.userId !== userId || item.cart.status !== "ACTIVE") {
      const error = new Error("Item no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!item.product.isActive) {
      const error = new Error("Producto inactivo");
      error.statusCode = 400;
      throw error;
    }

    if (item.product.stock < quantity) {
      const error = new Error("Stock insuficiente");
      error.statusCode = 400;
      throw error;
    }

    await tx.cartItem.update({
      where: {
        id: item.id,
      },
      data: {
        quantity,
      },
    });
  });

  return buildCartResponse(userId);
};

const removeCartItemService = async (userId, itemId) => {
  if (!Number.isInteger(itemId) || itemId <= 0) {
    const error = new Error("Item inválido");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    const item = await tx.cartItem.findUnique({
      where: {
        id: itemId,
      },
      include: {
        cart: true,
      },
    });

    if (!item || item.cart.userId !== userId || item.cart.status !== "ACTIVE") {
      const error = new Error("Item no encontrado");
      error.statusCode = 404;
      throw error;
    }

    await tx.cartItem.delete({
      where: {
        id: item.id,
      },
    });
  });

  return buildCartResponse(userId);
};

const clearCartService = async (userId) => {
  await prisma.$transaction(async (tx) => {
    const cart = await getActiveCartOrCreate(userId, tx);

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  });

  return buildCartResponse(userId);
};

module.exports = {
  getCartService,
  addCartItemService,
  updateCartItemQuantityService,
  removeCartItemService,
  clearCartService,
};