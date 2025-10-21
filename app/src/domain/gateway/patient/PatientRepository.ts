import { Patient } from "@model/patient/Patient";

export interface PatientRepository {
  getPatients(): Promise<Patient[]>;
}
