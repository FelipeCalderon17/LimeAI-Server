import { IsNotEmpty, IsString } from "class-validator";

export class NotesDTO {
  @IsNotEmpty({ message: "The patient id is mandatory" })
  @IsString({ message: "Patient id should be a string" })
  patientId!: string;

  @IsNotEmpty({ message: "The raw note is mandatory" })
  @IsString({ message: "raw note should be a string" })
  rawNote!: string;
}
