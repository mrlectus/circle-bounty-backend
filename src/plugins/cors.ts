import fp from "fastify-plugin";
import cors from "@fastify/cors";

// plugin for cors
export default fp(async (fastify) => {
  await fastify.register(cors, {
    // put your options here
  });
});
