import { Static, Type } from "@sinclair/typebox";
import crypto from "crypto";
import envSchema from "env-schema";
export const idempotencyKey = crypto.randomUUID();

const schema = Type.Object({
  API_KEY: Type.String(),
  APP_ID: Type.String(),
  BASE_URL: Type.String(),
  BASE_URL_V1: Type.String(),
});

type Schema = Static<typeof schema>;

export const config = envSchema<Schema>({
  schema: schema,
  dotenv: true,
});
