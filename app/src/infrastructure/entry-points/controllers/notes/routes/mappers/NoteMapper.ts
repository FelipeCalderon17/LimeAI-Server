import { Note } from "@model/note/Note";
import { NotesDTO } from "../dto/NotesDTO";

export const NoteMapper = {
  transformToNote(dto: NotesDTO): Note {
    return Note.create(dto.patientId, dto.rawNote);
  },
};
