import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/database.js';

export class ServiceController {
  // POST /api/service-requests (Customer calls waiter or requests bill)
  async createRequest(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { tableNumber, type, paymentMethod, notes } = request.body as {
        tableNumber: string;
        type: 'CALL_WAITER' | 'REQUEST_BILL' | 'WATER_REFILL';
        paymentMethod?: string;
        notes?: string;
      };

      const cleanTable = (tableNumber || '').trim();
      if (!cleanTable) {
        return reply.status(400).send({
          success: false,
          error: 'Table number is required',
        });
      }

      const cleanType = type || 'CALL_WAITER';

      const serviceReq = await prisma.serviceRequest.create({
        data: {
          tableNumber: cleanTable,
          type: cleanType,
          paymentMethod: paymentMethod?.trim() || null,
          notes: notes?.trim() || null,
          status: 'PENDING',
        },
      });

      const message =
        cleanType === 'REQUEST_BILL'
          ? `Bill requested for Table ${cleanTable}! Cashier notified.`
          : `Barista / Waiter notified for Table ${cleanTable}! Someone is on the way.`;

      return reply.status(201).send({
        success: true,
        message,
        data: serviceReq,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'We could not dispatch your assistance request right now. Please try calling again in a moment.',
      });
    }
  }

  // GET /api/service-requests (Cashier feed)
  async getRequests(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { status } = request.query as { status?: string };

      const where: any = {};
      if (status && status !== 'all') {
        where.status = status;
      } else if (!status) {
        where.status = 'PENDING';
      }

      const requests = await prisma.serviceRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      return reply.send({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch service requests',
      });
    }
  }

  // PATCH /api/service-requests/:id/status
  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      const updated = await prisma.serviceRequest.update({
        where: { id },
        data: { status: status || 'COMPLETED' },
      });

      return reply.send({
        success: true,
        message: 'Request status updated',
        data: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update request',
      });
    }
  }

  // GET /api/cashier/summary (Fast polling status for Cashier Bell & Alerts)
  async getCashierSummary(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [pendingOrdersCount, pendingRequestsCount, latestOrder, latestRequest] =
        await Promise.all([
          prisma.order.count({
            where: { status: 'PENDING' },
          }),
          prisma.serviceRequest.count({
            where: { status: 'PENDING' },
          }),
          prisma.order.findFirst({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            select: { id: true, orderNumber: true, tableNumber: true, createdAt: true },
          }),
          prisma.serviceRequest.findFirst({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            select: { id: true, tableNumber: true, type: true, createdAt: true },
          }),
        ]);

      return reply.send({
        success: true,
        data: {
          pendingOrdersCount,
          pendingRequestsCount,
          totalPendingAlerts: pendingOrdersCount + pendingRequestsCount,
          latestOrder,
          latestRequest,
          serverTime: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch cashier summary',
      });
    }
  }
}

export const serviceController = new ServiceController();
