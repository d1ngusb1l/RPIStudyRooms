import { Building, Buildings, Floor, Floors, Rooms, RoomStatusEnum } from "./types.js";

//rooms in the folsom library
export const folsomRooms: Rooms = {
  "323-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "323-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "332-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "332-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "332-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "332-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "332-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "337-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "337-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "337-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "337-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "337-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
// added room but may not be necessary
  "342-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "window"],
  },

  "342-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "342-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "window"],
  },
  "352-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "352-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "352-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "352-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "352-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "423-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "423-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "423-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "423-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "423-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "424-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "424-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "433-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "window"],
  },
  "435-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "window", "whiteboard"],
  },
  "437-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "437-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "437-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "442-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "442-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "442-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "442-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window"],
  },
  "442-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "453-A": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
  "453-B": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "window"],
  },
  "453-C": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "blackboard"],
  },
  "453-D": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "window"],
  },
  "453-E": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet"],
  },
};

//floors with noise reports for folsom
export const folsomFloor3: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};
export const folsomFloor4: Floor = {
  noiseReports: [{ timeReported: 0, noiseLevel: 0 }],
};

///combined folsom datastructure
export const folsomLibrary: Building = {
  "rooms" : folsomRooms,
  "floors" : { "3": folsomFloor3, "4": folsomFloor4},
};

//list of barton rooms
//their attributes are way more standardized
export const bartonRooms: Rooms = {
  "1108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "2004": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "2006": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "2008": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "2108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "2308": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "3004": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "3006": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "3008": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "3108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "3308": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "4108": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },
  "4308": {
    status: RoomStatusEnum.Empty,
    lastReported: 0,
    tags: ["outlet", "ethernet", "table", "window", "whiteboard"],
  },

};

//list of barton floors for containing noise reports
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

//combinged barton building structure
export const bartonHall: Building = {
  "rooms" : bartonRooms,
  "floors" : { "1" : bartonFloor1, "2" : bartonFloor2, "3": bartonFloor3, "4": bartonFloor4},
};

//combining all the building data structures into a single dictionary
export const allBuildings: Buildings = {
  "folsom": folsomLibrary,
  "barton": bartonHall
}