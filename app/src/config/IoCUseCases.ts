import { NoteRepository } from "@gateway/note/NoteRepository";
import { PatientRepository } from "@gateway/patient/PatientRepository";
import { GetNoteByIdUseCase } from "@use-case/note/GetNoteByIdUseCase";
import { GetNotesUseCase } from "@use-case/note/GetNotesUseCase";
import { GetPatientsUseCase } from "@use-case/patient/GetPatientsUseCase";
import "reflect-metadata";
import { container } from "tsyringe";

container.register<GetPatientsUseCase>("GetPatientsUseCase", {
  useFactory: (c) =>
    new GetPatientsUseCase(c.resolve<PatientRepository>("PatientRepository")),
});

container.register<GetNotesUseCase>("GetNotesUseCase", {
  useFactory: (c) =>
    new GetNotesUseCase(c.resolve<NoteRepository>("NoteRepository")),
});

container.register<GetNoteByIdUseCase>("GetNoteByIdUseCase", {
  useFactory: (c) =>
    new GetNoteByIdUseCase(c.resolve<NoteRepository>("NoteRepository")),
});
