import { inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PatientMapper } from "./mappers/PatientMapper";
import { Patient } from "@model/patient/Patient";
import { PatientRepository } from "@gateway/patient/PatientRepository";
import logger from "@config/Logger";
import { PatientRepositoryExceptions } from "@gateway/patient/PatientRepositoryExceptions";

@injectable()
export class PatientPostgresRepository implements PatientRepository {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}
  async getPatients(): Promise<Patient[]> {
    try {
      const patientsFromDb = await this.prisma.patient.findMany({
        include: {
          notes: true,
        },
      });
      return PatientMapper.bulkToDomain(patientsFromDb);
    } catch (error) {
      logger.error(`Error fetching patients in repository: ${error}`);
      throw new PatientRepositoryExceptions("Failed to fetch patients.");
    }
  }
}
