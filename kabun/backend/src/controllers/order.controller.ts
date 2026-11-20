import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/database.js';

export class OrderController {
  // POST /api/orders (Customer phone order submission)
  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { tableNumber, items, customerNotes } = request.body as {
        tableNumber: string;
        items: Array<{
          menuItemId?: string;
          name: string;
          price: number;
          quantity: number;
          notes?: string;
        }>;
        customerNotes?: string;
      };

      const cleanTable = (tableNumber || '').trim();
      if (!cleanTable) {
        return reply.status(400).send({
          success: false,
          error: 'Table number is required to place an order',
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Your order must contain at least one item',
        });
      }

      // Calculate total amount
      let total = 0;
      for (const it of items) {
        const qty = Math.max(1, Number(it.quantity) || 1);
        const pr = Math.max(0, Number(it.price) || 0);
        total += pr * qty;
      }

      // Generate distinct readable order number e.g. KAB-1082
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `KAB-${randomSuffix}`;

      // Create Order & Items transaction
      const order = await prisma.order.create({
        data: {
          orderNumber,
          tableNumber: cleanTable,
          status: 'PENDING',
          totalAmount: total,
          customerNotes: customerNotes?.trim() || null,
          items: {
            create: items.map((it) => ({
              menuItemId: it.menuItemId || null,
              name: it.name,
              price: Number(it.price) || 0,
              quantity: Math.max(1, Number(it.quantity) || 1),
              notes: it.notes?.trim() || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return reply.status(201).send({
        success: true,
        message: `Order #${order.orderNumber} sent to Kabun Roastery Barista!`,
        data: order,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'We could not submit your order right now. Please try tapping Send again.',
      });
    }
  }

  // GET /api/orders (Cashier/Admin Desktop orders feed)
  async getOrders(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { status, limit } = request.query as { status?: string; limit?: string };

      const where: any = {};
      if (status === 'active') {
        where.status = { in: ['PENDING', 'PREPARING', 'SERVED'] };
      } else if (status && status !== 'all') {
        where.status = status;
      }

      const take = limit ? parseInt(limit, 10) : 100;

      const orders = await prisma.order.findMany({
        where,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          table: {
            select: {
              label: true,
              capacity: true,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch orders',
      });
    }
  }

  // PATCH /api/orders/:id/status (Cashier changes order status)
  async updateOrderStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      const validStatuses = ['PENDING', 'PREPARING', 'SERVED', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return reply.status(400).send({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: true,
        },
      });

      return reply.send({
        success: true,
        message: `Order status updated to ${status}`,
        data: order,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update order status',
      });
    }
  }

  // GET /api/orders/table/:tableNumber (Customer checks their current orders)
  async getTableOrders(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { tableNumber } = request.params as { tableNumber: string };

      const orders = await prisma.order.findMany({
        where: {
          tableNumber,
          status: { in: ['PENDING', 'PREPARING', 'SERVED'] },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      });

      return reply.send({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch table orders',
      });
    }
  }
}

export const orderController = new OrderController();
