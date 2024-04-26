import { FastifyPluginAsync } from "fastify";
import { API_KEY, BASE_URL } from "../../config";
import { Balance, Wallets } from "./schema";

const wallets: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get<{
    Params: { walletId: string };
  }>("/:walletId", async (request) => {
    const { walletId } = request.params;
    const response = await fetch(`${BASE_URL}/wallets/${walletId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const status = await response.json();
    return status;
  });

  fastify.get<{
    Headers: {
      "X-User-Token": string;
    };
  }>("/", async (request) => {
    const token = request.headers["x-user-token"];
    const response = await fetch(`${BASE_URL}/wallets`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-User-Token": `${token}`,
      },
    });
    const wallets = await response.json();
    return wallets as Wallets;
  });

  fastify.get<{
    Params: { walletid: string };
    Headers: {
      "X-User-Token": string;
    };
  }>("/:walletid/balances", async (request) => {
    const { walletid } = request.params;
    const token = request.headers["x-user-token"];
    const response = await fetch(`${BASE_URL}/wallets/${walletid}/balances`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-User-Token": `${token}`,
      },
    });
    const balance = await response.json();
    return balance as Balance;
  });

  fastify.get<{
    Params: { walletid: string };
    Headers: {
      "X-User-Token": string;
    };
  }>("/:walletid/nfts", async (request) => {
    const { walletid } = request.params;
    const token = request.headers["x-user-token"];
    const response = await fetch(`${BASE_URL}/wallets/${walletid}/nfts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-User-Token": `${token}`,
      },
    });
    const nfts = await response.json();
    return nfts as Balance;
  });
};

export default wallets;
