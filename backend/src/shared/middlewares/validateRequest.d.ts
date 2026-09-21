import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
export declare const validateRequest: (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateRequest.d.ts.map