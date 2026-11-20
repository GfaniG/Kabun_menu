import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/database.js';

export class TableController {
  // GET /api/tables (Public or Admin)
  async getTables(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tables = await prisma.table.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          orders: {
            where: {
              status: { in: ['PENDING', 'PREPARING', 'SERVED'] },
            },
            select: {
              id: true,
              orderNumber: true,
              status: true,
              totalAmount: true,
              createdAt: true,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: tables,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch dining tables',
      });
    }
  }

  // POST /api/tables (Admin protected)
  async createTable(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { tableNumber, label, capacity, sortOrder } = request.body as {
        tableNumber: string;
        label?: string;
        capacity?: number;
        sortOrder?: number;
      };

      const cleanNum = (tableNumber || '').trim();
      if (!cleanNum) {
        return reply.status(400).send({
          success: false,
          error: 'Table number is required (e.g. 16 or VIP-1)',
        });
      }

      // Check if tableNumber is taken
      const existing = await prisma.table.findUnique({
        where: { tableNumber: cleanNum },
      });

      if (existing) {
        return reply.status(400).send({
          success: false,
          error: `Table ${cleanNum} already exists`,
        });
      }

      const totalTables = await prisma.table.count();

      const table = await prisma.table.create({
        data: {
          tableNumber: cleanNum,
          label: label?.trim() || `Table ${cleanNum}`,
          capacity: capacity ? Number(capacity) : 4,
          sortOrder: sortOrder !== undefined ? Number(sortOrder) : totalTables + 1,
          isActive: true,
        },
      });

      return reply.status(201).send({
        success: true,
        message: `Table ${cleanNum} added successfully!`,
        data: table,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to create table',
      });
    }
  }

  // PUT /api/tables/:id (Admin protected)
  async updateTable(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { tableNumber, label, capacity, isActive, sortOrder } = request.body as {
        tableNumber?: string;
        label?: string;
        capacity?: number;
        isActive?: boolean;
        sortOrder?: number;
      };

      const updateData: any = {};
      if (tableNumber !== undefined && tableNumber.trim()) {
        const cleanNum = tableNumber.trim();
        // Check uniqueness if changing
        const existing = await prisma.table.findUnique({
          where: { tableNumber: cleanNum },
        });
        if (existing && existing.id !== id) {
          return reply.status(400).send({
            success: false,
            error: `Table ${cleanNum} is already assigned to another table`,
          });
        }
        updateData.tableNumber = cleanNum;
      }

      if (label !== undefined) updateData.label = label.trim();
      if (capacity !== undefined) updateData.capacity = Number(capacity);
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);
      if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

      const updated = await prisma.table.update({
        where: { id },
        data: updateData,
      });

      return reply.send({
        success: true,
        message: 'Table updated successfully',
        data: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update table',
      });
    }
  }

  // DELETE /api/tables/:id (Admin protected)
  async deleteTable(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      await prisma.table.delete({
        where: { id },
      });

      return reply.send({
        success: true,
        message: 'Table deleted successfully',
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to delete table',
      });
    }
  }
}

export const tableController = new TableController();
