import prisma from '../utils/prisma.js';

export const createOrder = async (userId, items) => {
  // calculate total price
  let totalPrice = 0;
  for (const item of items) {
    totalPrice += item.priceAtPurchase * item.quantity;
  }

  return await prisma.order.create({
    data: {
      userId,
      totalPrice,
      orderItems: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase
        }))
      }
    },
    include: {
      orderItems: true
    }
  });
};

export const getOrdersByUser = async (userId) => {
  return await prisma.order.findMany({
    where: { userId: parseInt(userId) },
    include: { orderItems: true }
  });
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: { orderItems: true }
  });
};

export const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { orderItems: true }
  });
};

export const updateOrderStatus = async (id, status) => {
  return await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status }
  });
};

export const deleteOrder = async (id) => {
  return await prisma.order.delete({
    where: { id: parseInt(id) }
  });
};
