import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res) => {
  const order = await orderService.createOrder(req.user.userId, req.body.items);
  res.status(201).json(order);
};

export const getOrders = async (req, res) => {
  const orders = await orderService.getOrders(req.user);
  res.status(200).json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req.user, req.params.id);
  res.status(200).json(order);
};

export const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json(order);
};

export const deleteOrder = async (req, res) => {
  await orderService.deleteOrder(req.params.id);
  res.status(204).send();
};
