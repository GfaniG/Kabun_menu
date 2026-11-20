import { FastifyInstance } from 'fastify';
import { tableController } from '../controllers/table.controller.js';
import { authenticate } from '../hooks/auth.hook.js';

export async function tableRoutes(fastify: FastifyInstance) {
  // Public customer & cashier table listings
  fastify.get('/tables', tableController.getTables.bind(tableController));

  // Admin protected management
  fastify.post('/tables', { preHandler: [authenticate] }, tableController.createTable.bind(tableController));
  fastify.put('/tables/:id', { preHandler: [authenticate] }, tableController.updateTable.bind(tableController));
  fastify.delete('/tables/:id', { preHandler: [authenticate] }, tableController.deleteTable.bind(tableController));
}
