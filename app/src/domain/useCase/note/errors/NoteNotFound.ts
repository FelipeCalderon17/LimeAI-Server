import { NoteExceptions } from "./NoteExceptions";

export class NoteNotFound extends NoteExceptions {
  constructor(message: string) {
    super(message);
  }
}
