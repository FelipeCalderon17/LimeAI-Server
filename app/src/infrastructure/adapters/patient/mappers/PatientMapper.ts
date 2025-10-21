import { Note } from "@model/note/Note";
import { Patient } from "@model/patient/Patient";
import { Note as PrismaNote, Patient as PrismaPatient } from "@prisma/client";
type PrismaPatientWithNotes = PrismaPatient & {
  notes: PrismaNote[];
};

export class PatientMapper {
  public static noteToDomain(prismaNote: PrismaNote): Note {
    return new Note(
      prismaNote.id,
      prismaNote.createdAt,
      prismaNote.patientId,
      prismaNote.rawInput,
      prismaNote.processedOutput
    );
  }
  public static toDomain(prismaPatient: PrismaPatientWithNotes): Patient {
    const domainNotes = prismaPatient.notes.map((prismaNote) =>
      this.noteToDomain(prismaNote)
    );
    return new Patient(
      prismaPatient.id,
      prismaPatient.name,
      prismaPatient.dateOfBirth,
      domainNotes
    );
  }
  public static bulkToDomain(
    prismaPatients: PrismaPatientWithNotes[]
  ): Patient[] {
    return prismaPatients.map((p) => this.toDomain(p));
  }
}
