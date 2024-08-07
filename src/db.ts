import { Building, Floor, Floors, Rooms, RoomStatusEnum } from "./types.js";

export const folsomRooms: Rooms = {
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

export const folsomFloor3: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};

export const folsomFloor4: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};

export const floors: Floors = {
  "3": folsomFloor3,
  "4": folsomFloor4,
};

export const folsomLibrary: Building = {
  "rooms" : folsomRooms,
  "floors" : { "3": folsomFloor3, "4": folsomFloor4},
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

export const bartonFloor1: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};

export const bartonFloor2: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};

export const bartonFloor3: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};

export const bartonFloor4: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};

export const barton: Building = {
  "rooms" : bartonRooms,
  "floors" : { "1" : bartonFloor1, "2" : bartonFloor2, "3": folsomFloor3, "4": folsomFloor4},
};
