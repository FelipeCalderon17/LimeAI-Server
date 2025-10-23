import "reflect-metadata";
import { Router, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { GetPatientsUseCase } from "@use-case/patient/GetPatientsUseCase";
import { HttpStatusCode } from "@entry-point/controllers/HttpStatusCodes";

const router = Router();
const getPatientsUseCase =
  container.resolve<GetPatientsUseCase>("GetPatientsUseCase");
/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients with their notes
 *     description: Retrieves a list of all patients, each including their associated clinical notes.
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of all patients with their notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 63e751f2-78a7-4575-905b-d5b3c534f122
 *                   name:
 *                     type: string
 *                     example: Arturo Morgan
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: 1985-05-15T00:00:00.000Z
 *                   notes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 582197dd-b53a-4b3d-b2d1-225d7d6d0ce2
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-10-23T20:12:21.470Z
 *                         patientId:
 *                           type: string
 *                           example: 63e751f2-78a7-4575-905b-d5b3c534f122
 *                         rawNote:
 *                           type: string
 *                           example: El paciente reporta dolor de cabeza y fiebre leve.
 *                         processedNote:
 *                           type: string
 *                           example: "S: Paciente con cefalea y febrícula. O: T 37.5°C. A: Posible infección viral. P: Reposo e hidratación. Reevaluar en 48h."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get(
  "/patients",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await getPatientsUseCase.execute();
      res.status(HttpStatusCode.OK).json(patients);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
