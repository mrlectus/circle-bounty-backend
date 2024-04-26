import { FastifyPluginAsync } from "fastify";
import { API_KEY, BASE_URL } from "../../config";
import { appIDSchema } from "./schema";

const lookups: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/appid", appIDSchema, async () => {
    const response = await fetch(`${BASE_URL}/config/entity`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const appid = await response.json();
    return appid;
  });
};

export default lookups;
