import app from "../src/app.js";
import request from "supertest";
import { test, expect } from "vitest";
import { Value } from "@sinclair/typebox/value";
import { Static, TSchema } from "@sinclair/typebox";
import {
  BuildingDef,
  FloorDef,
  RoomDef,
  RoomStatusEnum,
} from "../src/types.js";
import { Response } from "superagent";

function validateType<T extends TSchema>(type: T, data: unknown): Static<T> {
  if (Value.Check(type, data)) {
    return data;
  } else {
    const errors = [...Value.Errors(type, data)];
    throw new Error("Invalid response: " + JSON.stringify(errors, null, 2));
  }
}

function goodResponse<T extends TSchema>(val: Response, type: T): Static<T> {
  expect(val.statusCode).to.equal(200);
  expect(val.headers["content-type"]).to.contain("application/json");
  return validateType(type, val.body);
}

test("GET /api/folsomLibrary gives us building", async () => {
  const val = await request(app).get("/api/folsomLibrary");
  const building = goodResponse(val, BuildingDef);
  expect(building.floors).to.have.keys("3", "4");
  expect(building.rooms).to.include.keys("323-A");
});

test("Repporting room as empty results in empty room", async () => {
  const beginningTimestamp = Date.now();
  const val = await request(app).post("/api/folsom/reportAsEmpty/323-A");
  const floor = goodResponse(val, RoomDef);
  expect(floor.status).to.equal(RoomStatusEnum.Empty);
  expect(floor.lastReported).to.be.a("number");
  expect(floor.lastReported).to.be.greaterThan(beginningTimestamp);
  expect(floor.claimedUntil).to.be.undefined;
});

test("Repporting room as full results in full room", async () => {
  const beginningTimestamp = Date.now();
  const val = await request(app).post("/api/folsom/reportAsFull/323-A");
  const floor = goodResponse(val, RoomDef);
  expect(floor.status).to.equal(RoomStatusEnum.Full);
  expect(floor.lastReported).to.be.a("number");
  expect(floor.lastReported).to.be.greaterThan(beginningTimestamp);
  expect(floor.claimedUntil).to.be.undefined;
});

test("Reporting room as personal use for 1 minute results in personal use room", async () => {
  const beginningTimestamp = Date.now();
  const val = await request(app).post("/api/folsom/reportAsPersonalUse/323-A/1");
  const floor = goodResponse(val, RoomDef);
  expect(floor.status).to.equal(RoomStatusEnum.PersonalUse);
  expect(floor.lastReported).to.be.a("number");
  expect(floor.lastReported).to.be.greaterThan(beginningTimestamp);
  expect(floor.claimedUntil).to.be.a("number");
  expect(floor.claimedUntil).to.be.equal(floor.lastReported + 60 * 1000);
});
