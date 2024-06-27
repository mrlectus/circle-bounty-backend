import { FastifyPluginAsync } from "fastify";
import crypto from "crypto";
import { User, initSchema, tokenSchema } from "./schema";
import { config } from "../../config";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Route to handle POST requests to create a new user
  fastify.post<{
    Body: User; // Define the request body type
  }>("/", async function (request, reply) {
    try {
      // Extract data from the request body
      const { username, email, password } = request.body;

      // Generate a UUID for the new user
      const userFromUUID = crypto.randomUUID();

      // Send a POST request to the external API to create a new user
      const response = await fetch(`${config.BASE_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userFromUUID }), // Include userId in the request body
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, hash the password
        const hashPassword = await fastify.bcrypt.hash(password);

        // Create a new user in the database
        const user = await fastify.prisma.user.create({
          data: {
            email,
            username,
            password: hashPassword,
            userId: userFromUUID,
          },
        });

        // Check if user creation was successful
        if (user) {
          // If successful, remove password from user object and send the user details in the response
          const { password, ...rest } = user;
          reply.status(201).send(rest);
          return;
        } else {
          // If user creation was not successful, reject the promise
          return Promise.reject("Cannot create user.");
        }
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error creating user:", error); // Log the error for debugging
      // Throw an error indicating that user creation failed
      throw new Error("Cannot create user.");
    }
  });

  // Route to handle POST requests to retrieve token for a user
  fastify.post<{ Body: { userId: string } }>(
    "/token",
    tokenSchema,
    async (request, reply) => {
      try {
        // Extract userId from request body
        const { userId } = request.body;

        // Send a POST request to the external API to retrieve token for the user
        const response = await fetch(`${config.BASE_URL}/users/token`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Include userId in the request body
        });

        // Check if the request was successful
        if (response.ok) {
          // If successful, parse the response body as JSON
          const token = await response.json();
          // Return the retrieved token
          return token;
        } else {
          // If unsuccessful, throw an error with the response status
          throw new Error(`Failed to retrieve token: ${response.statusText}`);
        }
      } catch (error: any) {
        // Handle errors
        console.error("Error retrieving token:", error); // Log the error for debugging
        // Return a generic error message with a 500 status code
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );

  // Route to handle POST requests for user initialization
  fastify.post<{
    Body: { token: string; blockchains: string; userId: string }; // Define the request body type
  }>("/init", initSchema, async (request, reply) => {
    try {
      // Extract data from the request body
      const { token, blockchains, userId } = request.body;

      // Send a POST request to the external API for user initialization
      const response = await fetch(`${config.BASE_URL}/user/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.API_KEY}`,
          "Content-Type": "application/json",
          "X-User-Token": `${token}`, // Include token in request headers
        },
        body: JSON.stringify({
          idempotencyKey: userId,
          blockchains: [blockchains], // Wrap blockchains in an array
          accountType: "SCA",
        }),
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const initData = await response.json();
        // Return the initialization data
        return initData;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(`Failed to initialize user: ${response.statusText}`);
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error initializing user:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle GET requests for user status
  fastify.get<{
    Querystring: { token: string }; // Define the query string parameter type
  }>("/status", async (request, reply) => {
    try {
      // Extract token from query string
      const { token } = request.query;

      // Send a GET request to the external API to retrieve user status
      const response = await fetch(`${config.BASE_URL}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.API_KEY}`,
          "Content-Type": "application/json",
          "X-User-Token": `${token}`, // Include token in request headers
        },
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const status = await response.json();
        // Return the user status
        return status;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(
          `Failed to retrieve user status: ${response.statusText}`
        );
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error retrieving user status:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle POST requests for user login
  fastify.post<{
    Body: { email: string; password: string }; // Define the request body type
  }>("/login", async (request, reply) => {
    try {
      // Extract email and password from the request body
      const { email, password } = request.body;

      // Find the user by email in the database
      const user = await fastify.prisma.user.findUnique({
        where: {
          email,
        },
      });

      // If user is not found, return a 404 response
      if (!user) {
        return reply.status(404).send({ message: "User not found!!" });
      } else {
        // If user is found, compare the provided password with the stored password hash
        const passwordMatch = await fastify.bcrypt.compare(
          password,
          user.password
        );

        // If passwords don't match, return a 401 response
        if (!passwordMatch) {
          return reply
            .status(401)
            .send({ message: "Invalid email or password." });
        }

        // If passwords match, return the user
        return user;
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error during login:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Route to handle POST requests to restore PIN
  fastify.post<{
    Headers: { "x-user-token": string }; // Define the request headers type
  }>("/pin/restore", async (request, reply) => {
    try {
      // Extract token from request headers
      const token = request.headers["x-user-token"];

      // Send a POST request to the external API to restore PIN
      const response = await fetch(`${config.BASE_URL}/user/pin/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Token": token, // Include token in request headers
          Authorization: `Bearer ${config.API_KEY}`,
        },
        body: JSON.stringify({
          idempotencyKey: crypto.randomUUID(), // Generate idempotency key
        }),
      });

      // Check if the request was successful
      if (response.ok) {
        // If successful, parse the response body as JSON
        const challenge = await response.json();
        // Return the challenge
        return challenge;
      } else {
        // If unsuccessful, throw an error with the response status
        throw new Error(`Failed to restore PIN: ${response.statusText}`);
      }
    } catch (error: any) {
      // Handle errors
      console.error("Error restoring PIN:", error); // Log the error for debugging
      // Return a generic error message with a 500 status code
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default users;
