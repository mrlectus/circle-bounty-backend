import { FastifyPluginAsync } from "fastify";

const webhook: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", (request) => {
    return request.body;
  });
};

export default webhook;
