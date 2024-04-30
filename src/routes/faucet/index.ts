import { FastifyPluginAsync } from "fastify";
import { API_KEY, BASE_URL_V1 } from "../../config";
const faucets: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Route to handle POST requests to create a new drip
  fastify.post<{
    Body: {
      blockchain: string;
      address: string;
      native: number;
      usdc: number;
    };
  }>("/drips", async (request, reply) => {
    try {
      // Extract data from the request body
      const { blockchain, address, native, usdc } = request.body;

      // Send a POST request to the external API to create a new drip
      const response = await fetch(`${BASE_URL_V1}/faucet/drips`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockchain, address, native, usdc }),
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, return the status code
        return response.status;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(`Failed to create drip: ${response.statusText}`);
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error creating drip:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default faucets;
