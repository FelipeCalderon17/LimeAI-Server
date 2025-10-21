import { PatientRepository } from "@gateway/patient/PatientRepository";
import { Patient } from "@model/patient/Patient";

export class GetPatientsUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(): Promise<Patient[]> {
    const patients = await this.patientRepository.getPatients();
    return patients;
  }
}
