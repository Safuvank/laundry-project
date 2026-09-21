import { AppError } from "./AppError.js";
export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
//# sourceMappingURL=UnauthorizedError.js.map