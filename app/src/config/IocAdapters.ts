import "reflect-metadata";
import { container } from "tsyringe";
import prisma from "./prisma.client";
import { PatientRepository } from "@gateway/patient/PatientRepository";
import { PatientPostgresRepository } from "@adapter/patient/PatientPostgresRepository";
import { NoteRepository } from "@gateway/note/NoteRepository";
import { NotePostgresRepository } from "@adapter/note/NotePostgresRepository";
import { AIAdapter } from "@adapter/ai/AIAdapter";

container.register("PrismaClient", {
  useValue: prisma,
});
container.register<PatientRepository>("PatientRepository", {
  useClass: PatientPostgresRepository,
});
container.register<NoteRepository>("NoteRepository", {
  useClass: NotePostgresRepository,
});

container.register<AIAdapter>("AIAdapter", {
  useClass: AIAdapter,
});
