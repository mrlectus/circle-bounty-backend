import { FastifyPluginAsync } from "fastify";

const webhook: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.head("/", (request, reply) => {
    return reply.status(200);
  });

  fastify.post("/", (request, reply) => {
    reply.status(200).send({ message: "connection recieved" });
    fastify.websocketServer.clients.forEach((client) => {
      client.send(JSON.stringify(request.body));
    });
    return reply.status(200);
  });

  fastify.get("/", { websocket: true }, (socket, req) => {
    socket.on("message", (message) => {
      // message.toString() === 'hi from client'
      socket.send(JSON.parse(message.toString()));
    });
  });
};

export default webhook;
