export class Note {
  constructor(
    private readonly id: string,
    private readonly createdAt: Date,
    private readonly patientId: string,
    private readonly rawNote: string,
    private readonly processedNote: string,
    private readonly patientName?: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getPatientId(): string {
    return this.patientId;
  }

  public getRawNote(): string {
    return this.rawNote;
  }

  public getProcessedNote(): string {
    return this.processedNote;
  }

  public getPatientName(): string {
    return this.patientName ?? "";
  }
}
