import { Note } from "@model/note/Note";

export class Patient {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly dateOfBirth: Date,
    private readonly notes: Note[]
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDateOfBirth(): Date {
    return this.dateOfBirth;
  }

  public getNotes(): Note[] {
    return this.notes;
  }
  public getAge(): number {
    const today = new Date();
    const birthDate = this.dateOfBirth;
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
