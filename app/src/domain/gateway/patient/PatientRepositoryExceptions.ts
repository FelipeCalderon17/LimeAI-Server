export class PatientRepositoryExceptions extends Error {
  constructor(public override readonly message: string) {
    super(message);
  }
}
