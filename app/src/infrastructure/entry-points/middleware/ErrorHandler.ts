import { Response, Request, NextFunction } from "express";
import log from "loglevel";
import { HttpStatusCode } from "../controllers/HttpStatusCodes";
import { NoteExceptions } from "@use-case/note/errors/NoteExceptions";
import { NoteNotFound } from "@use-case/note/errors/NoteNotFound";

export function ErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _: NextFunction
): void {
  log.error(err);
  if (err instanceof NoteNotFound) {
    res.status(HttpStatusCode.NOT_FOUND).json({ message: err.message });
    return;
  }
  if (err instanceof NoteExceptions) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    return;
  }
  res
    .status(HttpStatusCode.INTERNAL_SERVER)
    .json({ message: "Ocurrió un error inesperado." });
}
