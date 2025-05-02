import { createServer } from "./server";

// Create a Hapi server instance
const initServer = async () => {
  const server = await createServer();

  // Prepare the server but don't start it (Vercel will handle that)
  await server.initialize();

  return server;
};

// Initialize the server for Vercel serverless deployment
const server = initServer();

// Export handler for Vercel serverless functions
export default async (req: any, res: any) => {
  const hapiServer = await server;

  // Create a completion handler
  const onResponse = (err: Error) => {
    if (err) {
      console.error("Response error:", err);
    }
  };

  // Pass the request to Hapi and let it handle the response
  await hapiServer
    .inject({
      method: req.method,
      url: req.url,
      payload: req.body,
      headers: req.headers,
      validate: false,
      remoteAddress: req.connection.remoteAddress,
    })
    .then((response) => {
      // Set status code
      res.statusCode = response.statusCode;

      // Set headers
      const headers = response.headers;
      for (const header in headers) {
        res.setHeader(header, headers[header]);
      }

      // Send response
      res.end(response.payload, onResponse);
    })
    .catch((err) => {
      console.error("Server injection error:", err);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          status: false,
          message: "Internal Server Error",
          error: {
            code: "INTERNAL_SERVER_ERROR",
            details:
              process.env.NODE_ENV === "production" ? undefined : err.message,
          },
        }),
        onResponse
      );
    });
};
