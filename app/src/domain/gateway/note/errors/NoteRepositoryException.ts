export class NoteRepositoryException extends Error {
  constructor(public override readonly message: string) {
    super(message);
  }
}
