import { FastifyPluginAsync } from "fastify";

const webhook: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.head("/", (_request, reply) => {
    return reply.status(200);
  });

  fastify.post("/", (request) => {
    return request.body;
  });
};

export default webhook;
