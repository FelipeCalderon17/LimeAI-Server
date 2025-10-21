import { Note } from "@model/note/Note";
import { Note as PrismaNote, Patient as PrismaPatient } from "@prisma/client";

type PrismaNoteWithPatient = PrismaNote & {
  patient: PrismaPatient;
};

export class NoteMapper {
  public static toDomain(prismaNote: PrismaNoteWithPatient): Note {
    return new Note(
      prismaNote.id,
      prismaNote.createdAt,
      prismaNote.patientId,
      prismaNote.rawInput,
      prismaNote.processedOutput,
      prismaNote.patient.name
    );
  }

  public static bulkToDomain(prismaNotes: PrismaNoteWithPatient[]): Note[] {
    return prismaNotes.map((n) => this.toDomain(n));
  }
}
