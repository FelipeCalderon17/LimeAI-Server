import { inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { NoteRepository } from "@gateway/note/NoteRepository";
import { Note } from "@model/note/Note";
import logger from "@config/Logger";
import { NoteRepositoryException } from "@gateway/note/errors/NoteRepositoryException";
import { NoteMapper } from "./mappers/NoteMapper";
import { NoteNotFound } from "@use-case/note/errors/NoteNotFound";

@injectable()
export class NotePostgresRepository implements NoteRepository {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}
  async getNotes(): Promise<Note[]> {
    try {
      const notesFromDb = await this.prisma.note.findMany({
        include: {
          patient: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NoteMapper.bulkToDomain(notesFromDb);
    } catch (error) {
      logger.error(`Error fetching notes in repository: ${error}`);
      throw new NoteRepositoryException("Failed to fetch notes.");
    }
  }

  async getNoteById(id: string): Promise<Note | null> {
    try {
      const noteFromDb = await this.prisma.note.findUnique({
        where: {
          id: id,
        },
        include: {
          patient: true,
        },
      });
      if (!noteFromDb) {
        return null;
      }
      return NoteMapper.toDomain(noteFromDb);
    } catch (error) {
      logger.error(`Error fetching note by id ${id}: ${error}`);
      throw new NoteRepositoryException("Failed to fetch note.");
    }
  }

  async createNote(note: Note): Promise<Note> {
    try {
      const newNoteFromDb = await this.prisma.note.create({
        data: {
          id: note.getId(),
          createdAt: note.getCreatedAt(),
          patientId: note.getPatientId(),
          rawInput: note.getRawNote(),
          processedOutput: note.getProcessedNote(),
        },
        include: {
          patient: true,
        },
      });

      return NoteMapper.toDomain(newNoteFromDb);
    } catch (error) {
      logger.error(`Error creating note in repository: ${error}`);
      throw new NoteRepositoryException("Failed to create note.");
    }
  }
}
