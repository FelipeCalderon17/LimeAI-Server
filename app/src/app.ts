import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ErrorHandler } from "@entry-point/middleware/ErrorHandler";
import { LimeAIRoutes } from "@config/LimeAIRoutes";
dotenv.config();
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(LimeAIRoutes.routes);
app.use(ErrorHandler);

export default app;
