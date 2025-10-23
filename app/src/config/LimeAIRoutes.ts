/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - id
 *         - createdAt
 *         - patientId
 *         - rawNote
 *         - processedNote
 *         - patientName
 *         - patientDateOfBirth
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the note.
 *         createdAt:
 *           type: Date
 *           description: The date of creation.
 *         patientId:
 *           type: string
 *           description: The id of the patient asociated to the note.
 *         rawNote:
 *           type: string
 *           description: The raw text or audio.
 *         processedNote:
 *           type: string
 *           description: The text after being summarized by the ai or the transcript of the audio.
 *         patientName:
 *           type: string
 *           description: The name of the patient asociated to the note.
 *         patientDateOfBirth:
 *           type: Date
 *           description: The DOB of the patient asociated to the note.
 *       example:
 *         id: 123
 *         createdAt: 23/10/2025
 *         patientId: 321
 *         rawNote: https://ai-scribe-audio-uploads-felipe.s3.us-east-2.amazonaws.com/audio-1761255687260-8cd8e1ff06ad5e252e592157774530fb.mp3
 *         processedNote: Patient reports mild headache and fatigue for the past two days. Summarize the following clinical interaction concisely: "I have a headache and I want to go to the hospital" "I've had a headache for two days and I don't know why I'm having a headache." "I'm tired. I'm tired of being tired." "What's wrong with me?"
 *         patientName: Felipe Calderon
 *         patientDateOfBirth: 17/02/2002
 *     Patient:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - dateOfBirth
 *         - notes
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the patient.
 *         name:
 *           type: string
 *           description: The name of the patient.
 *         dateOfBirth:
 *           type: Date
 *           description: The DOB of the patient.
 *         notes:
 *           type: Note
 *           description: The notes asociated to the talent.
 *       example:
 *         id: 123
 *         name: Felipe Calderon
 *         dateOfBirth: 17/02/2002
 *         notes:
 *           -id: 123
 *           -createdAt: 23/10/2025
 *           -patientId: 321
 *           -rawNote: https://ai-scribe-audio-uploads-felipe.s3.us-east-2.amazonaws.com/audio-1761255687260-8cd8e1ff06ad5e252e592157774530fb.mp3
 *           -processedNote: Patient reports mild headache and fatigue for the past two days. Summarize the following clinical interaction concisely: "I have a headache and I want to go to the hospital" "I've had a headache for two days and I don't know why I'm having a headache." "I'm tired. I'm tired of being tired." "What's wrong with me?"
 *           -patientName: Felipe Calderoon
 *           -patientDateOfBirth: 17/02/2002
 */
import "reflect-metadata";
import { Router } from "express";
import patientRoutes from "@entry-point/controllers/patient/routes/PatientRoutes";
import noteRoutes from "@entry-point/controllers/notes/routes/NoteRoutes";

/**
 * @swagger
 * tags:
 *   name: Note
 *   description: LimeAI API
 */
export class LimeAIRoutes {
  static get routes(): Router {
    const router = Router();
    router.use(patientRoutes);
    router.use(noteRoutes);
    return router;
  }
}
