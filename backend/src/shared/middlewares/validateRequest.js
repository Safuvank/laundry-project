import { ZodType } from "zod";
import { ValidationError } from "../errors/ValidationError.js";
export const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const firstError = result.error.issues[0];
        return next(new ValidationError(firstError?.message || "Validation failed"));
    }
    req.body = result.data;
    next();
};
//# sourceMappingURL=validateRequest.js.map