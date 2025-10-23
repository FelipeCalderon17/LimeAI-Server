import "reflect-metadata";
import { Router, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { GetNotesUseCase } from "@use-case/note/GetNotesUseCase";
import { HttpStatusCode } from "@entry-point/controllers/HttpStatusCodes";
import { GetNoteByIdUseCase } from "@use-case/note/GetNoteByIdUseCase";
import { NotesDTO } from "./dto/NotesDTO";
import { NoteMapper } from "./mappers/NoteMapper";
import { CreateNoteUseCase } from "@use-case/note/CreateNoteUseCase";
import { uploadAudio } from "@entry-point/middleware/s3Upload";
import { Note } from "@model/note/Note";
import { validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";

const router = Router();
const getNotesUseCase = container.resolve<GetNotesUseCase>("GetNotesUseCase");
const getNoteByIdUseCase =
  container.resolve<GetNoteByIdUseCase>("GetNoteByIdUseCase");
const createNoteUseCase =
  container.resolve<CreateNoteUseCase>("CreateNoteUseCase");

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Note]
 *     description: Retrieve all clinical notes stored in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *             example:
 *               - id: 9a3076a4-e33a-4986-9a06-32e65d42c4df
 *                 createdAt: "2025-10-23T22:15:00.608Z"
 *                 patientId: "cfd07d0e-39b2-4d8b-b616-8e3cd1fb72d3"
 *                 rawNote: "dscsacsd"
 *                 processedNote: ". Summarize the following clinical interaction concisely: “I’m a doctor, I’ve got a job to do.” “What’s your job?’ “How do I do it?” “What do you do?“”"
 *                 patientName: "Sadie Adler"
 *                 patientDateOfBirth: "1992-11-01T00:00:00.000Z"
 *               - id: 582197dd-b53a-4b3d-b2d1-225d7d6d0ce2
 *                 createdAt: "2025-10-23T20:12:21.470Z"
 *                 patientId: "63e751f2-78a7-4575-905b-d5b3c534f122"
 *                 rawNote: "El paciente reporta dolor de cabeza y fiebre leve."
 *                 processedNote: "S: Paciente con cefalea y febrícula.\nO: T 37.5°C.\nA: Posible infección viral.\nP: Reposo e hidratación. Reevaluar en 48h."
 *                 patientName: "Arturo Morgan"
 *                 patientDateOfBirth: "1985-05-15T00:00:00.000Z"
 *       500:
 *         description: Oops... Something happened, try again.
 */
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
/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Note]
 *     description: Retrieve a single clinical note by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the note to retrieve.
 *         schema:
 *           type: string
 *           example: 3384ff2f-3314-46a5-ad6f-30c31c8dcfaf
 *     responses:
 *       200:
 *         description: Successfully retrieved the note.
 *         content:
 *           application/json:
 *             schema:
 *             example:
 *               id: "3384ff2f-3314-46a5-ad6f-30c31c8dcfaf"
 *               createdAt: "2025-10-23T22:05:27.638Z"
 *               patientId: "cfd07d0e-39b2-4d8b-b616-8e3cd1fb72d3"
 *               rawNote: "fyfjyfyjf"
 *               processedNote: "Interaction: fyfjyfyjf encompasses the following clinical interaction. Summarize the following Clinical interaction concisely: FyfJyfyJf. FyFyJf: The clinical interaction between a patient and a doctor. FYJyF: The patient and the doctor interact in a clinical setting."
 *               patientName: "Sadie Adler"
 *               patientDateOfBirth: "1992-11-01T00:00:00.000Z"
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Note with id 3384ff2f-3314-46a5-ad6f-30c31c8dcfaf not found."
 *       500:
 *         description: Oops... Something happened, try again.
 */
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
/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note (from text or audio)
 *     description: |
 *       Creates a new clinical note for a patient.
 *       The note can be provided as plain text (`rawNote`) **or** as an uploaded audio file (`file`).
 *       If an audio file is provided, it will be processed automatically and linked to the corresponding patient.
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - rawNote
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 63e751f2-78a7-4575-905b-d5b3c534f122
 *               rawNote:
 *                 type: string
 *                 example: El paciente reporta dolor de cabeza y fiebre leve. Ha estado en contacto con una persona enferma.
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - file
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 63e751f2-78a7-4575-905b-d5b3c534f122
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Note successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 90670f87-6b69-4644-a6f9-fd9ff720e576
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-23T22:59:59.635Z
 *                 patientId:
 *                   type: string
 *                   example: 63e751f2-78a7-4575-905b-d5b3c534f122
 *                 rawNote:
 *                   type: string
 *                   example: El paciente reporta dolor de cabeza y fiebre leve. Ha estado en contacto con una persona enferma.
 *                 processedNote:
 *                   type: string
 *                   example: Interaction:El paciente reporta dolor de cabeza and fiebre leve. Ha estado en contacto with una persona enferma.
 *                 patientName:
 *                   type: string
 *                   example: Arturo Morgan
 *                 patientDateOfBirth:
 *                   type: string
 *                   format: date
 *                   example: 1985-05-15T00:00:00.000Z
 *       400:
 *         description: Invalid request body (missing patientId or rawNote)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No data provided.
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Patient with id 63e751f2-78a7-4575-905b-d5b3c534f122 not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Oops... Something happened, try again.
 */
router.post(
  "/notes",
  uploadAudio,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let newNote: Note;
      if (req.file) {
        const audioFile = req.file as Express.MulterS3.File;
        const patientId = req.body.patientId;
        if (
          !patientId ||
          typeof patientId !== "string" ||
          patientId.trim() === ""
        ) {
          return res.status(HttpStatusCode.BAD_REQUEST).json({
            error: "No data provided.",
          });
        }
        const s3Url = audioFile.location;
        newNote = await createNoteUseCase.executeWithAudio(patientId, s3Url);
      } else {
        const notesDto = plainToInstance(NotesDTO, req.body);
        const errors = validateSync(notesDto, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
        if (errors.length > 0) {
          const msgs = errors
            .flatMap((e) => Object.values(e.constraints || {}))
            .join(", ");
          return res.status(HttpStatusCode.BAD_REQUEST).json({ message: msgs });
        }
        const note = NoteMapper.transformToNote(notesDto);
        newNote = await createNoteUseCase.execute(note);
      }
      res.status(HttpStatusCode.CREATED).json(newNote);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
