import { FastifyPluginAsync } from "fastify";

const webhook: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.head("/", (request, reply) => {
    console.log(request.headers);
    return reply.status(200);
  });

  fastify.post("/", (request) => {
    return request.body;
  });
};

export default webhook;
