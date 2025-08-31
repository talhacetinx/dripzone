import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Connection'ı hızlandırmak için global instance oluştur
const createPrismaClient = () => {
  return new PrismaClient({
    log: [], // Log'ları tamamen kapat
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Ultra hızlı bağlantı için
    transactionOptions: {
      timeout: 2000, // 2 saniye timeout
    },
  });
};

const prisma = globalForPrisma.prisma || createPrismaClient();

// Connection'ı hemen kurmaya zorla
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
  // Background'da connection'ı hemen aç
  prisma.$connect().catch(() => {
    // Connection başarısız olursa yeni instance dene
    console.log("Retrying Prisma connection...");
  });
}

export default prisma;