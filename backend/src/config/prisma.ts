import { PrismaClient } from '@prisma/client';
import { isDev } from './index';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma: ReturnType<typeof prismaClientSingleton> =
  globalThis.prismaGlobal ?? prismaClientSingleton();

if (isDev) globalThis.prismaGlobal = prisma;

export default prisma;
