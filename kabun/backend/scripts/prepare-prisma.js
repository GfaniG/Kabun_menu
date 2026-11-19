import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgres:') || dbUrl.startsWith('postgresql:');
const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  const currentMatch = schema.match(/datasource\s+db\s+\{\s*provider\s*=\s*"([^"]+)"/);
  const currentProvider = currentMatch ? currentMatch[1] : null;

  if (currentProvider !== targetProvider) {
    schema = schema.replace(
      /(datasource\s+db\s+\{\s*provider\s*=\s*)"[^"]+"/,
      `$1"${targetProvider}"`
    );
    fs.writeFileSync(schemaPath, schema, 'utf8');
    console.log(`🔄 Configured Prisma provider: ${targetProvider} (was ${currentProvider})`);
  } else {
    console.log(`✅ Prisma provider already set to: ${targetProvider}`);
  }
}
