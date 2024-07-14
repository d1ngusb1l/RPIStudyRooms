import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export async function createDB() {
  for (let i = 100; i < 11; i++) {
    for (let j = 0; j < 400; j += 100) {
      await prisma.room.create({
        data: {
          roomNumber: i + j,
          reportedAsOccupied: false,
          timeOfReport: '00:00'
        },
      })
    }
  }

}

export default prisma;