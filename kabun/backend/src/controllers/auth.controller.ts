import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parseResult = loginSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          error: parseResult.error.errors[0]?.message || 'Invalid login details',
        });
      }

      const { username, email, password } = parseResult.data;
      const identifier = (username || email || '').trim();

      if (!identifier) {
        return reply.status(400).send({
          success: false,
          error: 'Username or email is required',
        });
      }

      const lowerId = identifier.toLowerCase();

      // Find admin with exact match on username or email (Fix 5: No permissive prefix matching)
      const admin = await prisma.admin.findFirst({
        where: {
          OR: [
            { username: identifier },
            { username: lowerId },
            { email: lowerId },
          ],
        },
      });

      // Constant-time check: compare with dummy hash if account not found to prevent timing analysis & user enumeration (Fix 2)
      let isPasswordValid = false;
      if (admin) {
        isPasswordValid = await bcrypt.compare(password, admin.password);
      } else {
        await bcrypt.compare(password, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
      }

      if (!admin || !isPasswordValid) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid username or password. Access denied.',
        });
      }

      // Generate JWT
      const token = (request.server as any).jwt.sign(
        {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
        },
        { expiresIn: '1d' }
      );

      return reply.send({
        success: true,
        message: 'Welcome back to Kabun Coffee Manager!',
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
        },
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'An error occurred during authentication',
      });
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string; username?: string; email: string; name: string };
      const admin = await prisma.admin.findUnique({
        where: { id: user.id },
        select: { id: true, username: true, email: true, name: true, createdAt: true },
      });

      if (!admin) {
        return reply.status(404).send({
          success: false,
          error: 'Admin not found',
        });
      }

      return reply.send({
        success: true,
        admin,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string; username?: string; email: string; name: string };
      const { username, email, name, currentPassword, newPassword } = request.body as {
        username?: string;
        email?: string;
        name?: string;
        currentPassword?: string;
        newPassword?: string;
      };

      const admin = await prisma.admin.findUnique({
        where: { id: user.id },
      });

      if (!admin) {
        return reply.status(404).send({
          success: false,
          error: 'Admin account not found',
        });
      }

      // If user wants to change password, verify current password if provided
      if (newPassword && newPassword.trim()) {
        if (currentPassword && currentPassword.trim()) {
          const isCurrentValid = await bcrypt.compare(currentPassword, admin.password);
          if (!isCurrentValid) {
            return reply.status(401).send({
              success: false,
              error: 'Current password is incorrect. Please enter your valid current password.',
            });
          }
        }

        if (newPassword.trim().length < 6) {
          return reply.status(400).send({
            success: false,
            error: 'New password must be at least 6 characters long',
          });
        }
      }

      const updateData: any = {};

      if (username && username.trim()) {
        const cleanUsername = username.trim();
        // Check if username is already in use by another admin
        const existingUser = await prisma.admin.findFirst({
          where: {
            username: cleanUsername,
            NOT: { id: admin.id },
          },
        });
        if (existingUser) {
          return reply.status(400).send({
            success: false,
            error: 'This username is already taken by another account',
          });
        }
        updateData.username = cleanUsername;
      }

      if (name && name.trim()) {
        updateData.name = name.trim();
      }

      if (email && email.trim()) {
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail !== admin.email) {
          // Check if already in use
          const existing = await prisma.admin.findUnique({
            where: { email: normalizedEmail },
          });
          if (existing && existing.id !== admin.id) {
            return reply.status(400).send({
              success: false,
              error: 'This email address is already in use by another account',
            });
          }
          updateData.email = normalizedEmail;
        }
      }

      if (newPassword && newPassword.trim()) {
        // Completely overwrite and destroy old password hash with the new bcrypt hash
        updateData.password = await bcrypt.hash(newPassword.trim(), 10);
      }

      const updated = await prisma.admin.update({
        where: { id: admin.id },
        data: updateData,
        select: { id: true, username: true, email: true, name: true, updatedAt: true },
      });

      // Generate a fresh JWT reflecting the new username/email
      const newToken = (request.server as any).jwt.sign(
        {
          id: updated.id,
          username: updated.username,
          email: updated.email,
          name: updated.name,
        },
        { expiresIn: '1d' }
      );

      return reply.send({
        success: true,
        message: 'Account credentials updated successfully',
        token: newToken,
        admin: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update admin profile',
      });
    }
  }
}

export const authController = new AuthController();

