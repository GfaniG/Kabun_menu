import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function ensureDatabaseReady() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn('⚠️ DATABASE_URL is not defined in environment variables.');
      return;
    }

    // Automatically align Prisma schema datasource provider with DATABASE_URL
    const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
    if (fs.existsSync(schemaPath)) {
      let schema = fs.readFileSync(schemaPath, 'utf8');
      const targetProvider = dbUrl.startsWith('file:') ? 'sqlite' : 'postgresql';
      const currentProviderMatch = schema.match(/datasource\s+db\s+\{\s*provider\s*=\s*"([^"]+)"/);
      if (currentProviderMatch && currentProviderMatch[1] !== targetProvider) {
        console.log(`🔄 Switching Prisma datasource provider from ${currentProviderMatch[1]} to ${targetProvider}...`);
        schema = schema.replace(
          /(datasource\s+db\s+\{\s*provider\s*=\s*)"[^"]+"/,
          `$1"${targetProvider}"`
        );
        fs.writeFileSync(schemaPath, schema, 'utf8');
        execSync('npx prisma generate', {
          stdio: 'inherit',
          env: process.env,
          timeout: 60000,
        });
      }
    }

    console.log('🔄 Synchronizing database schema with Prisma...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      env: process.env,
      timeout: 60000,
    });

    // Check if Kabun Coffee has been seeded
    const kabunCategory = await prisma.category.findFirst({
      where: { slug: 'espresso-hot-classics' },
    }).catch(() => null);

    const adminCount = await prisma.admin.count().catch(() => 0);
    const tableCount = await prisma.table.count().catch(() => 0);

    if (tableCount === 0) {
      console.log('🌱 Ensuring initial 15 roastery dining tables...');
      for (let i = 1; i <= 15; i++) {
        const tableNum = String(i);
        await prisma.table.upsert({
          where: { tableNumber: tableNum },
          update: {},
          create: {
            tableNumber: tableNum,
            label: `Table ${tableNum}`,
            sortOrder: i,
            capacity: i <= 4 ? 2 : i <= 12 ? 4 : 6,
            isActive: true,
          },
        }).catch(() => {});
      }
    }

    if (!kabunCategory || adminCount === 0) {
      console.log('🌱 Running automated Kabun Coffee + Roastery database seeding...');
      execSync('npx tsx prisma/seed.ts', {
        stdio: 'inherit',
        env: process.env,
        timeout: 60000,
      });
      console.log('🎉 Kabun Coffee + Roastery database initialized and seeded successfully!');
    } else {
      console.log(`✅ Kabun Coffee + Roastery database ready (${adminCount} admin account(s) active).`);
    }
  } catch (err: any) {
    console.warn('⚠️ Automated database setup notice:', err?.message || err);
  }
}
