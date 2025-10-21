import { Note } from "@model/note/Note";

export interface NoteRepository {
  getNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
}
