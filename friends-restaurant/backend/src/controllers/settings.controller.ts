import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../config/database.js';

const DEFAULT_SETTINGS = {
  restaurantName: 'KABUN COFFEE + ROASTERY',
  tagline: 'CRAFTED FROM COFFEE',
  heroTitle1: 'CRAFTED FROM',
  heroTitle2: 'COFFEE',
  heroDescription:
    'Upscale specialty coffee roastery in Mekelle. Experience single-origin Ethiopian beans roasted with precision, slow-steeped cold brews, artisanal espresso creations, and freshly baked viennoiserie.',
  primaryCtaText: 'EXPLORE ROASTERY MENU',
  secondaryCtaText: 'OUR ROASTERY CRAFT',

  wifiSsid: 'Kabun_Guest_WiFi',
  wifiPassword: 'craftedfromcoffee',

  philosophyEyebrow: 'Our Roastery Craft',
  philosophyTitle: 'BORN IN ETHIOPIA.\nCRAFTED WITH OBSESSIVE PASSION.',
  philosophyDescription:
    'Kabun is more than a café — it is a sanctuary for coffee lovers, artists, and conversation. We source exceptional micro-lots from Yirgacheffe, Guji, and Sidama, hand-roasting small batches to honor Ethiopia\'s coffee heritage in a modern architectural lounge.',
  manifestoQuote: 'Every great conversation begins with an exceptional roast.',
  manifestoAuthor: 'The Roaster\'s Manifesto',

  galleryTitle: 'ATMOSPHERE & ARTISAN ROASTS',
  galleryDescription:
    'A glimpse into our warm wood interiors, illuminated night storefront, aromatic pour-over bar, and shared moments at Kabun.',

  addressLine1: 'Mekelle, Tigray, Ethiopia',
  addressLine2: 'ካቡን ኮፊ እና ሮስተሪ (Kebele 17 / Main Roastery)',
  openingHours: '7:00 AM – 10:30 PM',
  phone1: '0914000000',
  phone2: '0920000000',
  instagramHandle: '@KABUNCOFFEE',
  instagramUrl: 'https://www.instagram.com/kabuncoffee/',
  tiktokHandle: '@KABUNCOFFEE',
  tiktokUrl: 'https://www.tiktok.com/@kabuncoffee',
  facebookHandle: 'FB: KABUN COFFEE + ROASTERY - ካቡን',
  facebookUrl: 'https://www.facebook.com/search/top?q=KABUN%20COFFEE%20ROASTERY',

  accentColor: '#E5CFAF',
  backgroundColor: '#0E2F2C',
  cardColor: '#143834',
  fontFamily: 'Outfit, sans-serif',
};

export class SettingsController {
  async getSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      let settings = await prisma.siteSetting.findUnique({
        where: { id: 'default' },
      });

      if (!settings) {
        settings = await prisma.siteSetting.create({
          data: {
            id: 'default',
            ...DEFAULT_SETTINGS,
          },
        });
      }

      return reply.send({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch site settings',
      });
    }
  }

  async updateSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as Record<string, any>;
      // Remove id from body if present
      delete body.id;
      delete body.updatedAt;

      const updated = await prisma.siteSetting.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          ...DEFAULT_SETTINGS,
          ...body,
        },
        update: {
          ...body,
        },
      });

      return reply.send({
        success: true,
        message: 'Settings updated successfully',
        data: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update settings',
      });
    }
  }

  async resetSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const reset = await prisma.siteSetting.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          ...DEFAULT_SETTINGS,
        },
        update: {
          ...DEFAULT_SETTINGS,
        },
      });

      return reply.send({
        success: true,
        message: 'Site settings restored to default successfully',
        data: reset,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to restore default settings',
      });
    }
  }
}

export const settingsController = new SettingsController();

