import { FastifyInstance } from 'fastify';
import { serviceController } from '../controllers/service.controller.js';

export async function serviceRoutes(fastify: FastifyInstance) {
  // Public customer phone call waiter / bill request
  fastify.post('/service-requests', serviceController.createRequest.bind(serviceController));

  // Cashier feed & fast polling summary
  fastify.get('/service-requests', serviceController.getRequests.bind(serviceController));
  fastify.patch('/service-requests/:id/status', serviceController.updateStatus.bind(serviceController));
  fastify.get('/cashier/summary', serviceController.getCashierSummary.bind(serviceController));
}
