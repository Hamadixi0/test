import { PrismaClient } from '@prisma/client';

export class DatabaseService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }
    return DatabaseService.instance;
  }

  public static async initialize(): Promise<void> {
    const prisma = DatabaseService.getInstance();
    await prisma.$connect();
  }

  public static async healthCheck(): Promise<void> {
    const prisma = DatabaseService.getInstance();
    await prisma.$queryRaw`SELECT 1`;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseService.instance) {
      await DatabaseService.instance.$disconnect();
    }
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();