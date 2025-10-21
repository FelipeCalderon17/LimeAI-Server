import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export function validateDtoMiddleware(inputData: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoStructure = plainToInstance(inputData, req.body);
    const errors = validateSync(dtoStructure, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      const msgs = errors
        .flatMap((e) => Object.values(e.constraints || {}))
        .join(", ");
      res.status(400).json({ message: msgs });
      return;
    }
    req.body = dtoStructure;
    next();
  };
}
