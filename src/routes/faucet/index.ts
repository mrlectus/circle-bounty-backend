import { FastifyPluginAsync } from "fastify";
import { API_KEY, BASE_URL_V1 } from "../../config";
const faucets: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{
    Body: {
      blockchain: string;
      address: string;
      native: number;
      usdc: number;
    };
  }>("/drips", async (request) => {
    const { blockchain, address, native, usdc } = request.body;
    const response = await fetch(`${BASE_URL_V1}/faucet/drips`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blockchain, address, native, usdc }),
    });
    return response.status;
  });
};

export default faucets;
