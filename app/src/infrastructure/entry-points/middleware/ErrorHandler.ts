import { Response, Request, NextFunction } from "express";
import log from "loglevel";
import { HttpStatusCode } from "../controllers/HttpStatusCodes";
import { NoteExceptions } from "@use-case/note/errors/NoteExceptions";
import { NoteNotFound } from "@use-case/note/errors/NoteNotFound";
import { PatientNotFound } from "@use-case/patient/errors/PatientNotFound";
import { PatientExceptions } from "@use-case/patient/errors/PatientExceptions";

export function ErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _: NextFunction
): void {
  log.error(err);
  if (err instanceof NoteNotFound || err instanceof PatientNotFound) {
    res.status(HttpStatusCode.NOT_FOUND).json({ message: err.message });
    return;
  }
  if (err instanceof NoteExceptions || err instanceof PatientExceptions) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    return;
  }
  res
    .status(HttpStatusCode.INTERNAL_SERVER)
    .json({ message: "Ocurrió un error inesperado." });
}
