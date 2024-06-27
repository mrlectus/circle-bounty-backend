import { FastifyPluginAsync } from "fastify";
import { appIDSchema } from "./schema";
import { config } from "../../config";

const lookups: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  // Route to handle GET requests to retrieve app ID
  fastify.get("/appid", appIDSchema, async (_request, reply) => {
    try {
      // Send a GET request to the external API to retrieve the app ID
      const response = await fetch(`${config.BASE_URL}/config/entity`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const appid = await response.json();
        // Return the retrieved app ID
        return appid;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(`Failed to retrieve app ID: ${response.statusText}`);
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving app ID:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default lookups;
