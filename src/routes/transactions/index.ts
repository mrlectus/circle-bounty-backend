import { FastifyPluginAsync } from "fastify";
import { Transfer } from "../users/schema";
import crypto from "crypto";
import { config } from "../../config";

const transactions: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Route to handle GET requests to retrieve transactions
  fastify.get("/", async (request, reply) => {
    try {
      // Extract the user token from request headers
      const token = request.headers["x-user-token"];

      // Send a GET request to the external API to retrieve transactions
      const response = await fetch(`${config.BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${config.API_KEY}`,
          "Content-Type": "application/json",
          "X-User-Token": `${token}`, // Include user token in request headers
        },
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const transactions = await response.json();
        // Return the retrieved transactions
        return transactions;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(
          `Failed to retrieve transactions: ${response.statusText}`
        );
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving transactions:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle POST requests for transfers
  fastify.post<{
    Body: Transfer; // Define the request body type
  }>("/transfer", async (request, reply) => {
    try {
      // Extract data from the request body
      const { userId, destinationAddress, amounts, tokenId, walletId } =
        request.body;

      // Extract user token from request headers
      const token = request.headers["x-user-token"];

      // Send a POST request to the external API for transfer
      const response = await fetch(
        `${config.BASE_URL}/user/transactions/transfer`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.API_KEY}`,
            "Content-Type": "application/json",
            "X-User-Token": `${token}`, // Include user token in request headers
          },
          body: JSON.stringify({
            idempotencyKey: crypto.randomUUID(), // Generate idempotency key
            userId,
            destinationAddress,
            refId: crypto.randomUUID(), // Generate reference ID
            amounts: [amounts], // Wrap amounts in an array
            feeLevel: "HIGH",
            tokenId,
            walletId,
          }),
        }
      );

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const transfer = await response.json();
        // Return the transfer details
        return transfer;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(`Failed to transfer: ${response.statusText}`);
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error transferring:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default transactions;
