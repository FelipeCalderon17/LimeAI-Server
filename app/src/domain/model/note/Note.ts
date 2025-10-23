export class Note {
  constructor(
    private readonly id: string,
    private readonly createdAt: Date,
    private readonly patientId: string,
    private readonly rawNote: string,
    private readonly processedNote: string | null,
    private readonly patientName?: string,
    private readonly patientDateOfBirth?: Date
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

  public getProcessedNote(): string | null {
    return this.processedNote;
  }

  public getPatientName(): string {
    return this.patientName ?? "";
  }

  public getPatientDateOfBirth(): Date {
    return this.patientDateOfBirth ?? new Date();
  }

  public static create(patientId: string, rawNote: string): Note {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    return new Note(id, createdAt, patientId, rawNote, null);
  }

  public static createFromAudio(
    patientId: string,
    audioUrl: string,
    processedContent: string
  ): Note {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    return new Note(id, createdAt, patientId, audioUrl, processedContent);
  }

  public withProcessedOutput(processedContent: string | null): Note {
    return new Note(
      this.id,
      this.createdAt,
      this.patientId,
      this.rawNote,
      processedContent,
      this.patientName
    );
  }
}
