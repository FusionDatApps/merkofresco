const prisma = require("../config/prisma");

const roundMoney = (value) => {
  return Number(Number(value).toFixed(2));
};

const createOrderService = async (data, userId = null) => {
  const normalizedItems = data.items.map((item) => {
    const unitPrice = roundMoney(item.unitPrice);
    const quantity = item.quantity;
    const expectedLineTotal = roundMoney(unitPrice * quantity);

    if (roundMoney(item.lineTotal) !== expectedLineTotal) {
      const error = new Error(
        `lineTotal inválido para productId ${item.productId}`
      );
      error.statusCode = 400;
      throw error;
    }

    return {
      productId: item.productId,
      productName: item.productName.trim(),
      unitPrice,
      quantity,
      lineTotal: expectedLineTotal,
    };
  });

  const expectedTotal = roundMoney(
    normalizedItems.reduce((acc, item) => acc + item.lineTotal, 0)
  );

  if (roundMoney(data.total) !== expectedTotal) {
    const error = new Error("Total inválido");
    error.statusCode = 400;
    throw error;
  }

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone.trim(),
        customerAddress: data.customerAddress.trim(),
        total: expectedTotal,
        status: "PENDING",
      },
    });

    await tx.orderItem.createMany({
      data: normalizedItems.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    });

    const itemsCount = normalizedItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      id: createdOrder.id,
      status: createdOrder.status,
      total: Number(createdOrder.total),
      itemsCount,
      customerName: createdOrder.customerName,
      customerPhone: createdOrder.customerPhone,
      customerAddress: createdOrder.customerAddress,
      createdAt: createdOrder.createdAt,
    };
  });

  return order;
};

module.exports = {
  createOrderService,
};