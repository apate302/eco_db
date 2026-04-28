import * as orderRepo from '../repositories/orderRepository.js';
import * as productRepo from '../repositories/productRepository.js';

export const createOrder = async (userId, items) => {
  // Validate products and prepare order items with prices
  const orderItemsWithPrices = [];
  for (const item of items) {
    const product = await productRepo.getProductById(item.productId);
    if (!product) {
      const error = new Error(`Product with ID ${item.productId} not found`);
      error.statusCode = 404;
      throw error;
    }
    
    // Check stock
    if (product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for product ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    orderItemsWithPrices.push({
      ...item,
      priceAtPurchase: product.price
    });
  }

  const order = await orderRepo.createOrder(userId, orderItemsWithPrices);

  // Update stock
  for (const item of items) {
    const product = await productRepo.getProductById(item.productId);
    await productRepo.updateProduct(product.id, { stock: product.stock - item.quantity });
  }

  return order;
};

export const getOrders = async (user) => {
  if (user.role === 'ADMIN') {
    return await orderRepo.getAllOrders();
  }
  return await orderRepo.getOrdersByUser(user.userId);
};

export const getOrderById = async (user, orderId) => {
  const order = await orderRepo.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (order.userId !== user.userId && user.role !== 'ADMIN') {
    const error = new Error('Forbidden: You can only view your own orders');
    error.statusCode = 403;
    throw error;
  }

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await orderRepo.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  return await orderRepo.updateOrderStatus(orderId, status);
};

export const deleteOrder = async (orderId) => {
  const order = await orderRepo.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  return await orderRepo.deleteOrder(orderId);
};
