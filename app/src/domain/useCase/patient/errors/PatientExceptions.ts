export class PatientExceptions extends Error {
  constructor(public override readonly message: string) {
    super(message);
  }
}
