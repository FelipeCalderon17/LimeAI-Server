export class NoteExceptions extends Error {
  constructor(public override readonly message: string) {
    super(message);
  }
}
