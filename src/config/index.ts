import crypto from "crypto";
export const API_KEY = process.env.CIRCLE_API_KEY;
export const APP_ID = process.env.CIRCLE_APP_ID;
export const BASE_URL = process.env.BASE_URL;
export const BASE_URL_V1 = process.env.BASE_URL_V1;
export const idempotencyKey = crypto.randomUUID();
