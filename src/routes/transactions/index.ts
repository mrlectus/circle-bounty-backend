import { FastifyPluginAsync } from "fastify";
import { Transfer } from "../users/schema";
import { API_KEY, BASE_URL } from "../../config";
import crypto from "crypto";

const transactions: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", async (request) => {
    const token = request.headers["x-user-token"];
    const response = await fetch(`${BASE_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-User-Token": `${token}`,
      },
    });
    const transactions = await response.json();
    return transactions;
  });

  fastify.post<{
    Body: Transfer;
  }>("/transfer", async (request) => {
    const { userId, destinationAddress, amounts, tokenId, walletId } =
      request.body;
    const token = request.headers["x-user-token"];
    const response = await fetch(`${BASE_URL}/user/transactions/transfer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-User-Token": `${token}`,
      },
      body: JSON.stringify({
        idempotencyKey: crypto.randomUUID(),
        userId,
        destinationAddress,
        refId: crypto.randomUUID(),
        amounts: [amounts],
        feeLevel: "HIGH",
        tokenId,
        walletId,
      }),
    });
    const transfer = await response.json();
    return transfer;
  });
};

export default transactions;
