import { AIAdapter } from "@adapter/ai/AIAdapter";
import { NoteRepository } from "@gateway/note/NoteRepository";
import { PatientRepository } from "@gateway/patient/PatientRepository";
import { Note } from "@model/note/Note";
import { PatientNotFound } from "@use-case/patient/errors/PatientNotFound";

export class CreateNoteUseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly patientRepository: PatientRepository,
    private readonly aiOpenAiAdapter: AIAdapter
  ) {}

  async execute(note: Note): Promise<Note> {
    const patientExists = await this.patientRepository.existsById(
      note.getPatientId()
    );
    if (!patientExists) {
      throw new PatientNotFound(
        `Patient with id ${note.getPatientId()} not found.`
      );
    }
    const rawText = note.getRawNote();
    const processedText = await this.aiOpenAiAdapter.summarizeText(rawText);
    const noteWithSummary = note.withProcessedOutput(processedText);
    return this.noteRepository.createNote(noteWithSummary);
  }

  async executeWithAudio(patientId: string, audioS3Url: string): Promise<Note> {
    const patientExists = await this.patientRepository.existsById(patientId);
    if (!patientExists) {
      throw new PatientNotFound(`Patient with id ${patientId} not found.`);
    }
    const transcription = await this.aiOpenAiAdapter.transcribeAudioFromUrl(
      audioS3Url
    );
    const processedNoteContent = await this.aiOpenAiAdapter.summarizeText(
      transcription
    );
    const note = Note.createFromAudio(
      patientId,
      audioS3Url,
      processedNoteContent
    );
    return this.noteRepository.createNote(note);
  }
}
