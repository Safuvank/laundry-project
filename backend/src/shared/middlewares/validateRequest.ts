import type { Request, Response, NextFunction } from "express";

import { ZodType } from "zod";

import { ValidationError } from "../errors/ValidationError.js";

export const validateRequest =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return next(
        new ValidationError(firstError?.message || "Validation failed"),
      );
    }

    req.body = result.data;

    next();
  };
