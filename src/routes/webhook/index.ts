import { FastifyPluginAsync } from "fastify";

const webhook: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.head("/", (request, reply) => {
    console.log("circle-head", request.headers);
    return reply.status(200);
  });

  fastify.post("/", (request, reply) => {
    fastify.websocketServer.clients.forEach((client) => {
      client.send(JSON.stringify(request.body));
    });
    return reply.status(200);
  });

  fastify.get("/", { websocket: true }, (socket, req) => {
    socket.on("message", (message) => {
      // message.toString() === 'hi from client'
      console.log("body", req.body);
      console.log("message", message);
      socket.send(message);
    });
  });
};

export default webhook;
