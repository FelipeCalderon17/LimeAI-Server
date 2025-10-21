import "reflect-metadata";
import { Router } from "express";
import patientRoutes from "@entry-point/controllers/patient/routes/PatientRoutes";
import noteRoutes from "@entry-point/controllers/notes/routes/NoteRoutes";

export class LimeAIRoutes {
  static get routes(): Router {
    const router = Router();
    router.use(patientRoutes);
    router.use(noteRoutes);
    return router;
  }
}
