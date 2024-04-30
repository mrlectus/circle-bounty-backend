import { FastifyPluginAsync } from "fastify";
import { API_KEY, BASE_URL } from "../../config";
import { Balance, Wallets } from "./schema";

const wallets: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Route to handle GET requests for a specific wallet
  fastify.get<{
    Params: { walletId: string }; // Define the route parameter type
  }>("/:walletId", async (request, reply) => {
    try {
      // Extract walletId from route parameters
      const { walletId } = request.params;

      // Send a GET request to the external API to retrieve wallet status
      const response = await fetch(`${BASE_URL}/wallets/${walletId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const status = await response.json();
        // Return the wallet status
        return status;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(
          `Failed to retrieve wallet status: ${response.statusText}`
        );
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving wallet status:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle GET requests for wallets
  fastify.get<{
    Headers: {
      "X-User-Token": string; // Define the request headers type
    };
  }>("/", async (request, reply) => {
    try {
      // Extract token from request headers
      const token = request.headers["x-user-token"];

      // Send a GET request to the external API to retrieve wallets
      const response = await fetch(`${BASE_URL}/wallets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "X-User-Token": `${token}`, // Include token in request headers
        },
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const wallets = await response.json();
        // Return the wallets
        return wallets as Wallets;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(`Failed to retrieve wallets: ${response.statusText}`);
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving wallets:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle GET requests for wallet balances
  fastify.get<{
    Params: { walletid: string }; // Define the route parameter type
    Headers: {
      "X-User-Token": string; // Define the request headers type
    };
  }>("/:walletid/balances", async (request, reply) => {
    try {
      // Extract walletid from route parameters
      const { walletid } = request.params;

      // Extract token from request headers
      const token = request.headers["x-user-token"];

      // Send a GET request to the external API to retrieve wallet balances
      const response = await fetch(`${BASE_URL}/wallets/${walletid}/balances`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "X-User-Token": `${token}`, // Include token in request headers
        },
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const balance = await response.json();
        // Return the balance
        return balance as Balance;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(
          `Failed to retrieve wallet balances: ${response.statusText}`
        );
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving wallet balances:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle GET requests for wallet NFTs
  fastify.get<{
    Params: { walletid: string }; // Define the route parameter type
    Headers: {
      "X-User-Token": string; // Define the request headers type
    };
  }>("/:walletid/nfts", async (request, reply) => {
    try {
      // Extract walletid from route parameters
      const { walletid } = request.params;

      // Extract token from request headers
      const token = request.headers["x-user-token"];

      // Send a GET request to the external API to retrieve wallet NFTs
      const response = await fetch(`${BASE_URL}/wallets/${walletid}/nfts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "X-User-Token": `${token}`, // Include token in request headers
        },
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const nfts = await response.json();
        // Return the NFTs
        return nfts as Balance;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(
          `Failed to retrieve wallet NFTs: ${response.statusText}`
        );
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving wallet NFTs:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default wallets;
