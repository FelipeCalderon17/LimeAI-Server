import "reflect-metadata";
import { Router, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { GetPatientsUseCase } from "@use-case/patient/GetPatientsUseCase";
import { HttpStatusCode } from "@entry-point/controllers/HttpStatusCodes";

const router = Router();
const getPatientsUseCase =
  container.resolve<GetPatientsUseCase>("GetPatientsUseCase");

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
