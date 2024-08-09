import { TSchema, Type, type Static } from "@sinclair/typebox";
import {
  Value,
  ValueError as OriginalValueError,
  ValueErrorType,
} from "@sinclair/typebox/value";
import { Request, Response } from "express";

// type ValueError = Omit<OriginalValueError, "schema">;

/* 
  This file holds type definitins for rooms, noise reports, floors, and buildings.
  It also contains type verifiers. almost identical to front end types
*/

//defining a package type for errors
export const ValueErrorDef = Type.Object({
  type: Type.Enum(ValueErrorType),
  path: Type.String(),
  value: Type.Unknown(),
  message: Type.String(),
});

//for printing out error messages when invalid data gets passed
export const ErrorTypeDef = Type.Union([
  Type.Object({
    status: Type.Literal(400),
    message: Type.Literal("Invalid request body."),
    data: Type.Array(ValueErrorDef),
  }),
  Type.Object({
    status: Type.Number(),
    message: Type.String(),
  }),
]);
export type ErrorType = Static<typeof ErrorTypeDef>;

//validating calls made to the api
export function validateRequestBody<T extends TSchema, ResBody>(
  type: T,
  req: Request,
  res: Response<ResBody | ErrorType>
): Static<T> | null {
  const body = req.body;
  if (Value.Check(type, body)) {
    return body;
  } else {
    res.status(400).json({
      status: 400,
      message: "Invalid request body.",
      data: [...Value.Errors(type, body)],
    });
    return null;
  }
}

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

// Makes sure that input passed through is valid for current function
export function validateType<T extends TSchema>(
  type: T,
  data: unknown
): Static<T> {
  if (Value.Check(type, data)) {
    return data;
  } else {
    console.error(
      "Got invalid data:",
      JSON.stringify([...Value.Errors(type, data)], null, 2)
    );
    throw new Error("Invalid data.");
  }
}
