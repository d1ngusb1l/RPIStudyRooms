import { Floors, Rooms, RoomStatusEnum } from "./types.js";

export const initialRooms: Rooms = {
  "323-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "323-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "332-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "332-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "332-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "332-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "332-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "337-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "337-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "337-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "337-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "337-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "342-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "342-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "352-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "352-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "352-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "352-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "352-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "423-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "423-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "423-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "423-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "423-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "424-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "424-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "433-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "435-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "437-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "437-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "437-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "442-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "442-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "442-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "442-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "442-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "453-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "453-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "453-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "453-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "453-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
};

export const floor3 = {
  floorNum: 300,
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
  rooms: [
    "332-A",
    "332-B",
    "332-C",
    "332-D",
    "332-E",
    "337-A",
    "337-B",
    "337-C",
    "337-D",
    "337-D",
    "342-B",
    "342-C",
    "352-A",
    "352-B",
    "352-C",
    "352-D",
    "352-E",
  ],
};

export const floor4 = {
  floorNum: 400,
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
  rooms: [
    "423-A",
    "423-B",
    "423-C",
    "423-D",
    "423-E",
    "424-A",
    "424-B",
    "433-A",
    "435-D",
    "437-A",
    "437-B",
    "437-C",
    "442-A",
    "442-B",
    "442-C",
    "442-D",
    "442-E",
    "453-A",
    "453-B",
    "453-C",
    "453-D",
    "453-E",
  ],
};

export const floors: Floors = {
  "3": floor3,
  "4": floor4,
};


export const bartonRooms: Rooms = {
  "1108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "2004": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "2006": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "2008": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "2108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "2308": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "3004": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "3006": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "3008": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "3108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "3308": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "4108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },
  "4308": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
  },

};

export const bartonFloor1 = {
  floorNum: 1000,
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
  rooms: [
    "1108",
  ],
};

export const bartonFloor2 = {
  floorNum: 2000,
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
  rooms: [
    "2004",
    "2006",
    "2008",
    "2108",
    "2308",
  ],
};

export const bartonFloor3 = {
  floorNum: 3000,
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
  rooms: [
    "3004",
    "3006",
    "3008",
    "3108",
    "3308",
  ],
};

export const bartonFloor4 = {
  floorNum: 4000,
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
  rooms: [
    "4108",
    "4308",
  ],
};

export const bartonFloors: Floors = {
  "1": bartonFloor1,
  "2": bartonFloor2,
  "3": bartonFloor3,
  "4": bartonFloor4,
};
