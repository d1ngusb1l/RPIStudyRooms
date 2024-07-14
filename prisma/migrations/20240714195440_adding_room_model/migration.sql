-- CreateTable
CREATE TABLE "Room" (
    "roomNumber" INTEGER NOT NULL,
    "reportedAsOccupied" BOOLEAN NOT NULL,
    "timeOfReport" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");
