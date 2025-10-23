import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ErrorHandler } from "@entry-point/middleware/ErrorHandler";
import { LimeAIRoutes } from "@config/LimeAIRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Scribe Notes API (LimeAI-Server)",
      version: "1.0.0",
      description: "API for technical challenge for LimeAI.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3500}`,
      },
    ],
  },
  apis: [
    "./app/src/infrastructure/entry-points/controllers/notes/routes/*.ts",
    "./app/src/infrastructure/entry-points/controllers/patient/routes/*.ts",
  ],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(LimeAIRoutes.routes);
app.use(ErrorHandler);

export default app;
