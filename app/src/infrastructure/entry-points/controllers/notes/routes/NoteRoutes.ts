import "reflect-metadata";
import { Router, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { GetNotesUseCase } from "@use-case/note/GetNotesUseCase";
import { HttpStatusCode } from "@entry-point/controllers/HttpStatusCodes";
import { GetNoteByIdUseCase } from "@use-case/note/GetNoteByIdUseCase";
import { validateDtoMiddleware } from "@entry-point/middleware/RequestValidator";
import { NotesDTO } from "./dto/NotesDTO";
import { NoteMapper } from "./mappers/NoteMapper";
import { CreateNoteUseCase } from "@use-case/note/CreateNoteUseCase";

const router = Router();
const getNotesUseCase = container.resolve<GetNotesUseCase>("GetNotesUseCase");
const getNoteByIdUseCase =
  container.resolve<GetNoteByIdUseCase>("GetNoteByIdUseCase");
const createNoteUseCase =
  container.resolve<CreateNoteUseCase>("CreateNoteUseCase");

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

router.post(
  "/notes",
  validateDtoMiddleware(NotesDTO),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notesDto = req.body as NotesDTO;
      const note = NoteMapper.transformToNote(notesDto);
      await createNoteUseCase.execute(note);
      res.status(HttpStatusCode.CREATED).end();
    } catch (error) {
      next(error);
    }
  }
);
export default router;
