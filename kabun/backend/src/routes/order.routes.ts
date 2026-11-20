import { FastifyInstance } from 'fastify';
import { orderController } from '../controllers/order.controller.js';

export async function orderRoutes(fastify: FastifyInstance) {
  // Public customer phone order placement
  fastify.post('/orders', orderController.createOrder.bind(orderController));

  // Cashier / Admin orders listing
  fastify.get('/orders', orderController.getOrders.bind(orderController));

  // Cashier updates status
  fastify.patch('/orders/:id/status', orderController.updateOrderStatus.bind(orderController));

  // Customer checks active orders by table
  fastify.get('/orders/table/:tableNumber', orderController.getTableOrders.bind(orderController));
}
