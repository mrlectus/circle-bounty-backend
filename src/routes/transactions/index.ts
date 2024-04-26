import { FastifyPluginAsync } from "fastify";
import { Transfer } from "../users/schema";
import { API_KEY, BASE_URL } from "../../config";
import crypto from "crypto";

const transactions: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{
    Body: Transfer;
  }>("/transfer", async (request) => {
    const { token, userId, destinationAddress, amounts, tokenId, walletId } =
      request.body;
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
        amounts,
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
