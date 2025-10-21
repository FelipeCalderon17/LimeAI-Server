import { NoteRepository } from "@gateway/note/NoteRepository";
import { Note } from "@model/note/Note";

export class GetNotesUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(): Promise<Note[]> {
    const notes = await this.noteRepository.getNotes();
    return notes;
  }
}
