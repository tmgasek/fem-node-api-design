import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputsErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  console.error(errors);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ errors: errors.array() });
  }

  next();
};
