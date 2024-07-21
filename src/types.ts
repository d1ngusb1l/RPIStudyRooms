import { TSchema, Type, type Static } from '@sinclair/typebox';
import { Value, ValueError as OriginalValueError, ValueErrorType } from '@sinclair/typebox/value';
import { Request, Response } from 'express';

// type ValueError = Omit<OriginalValueError, "schema">;

const ValueErrorDef = Type.Object({
  type: Type.Enum(ValueErrorType),
    path: Type.String(),
    value: Type.Unknown(),
    message: Type.String()
});


const ErrorTypeDef = Type.Union([
  Type.Object({
    status: Type.Literal(400),
    message: Type.Literal("Invalid request body."),
    data: Type.Array(ValueErrorDef)
  }),
  Type.Object({
    status: Type.Number(),
    message: Type.String()
  })
]);

export type ErrorType = Static<typeof ErrorTypeDef>;

export function validateRequestBody<T extends TSchema, ResBody>(type: T, req: Request, res: Response<ResBody | ErrorType>): Static<T> | null {
    const body = req.body;
    if (Value.Check(type, body)) {
      return body;
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid request body.",
        data: [...Value.Errors(type, body)]
      });
      return null;
    }
}

export enum RoomStatusEnum {
  Empty = "empty",
  Full = "full",
  PersonalUse = "personalUse",
}

export const RoomDef = Type.Object({
  status: Type.Enum(RoomStatusEnum),
  lastReported: Type.Number()
})
export type Room = Static<typeof RoomDef>
export type Rooms = Record<string, Room>

export const NoiseReportDef = Type.Object({
  timeReported: Type.Number(),
  noiseLevel: Type.Number(),
})
export type NoiseReport = Static<typeof NoiseReportDef>

export const FloorDef = Type.Object({
  floorNum: Type.Number(),
  noiseReports: Type.Array(NoiseReportDef),
  rooms: Type.Array(Type.String())
})
export type Floor = Static<typeof FloorDef>
export type Floors = Record<string, Floor>

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