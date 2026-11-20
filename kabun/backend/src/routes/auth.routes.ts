import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../hooks/auth.hook.js';

export async function authRoutes(fastify: FastifyInstance) {
  // Fix 3: Strict rate limiting on login endpoint (max 5 attempts per minute) to prevent brute-force attacks
  fastify.post(
    '/login',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    authController.login.bind(authController)
  );
  fastify.get('/me', { preHandler: [authenticate] }, authController.getMe.bind(authController));
  fastify.put('/profile', { preHandler: [authenticate] }, authController.updateProfile.bind(authController));
}

