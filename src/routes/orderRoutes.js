import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/index.js';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Customer gets own, Admin gets all)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, orderController.getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not owner/admin)
 *       404:
 *         description: Order not found
 */
router.get('/:id', verifyToken, orderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error or Insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/', verifyToken, validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.put('/:id', verifyToken, requireAdmin, validate(updateOrderStatusSchema), orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Order deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.delete('/:id', verifyToken, requireAdmin, orderController.deleteOrder);

export default router;
