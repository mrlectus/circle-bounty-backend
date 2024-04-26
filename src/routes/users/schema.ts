import { Static, Type } from "@sinclair/typebox";
//"ETH-SEPOLIA", "MATIC-AMOY"
export const Blockchain = Type.Object({
  blockchains: Type.Union([
    Type.String({
      format: "ETH-SEPOLIA",
    }),
    Type.String({
      format: "MATIC-AMOY",
    }),
  ]),
});

export type BlockchainType = Static<typeof Blockchain>;

export type User = {
  username: string;
  password: string;
  email: string;
};

export type Transfer = {
  token: string;
  userId: string;
  destinationAddress: string;
  amounts: string;
  walletId: string;
  tokenId: string;
};

export const userBody = {
  type: "object",
  properties: {
    userId: { type: "string" },
  },
  required: ["userId"],
};

export const tokenSchema = {
  schema: {
    body: userBody,
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              encryptionKey: { type: "string" },
              userToken: { type: "string" },
            },
          },
        },
      },
    },
  },
};

export const initSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        token: { type: "string" },
        blockchains: { type: "string" },
      },
      required: ["token", "blockchains"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              challengeId: { type: "string" },
            },
          },
        },
      },
    },
  },
};
