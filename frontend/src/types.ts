import { TSchema, Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { createContext } from "react";

export enum RoomStatusEnum {
  Empty = "empty",
  Full = "full",
  PersonalUse = "In Use by a RPI Study Rooms User",
  Closed = "closed",
}

export const RoomDef = Type.Object({
  status: Type.Enum(RoomStatusEnum),
  lastReported: Type.Number(),
  claimedUntil: Type.Optional(Type.Number()),
});
export type Room = Static<typeof RoomDef>;
export const RoomsDef = Type.Record(Type.String(), RoomDef);
export type Rooms = Record<string, Room>;

export const NoiseReportDef = Type.Object({
  timeReported: Type.Number(),
  noiseLevel: Type.Number(),
});
export type NoiseReport = Static<typeof NoiseReportDef>;

export const FloorDef = Type.Object({
  noiseReports: Type.Array(NoiseReportDef),
});
export type Floor = Static<typeof FloorDef>;
export const FloorsDef = Type.Record(Type.String(), FloorDef);
export type Floors = Record<string, Floor>;

export const BuildingDef = Type.Object({
  rooms: RoomsDef,
  floors: Type.Record(Type.String(), FloorDef),
});
export type Building = Static<typeof BuildingDef>;
export const BuildingsDef = Type.Record(Type.String(), BuildingDef);
export type Buildings = Record<string, Building>

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

export const RoomContext = createContext<{
  rooms: Rooms;
  update: (rooms: Rooms) => unknown;
}>({ rooms: {}, update: () => {} });

export const FloorsContext = createContext<{
  floors: Floors;
  updateFloor: (floorNum: string, floor: Floor) => unknown;
  updateAllFloors: (floors: Floors) => unknown;
}>({
  floors: {},
  updateFloor: () => {},
  updateAllFloors: () => {},
});

//will eventually replace the need for a floor or rooms context as everything can be accessed through the building
/*
export const BuidlingContext = createContext<{
  rooms: Rooms;
  update: (rooms: Rooms) => unknown;
}>({ rooms: {}, update: () => {} });
 */
