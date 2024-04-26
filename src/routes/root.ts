import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Static, Type } from "@sinclair/typebox";

const Ping = Type.Object({
  reply: Type.String({
    format: "email",
  }),
});

type PingType = Static<typeof Ping>;

const root: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.get<{
    Reply: PingType;
  }>("/ping", { schema: { response: { 200: Ping } } }, async function () {
    return { reply: "Pong" };
  });
};

export default root;
