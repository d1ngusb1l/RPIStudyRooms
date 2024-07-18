import { TSchema, Type, type Static } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'

export const RoomDef = Type.Object({
  number: Type.String(),
  status: Type.String(),
  lastReported: Type.String()
})
export type Room = Static<typeof RoomDef>

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