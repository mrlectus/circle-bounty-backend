import { FastifyPluginAsync } from "fastify";
import crypto from "crypto";
import { API_KEY, BASE_URL } from "../../config";
import { User, initSchema, tokenSchema } from "./schema";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{
    Body: User;
  }>("/", async function (request, reply) {
    const { username, email, password } = request.body;
    const userFromUUID = crypto.randomUUID();
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userFromUUID }),
      });
      if (response.ok) {
        const hashPassword = await fastify.bcrypt.hash(password);
        const user = await fastify.prisma.user.create({
          data: {
            email,
            username,
            password: hashPassword,
            userId: userFromUUID,
          },
        });
        if (user) {
          const { password, ...rest } = user;
          reply.status(201).send(rest);
          return;
        }
        return Promise.reject("Cannot create user.");
      }
    } catch (error) {
      throw new Error("Cannot create user.");
    }
  });

  fastify.post<{ Body: { userId: string } }>(
    "/token",
    tokenSchema,
    async (request) => {
      const { userId } = request.body;
      const response = await fetch(`${BASE_URL}/users/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const token = await response.json();
      return token;
    }
  );

  fastify.post<{
    Body: { token: string; blockchains: string; userId: string };
  }>("/init", initSchema, async (request) => {
    const { token, blockchains, userId } = request.body;
    console.log(blockchains);
    try {
      const response = await fetch(`${BASE_URL}/user/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "X-User-Token": `${token}`,
        },
        body: JSON.stringify({
          idempotencyKey: userId,
          blockchains: [blockchains],
          accountType: "SCA",
        }),
      });
      const initData = await response.json();
      return initData;
    } catch (error) {
      console.log(error);
      return;
    }
  });

  fastify.get<{
    Querystring: { token: string };
  }>("/status", async (request) => {
    const { token } = request.query;
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-User-Token": `${token}`,
      },
    });
    const status = await response.json();
    return status;
  });

  fastify.post<{
    Body: { email: string; password: string };
  }>("/login", async (request, reply) => {
    const { email, password } = request.body;
    const user = await fastify.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return reply.status(404).send({ message: "User not found!!" });
    } else {
      const passwordMatch = await fastify.bcrypt.compare(
        password,
        user.password
      );
      if (!passwordMatch) {
        return reply
          .status(401)
          .send({ message: "Invalid email or password." });
      }
      return user;
    }
  });

  fastify.post<{
    Headers: { "x-user-token": string };
  }>("/pin/restore", async (request) => {
    const token = request.headers["x-user-token"];
    const response = await fetch(`${BASE_URL}/user/pin/restore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Token": token,
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        idempotencyKey: crypto.randomUUID(),
      }),
    });
    const challenge = await response.json();
    return challenge;
  });
};

export default users;
