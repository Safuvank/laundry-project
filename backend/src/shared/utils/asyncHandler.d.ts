import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
export declare const asyncHandler: <P = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = ParsedQs>(fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => Promise<unknown>) => RequestHandler<P, ResBody, ReqBody, ReqQuery>;
//# sourceMappingURL=asyncHandler.d.ts.map