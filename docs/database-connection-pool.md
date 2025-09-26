# Database Connection Pool Configuration

This document explains the database connection pool configuration implemented to resolve connection timeout errors.

## Problem

The application was experiencing `PrismaClientKnownRequestError` with the message:

```
Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 13)
```

This error occurs when:

- The connection pool is exhausted (all 13 connections are in use)
- New requests cannot get a connection within the timeout period (10 seconds)
- This is common in development with Turbopack due to hot reloading and multiple concurrent requests

## Solution

### 1. Enhanced Prisma Client Configuration

The Prisma client is now configured with optimized connection pool parameters:

```typescript
// lib/db/prisma.ts
const url = new URL(databaseUrl);

// Connection pool parameters
url.searchParams.set('connection_limit', '20'); // Increased from 13
url.searchParams.set('pool_timeout', '60'); // Increased from 10s
url.searchParams.set('connect_timeout', '60'); // Connection timeout
url.searchParams.set('socket_timeout', '60'); // Socket timeout
```

### 2. Connection Retry Mechanism

Added automatic retry logic for failed connections:

```typescript
// Retry up to 3 times with 1-second delays
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
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

### 3. Graceful Shutdown Handling

Proper connection cleanup on process termination:

```typescript
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
```

### 4. Enhanced Error Handling

Added specific error handling for connection pool timeouts in server actions:

```typescript
// lib/utils/server-action-utils.ts
export function handleConnectionError(error: unknown): string {
  if (error instanceof Error) {
    if (
      error.message.includes('connection pool') ||
      error.message.includes('connection timeout') ||
      error.message.includes('Timed out fetching a new connection')
    ) {
      return 'Database is temporarily unavailable. Please try again in a moment.';
    }
  }
  return 'Database connection error occurred';
}
```

## Configuration Parameters

| Parameter          | Default | New Value | Description                              |
| ------------------ | ------- | --------- | ---------------------------------------- |
| `connection_limit` | 13      | 20        | Maximum number of concurrent connections |
| `pool_timeout`     | 10s     | 60s       | Time to wait for an available connection |
| `connect_timeout`  | -       | 60s       | Time to establish a new connection       |
| `socket_timeout`   | -       | 60s       | Time to wait for socket operations       |

## Testing

Run the connection pool test to verify the configuration:

```bash
pnpm db:test-connection
```

This test will:

1. Check basic connection health
2. Test concurrent connections (10 simultaneous)
3. Stress test with 25 concurrent connections
4. Verify retry mechanism
5. Display configuration summary

## Monitoring

### Health Check

Use the `checkDatabaseConnection()` function to monitor connection health:

```typescript
import { checkDatabaseConnection } from '@/lib/db/prisma';

const isHealthy = await checkDatabaseConnection();
if (!isHealthy) {
  // Handle connection issues
}
```

### Logging

Connection errors are logged with context:

- Connection pool timeouts
- Retry attempts
- Connection failures
- Graceful shutdown events

## Best Practices

1. **Connection Management**: Always use the centralized Prisma client from `lib/db/prisma.ts`
2. **Error Handling**: Use the enhanced error handling in server actions
3. **Monitoring**: Implement health checks for critical operations
4. **Testing**: Run connection pool tests after configuration changes
5. **Development**: Be aware that Turbopack can create multiple connections during hot reloading

## Troubleshooting

### Still Getting Timeout Errors?

1. Check if you're using the updated Prisma client configuration
2. Verify your DATABASE_URL is correct
3. Run the connection pool test: `pnpm db:test-connection`
4. Check database server connection limits
5. Monitor connection usage in development

### Performance Issues?

1. Consider reducing `connection_limit` if your database has lower limits
2. Adjust timeout values based on your network latency
3. Monitor connection pool usage patterns
4. Consider connection pooling at the database level (PgBouncer, etc.)

## Environment Variables

Ensure your `.env` file has the correct DATABASE_URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

For production, consider using connection pooling services like PgBouncer or Supabase's built-in connection pooling.
