import { FastifyPluginAsync } from "fastify";
import { Contact } from "./schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
const contacts: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{
    Body: Contact;
  }>("/", async (request, reply) => {
    const { walletAddress, tags, name, userId } = request.body;
    const tagsArray = tags.split(",");
    try {
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
      return contact;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const e = error?.meta?.target as Array<string>;
        return reply.status(400).send({ message: `${e[0]} already exist` });
      } else {
        return Response.json({ message: "Cannot create contact" });
      }
    }
  });

  fastify.get<{
    Params: { userId: string };
  }>("/:userId", async (request) => {
    const { userId } = request.params;
    const contact = await fastify.prisma.contact.findMany({
      where: {
        userId: Number(userId),
      },
    });
    if (contact) {
      return contact;
    } else {
      return Response.json(
        { message: "No contact found" },
        {
          status: 404,
        }
      );
    }
  });

  fastify.delete<{
    Body: { userId: number };
    Params: { contactId: number };
  }>("/:contactId", async (request, reply) => {
    const { userId } = request.body;
    const { contactId } = request.params;
    console.log(userId, contactId);
    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      const update = await fastify.prisma.user.update({
        where: { id: userId },
        data: {
          contacts: {
            delete: { id: Number(contactId) },
          },
        },
      });
      return update;
    } else {
      reply.status(404).send({ message: "User not found" });
    }
  });
};
export default contacts;
