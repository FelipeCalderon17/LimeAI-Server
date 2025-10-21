import { NoteRepository } from "@gateway/note/NoteRepository";
import { Note } from "@model/note/Note";
import { NoteNotFound } from "./errors/NoteNotFound";

export class GetNoteByIdUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(id: string): Promise<Note> {
    const note = await this.noteRepository.getNoteById(id);
    if (!note) {
      throw new NoteNotFound(`Note with id ${id} not found.`);
    }
    return note;
  }
}
