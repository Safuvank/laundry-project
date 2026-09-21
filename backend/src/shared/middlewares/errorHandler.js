import { AppError } from "../errors/AppError.js";
export const errorHandler = (err, req, res, next) => {
    console.error("======================================");
    console.error("BACKEND ERROR");
    console.error("======================================");
    console.error("Method:", req.method);
    console.error("URL:", req.originalUrl);
    console.error("Name:", err.name);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("Full Error:", err);
    console.error("======================================");
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message,
        error: err.name,
        stack: process.env.NODE_ENV === "development"
            ? err.stack
            : undefined,
    });
};
//# sourceMappingURL=errorHandler.js.map