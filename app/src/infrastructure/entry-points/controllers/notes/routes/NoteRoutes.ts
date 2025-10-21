import "reflect-metadata";
import { Router, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { GetNotesUseCase } from "@use-case/note/GetNotesUseCase";
import { HttpStatusCode } from "@entry-point/controllers/HttpStatusCodes";
import { GetNoteByIdUseCase } from "@use-case/note/GetNoteByIdUseCase";

const router = Router();
const getNotesUseCase = container.resolve<GetNotesUseCase>("GetNotesUseCase");
const getNoteByIdUseCase =
  container.resolve<GetNoteByIdUseCase>("GetNoteByIdUseCase");

router.get(
  "/notes",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const notes = await getNotesUseCase.execute();
      res.status(HttpStatusCode.OK).json(notes);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/notes/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const notes = await getNoteByIdUseCase.execute(id);
      res.status(HttpStatusCode.OK).json(notes);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
