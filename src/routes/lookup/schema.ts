export const appIDSchema = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: { appId: { type: "string" } },
          },
        },
      },
    },
  },
};
