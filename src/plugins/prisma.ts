import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import fastifyPrisma from "@joggr/fastify-prisma";

export default fp(async (fastify) => {
  await fastify.register(fastifyPrisma, {
    client: new PrismaClient(),
    clientConfig: {
      log: [{ emit: "event", level: "query" }],
    },
  });
});
