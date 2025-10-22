import { Patient } from "@model/patient/Patient";

export interface PatientRepository {
  getPatients(): Promise<Patient[]>;
  existsById(id: string): Promise<boolean>;
}
