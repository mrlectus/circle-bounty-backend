import { FastifyPluginAsync } from "fastify";

const webhook: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.head("/", (request, reply) => {
    console.log("circle-head", request.headers);
    return reply.status(200);
  });

  fastify.post("/", (request) => {
    console.log("circle-body", request.body);
    return request.body;
  });

  fastify.get("/", { websocket: true }, (socket, req) => {
    socket.on("message", (_message) => {
      // message.toString() === 'hi from client'
      console.log(req.body);
      socket.send("hi from server");
    });
  });
};

export default webhook;
