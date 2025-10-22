import { NoteRepository } from "@gateway/note/NoteRepository";
import { PatientRepository } from "@gateway/patient/PatientRepository";
import { Note } from "@model/note/Note";
import { PatientNotFound } from "@use-case/patient/errors/PatientNotFound";

export class CreateNoteUseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly patientRepository: PatientRepository
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
    return this.noteRepository.createNote(note);
  }
}
