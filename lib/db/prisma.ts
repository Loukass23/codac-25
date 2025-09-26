import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only initialize Prisma on the server side
function createPrismaClient() {
  const databaseUrl = process.env['DATABASE_URL'];
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Parse the database URL to add connection pool parameters
  const url = new URL(databaseUrl);

  // Add connection pool parameters to prevent timeout errors
  url.searchParams.set('connection_limit', '20');
  url.searchParams.set('pool_timeout', '60');
  url.searchParams.set('connect_timeout', '60');
  url.searchParams.set('socket_timeout', '60');

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: url.toString(),
      },
    },
  });

  // Add connection retry mechanism
  const originalConnect = client.$connect.bind(client);
  client.$connect = async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        await originalConnect();
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.warn(`Database connection failed, retrying in 1s... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  return client;
}

// Only create the client if we're on the server side
export const prisma = typeof window === 'undefined'
  ? (globalForPrisma.prisma ?? createPrismaClient())
  : ({} as PrismaClient);

// Store the client globally only on the server side
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handling
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });

  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

// Connection health check utility
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection health check failed:', error);
    return false;
  }
}
