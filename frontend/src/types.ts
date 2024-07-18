import { TSchema, Type, type Static } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'

export const NoiseReportDef = Type.Object({
  timeReported: Type.Number(),
  noiseLevel: Type.Number(),
})
export type NoiseReport = Static<typeof NoiseReportDef>

export const RoomDef = Type.Object({
  number: Type.String(),
  status: Type.String(),
  lastReported: Type.String()
})
export type Room = Static<typeof RoomDef>

export const FloorDef = Type.Object({
  number: Type.String(),
  noiseReports: Type.Array(NoiseReportDef),
  rooms: Type.Array(Type.String())
})
export type Floor = Static<typeof FloorDef>

export const BuildingDef = Type.Object({
  name: Type.String(),
  floors: Type.Array(Type.String()),
  rooms: Type.Array(Type.String())
})
export type Building = Static<typeof BuildingDef>


export function validateType<T extends TSchema>(type: T, data: unknown): Static<T> {
  if (Value.Check(type, data)) {
    return data;
  } else {
    console.error("Got invalid data:", JSON.stringify(
      [...Value.Errors(type, data)], null, 2
    ))
    throw new Error("Invalid data.");
  }
}