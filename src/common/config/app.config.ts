import dotenv from "dotenv";
dotenv.config();

export const AppConfig = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "24h",
  },
  midtrans: {
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
  },
}; 