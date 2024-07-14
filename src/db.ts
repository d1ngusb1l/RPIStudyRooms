import { PrismaClient } from '@prisma/client'
import { create } from 'domain';

const prisma = new PrismaClient()

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
});


async function createDB() {
  for(let j = 100; j < 500; j += 100) {
    for(let i = 0; i < 11; i++) {
      await prisma.room.create({
        data: {
          roomNumber: (j + i),
          reportedAsOccupied: false,
          timeOfReport: new Date()
        },
      })
    }
  }

}

export async function accessDBTest() {
  //I dont know where database stuff is actually being stored so leaving this function here
  //so other people can quickly create the database themselves as well
  //createDB();
  const rooms = await prisma.room.findMany();
  console.log("Database function accessed, number of rooms: " + rooms.length);
  for(let i = 0; i < rooms.length; i++) {
    console.log(rooms[i].roomNumber + " is occupied: " + rooms[i].reportedAsOccupied + " at time: " + rooms[i].timeOfReport);
  }
}

export default prisma;