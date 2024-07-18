import { TSchema, Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { createContext } from "react";

export const NoiseReportDef = Type.Object({
  timeReported: Type.Number(),
  noiseLevel: Type.Number(),
});
export type NoiseReport = Static<typeof NoiseReportDef>;

export enum RoomStatusEnum {
  Empty = "empty",
  Full = "full",
}

export const RoomDef = Type.Object({
  status: Type.Enum(RoomStatusEnum),
  lastReported: Type.Number(),
});
export const RoomsDef = Type.Record(Type.String(), RoomDef);
export type Room = Static<typeof RoomDef>;
export type Rooms = Record<string, Room>;

export const FloorDef = Type.Object({
  number: Type.String(),
  noiseReports: Type.Array(NoiseReportDef),
  rooms: Type.Array(Type.String()),
});
export type Floor = Static<typeof FloorDef>;
export const FloorsDef = Type.Record(Type.String(), FloorDef);
export type Floors = Static<typeof FloorsDef>;

export const BuildingDef = Type.Object({
  name: Type.String(),
  floors: Type.Array(Type.String()),
  rooms: Type.Array(Type.String()),
});
export type Building = Static<typeof BuildingDef>;

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
    if (shouldThrow) {
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
