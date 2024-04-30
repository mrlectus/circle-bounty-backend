import { FastifyPluginAsync } from "fastify";
import { Contact } from "./schema";
import { Prisma } from "@prisma/client";

const contacts: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Route to handle POST requests to create a new contact
  fastify.post<{
    Body: Contact; // Define the request body type
  }>("/", async (request, reply) => {
    try {
      // Extract data from the request body
      const { walletAddress, tags, name, userId } = request.body;
      // Split tags string into an array
      const tagsArray = tags.split(",");

      // Try to create a new contact using Prisma
      const contact = await fastify.prisma.contact.create({
        data: {
          walletAddress,
          tags: tagsArray,
          name,
          userId,
        },
        include: {
          User: true,
        },
      });

      // Return the newly created contact
      return contact;
    } catch (error) {
      // Handle errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // If the error is a known Prisma error (e.g., unique constraint violation)
        const duplicateField = (error.meta as { target: string[] }).target[0]; // Get the first field causing the error
        return reply
          .status(400)
          .send({ message: `${duplicateField} already exists` }); // Return a 400 response with error message
      } else {
        // If the error is not a known Prisma error
        console.error("Error creating contact:", error); // Log the error for debugging
        return reply.status(500).send({ message: "Internal server error" }); // Return a generic error message
      }
    }
  });

  // Route to handle GET requests to retrieve contacts by userId
  fastify.get<{
    Params: { userId: string }; // Define the parameter type
  }>("/:userId", async (request, reply) => {
    try {
      // Extract userId from request parameters
      const { userId } = request.params;

      // Find contacts associated with the userId
      const contacts = await fastify.prisma.contact.findMany({
        where: {
          userId: Number(userId), // Convert userId to number
        },
      });

      // Check if contacts were found
      if (contacts.length > 0) {
        // Return found contacts
        return contacts;
      } else {
        // If no contacts were found, return a 404 response
        return reply.status(404).send({ message: "No contacts found" });
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving contacts:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle DELETE requests to delete a contact by contactId
  fastify.delete<{
    Body: { userId: number }; // Define the body parameter type
    Params: { contactId: number }; // Define the parameter type
  }>("/:contactId", async (request, reply) => {
    try {
      // Extract userId from request body and contactId from request parameters
      const { userId } = request.body;
      const { contactId } = request.params;

      // Find the user associated with the userId
      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
      });

      // Check if user exists
      if (user) {
        // If user exists, delete the contact associated with the contactId
        const update = await fastify.prisma.user.update({
          where: { id: userId },
          data: {
            contacts: {
              delete: { id: Number(contactId) }, // Convert contactId to number
            },
          },
        });
        // Return the updated user data
        return update;
      } else {
        // If user does not exist, return a 404 response
        return reply.status(404).send({ message: "User not found" });
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error deleting contact:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};
export default contacts;
