import { FastifyPluginAsync } from "fastify";

const webhook: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.head("/", (request, reply) => {
    console.log(request.headers);
    return reply.status(200);
  });

  fastify.post("/", { websocket: true }, (socket, req) => {
    socket.on("message", (_message) => {
      // message.toString() === 'hi from client'
      console.log(req.body);
      socket.send("hi from server");
    });
  });
};

export default webhook;
