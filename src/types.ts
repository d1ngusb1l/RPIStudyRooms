import { TSchema, Type, type Static } from '@sinclair/typebox';
import { Value, ValueError } from '@sinclair/typebox/value';
import { Request, Response } from 'express';

export function validateRequestBody<T extends TSchema, ResBody>(type: T, req: Request, res: Response<ResBody | ValueError[]>): Static<T> | null {
    const body = req.body;
    if (Value.Check(type, body)) {
      return body;
    } else {
      res.status(400).json([...Value.Errors(type, body)]);
      return null;
    }
}