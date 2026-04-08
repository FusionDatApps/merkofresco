const prisma = require("../config/prisma");

const createOrderService = async (data, userId = null) => {
  if (!userId) {
    const error = new Error("Usuario no autenticado");
    error.statusCode = 401;
    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Obtener carrito activo
    const cart = await tx.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error("Carrito vacío");
      error.statusCode = 400;
      throw error;
    }

    // 2. Validar stock y construir items
    let total = 0;

    const orderItems = cart.items.map((item) => {
      if (item.product.stock < item.quantity) {
        const error = new Error(
          `Stock insuficiente para ${item.product.name}`
        );
        error.statusCode = 400;
        throw error;
      }

      const lineTotal = Number(item.unitPrice) * item.quantity;
      total += lineTotal;

      return {
        productId: item.productId,
        productName: item.product.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    // 3. Crear orden
    const order = await tx.order.create({
      data: {
        userId,
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone.trim(),
        customerAddress: data.customerAddress.trim(),
        total,
        status: "PENDING",
      },
    });

    // 4. Crear items
    await tx.orderItem.createMany({
      data: orderItems.map((item) => ({
        ...item,
        orderId: order.id,
      })),
    });

    // 5. Descontar stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 6. Convertir carrito
    await tx.cart.update({
      where: { id: cart.id },
      data: { status: "CONVERTED" },
    });

    // 7. Crear nuevo carrito
    await tx.cart.create({
      data: { userId },
    });

    return {
      id: order.id,
      status: order.status,
      total,
      itemsCount: orderItems.reduce((acc, i) => acc + i.quantity, 0),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      createdAt: order.createdAt,
    };
  });
};

module.exports = {
  createOrderService,
};