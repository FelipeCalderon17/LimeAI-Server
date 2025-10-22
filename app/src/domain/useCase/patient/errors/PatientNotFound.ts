import { PatientExceptions } from "./PatientExceptions";

export class PatientNotFound extends PatientExceptions {
  constructor(message: string) {
    super(message);
  }
}
