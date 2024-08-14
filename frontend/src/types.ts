import { TSchema, Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { createContext } from "react";

/* 
  This file holds type definitins for rooms, noise reports, floors, and buildings.
  It also contains type verifiers. almost identical to back end types
*/


//turning room statuses into a string to be used for various calculations
export enum RoomStatusEnum {
  Empty = "empty",
  Full = "full",
  PersonalUse = "In Use by a RPI Study Rooms User",
  Closed = "closed",
}

//room contains a status, time of report, when it was claimed until, and relevant filter tags
export const RoomDef = Type.Object({
  status: Type.Enum(RoomStatusEnum),
  lastReported: Type.Number(),
  claimedUntil: Type.Optional(Type.Number()),
  tags: Type.Optional(Type.Array(Type.String())),
});
//turning our room def into regular types
export type Room = Static<typeof RoomDef>;
//creating a plural rooms def
export const RoomsDef = Type.Record(Type.String(), RoomDef);
export type Rooms = Record<string, Room>;

//noise report contains a time of report and a number indicating how loud noise was
export const NoiseReportDef = Type.Object({
  timeReported: Type.Number(),
  noiseLevel: Type.Number(),
});
export type NoiseReport = Static<typeof NoiseReportDef>;

//floors simply contain an array of noise reports
//was done like this in case we wanted floors to track more things
export const FloorDef = Type.Object({
  noiseReports: Type.Array(NoiseReportDef),
});
//turning our floor def into a type
export type Floor = Static<typeof FloorDef>;
//creating a plural floors def
export const FloorsDef = Type.Record(Type.String(), FloorDef);
export type Floors = Record<string, Floor>;

//a building simply contains a list of rooms and a list of floors
export const BuildingDef = Type.Object({
  rooms: RoomsDef,
  floors: Type.Record(Type.String(), FloorDef),
});
//turning our building def into a type
export type Building = Static<typeof BuildingDef>;
//creating a plural of buildings def
export const BuildingsDef = Type.Record(Type.String(), BuildingDef);
export type Buildings = Record<string, Building>;

//function for validating the types being passed through to the front end
// Keep these overloads, they stop type errors
export function validateType<T extends TSchema>(
  type: T,
  data: unknown,
  shouldThrow?: true
): Static<T>;
export function validateType<T extends TSchema>(
  type: T,
  data: unknown,
  shouldThrow: false
): Static<T> | null;
export function validateType<T extends TSchema>(
  type: T,
  data: unknown,
  shouldThrow?: boolean
): Static<T> | null {
  if (Value.Check(type, data)) {
    return data;
  } else {
    if (shouldThrow || shouldThrow === undefined) {
      console.error(
        "Got invalid data:",
        JSON.stringify([...Value.Errors(type, data)], null, 2)
      );
      throw new Error("Invalid data.");
    } else {
      return null;
    }
  }
}

//defining the building context type so various functions can use building context provider
//contains methods for keeping track of current building/floor/list of rooms
//as well as methods for changing building/floor/updating room status
export type BuildingContextType = {
  building: Building;
  buildingKey: string;
  updateBuilding: (building: Building) => unknown;
  currentFloorKey: string;
  currentFloor: Floor;
  updateFloor: (floorKey: string, floor: Floor) => unknown;
  updateAllFloors: (floors: Floors) => unknown;
  rooms: Rooms;
  updateRoom: (roomKey: string, room: Room) => unknown;
  updateAllRooms: (rooms: Rooms) => unknown;
};

//context provider so various functions
//know what the current building, floor, and set of rooms is
export const BuildingContext = createContext<BuildingContextType>({
  building: { rooms: {}, floors: {} },
  buildingKey: "",
  currentFloorKey: "",
  currentFloor: { noiseReports: [] },
  updateBuilding: () => {},
  updateFloor: () => {},
  updateAllFloors: () => {},
  rooms: {},
  updateRoom: () => {},
  updateAllRooms: () => {},
});
