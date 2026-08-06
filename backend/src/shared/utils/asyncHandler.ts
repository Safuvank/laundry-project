// import type{ Request, Response, NextFunction } from "express";

// export const asyncHandler =
//   (
//     fn: (
//       req: Request,
//       res: Response,
//       next: NextFunction
//     ) => Promise<any>
//   ) =>
//   (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     Promise.resolve(
//       fn(req, res, next)
//     ).catch(next);
//   };

import type { Request, Response, NextFunction, RequestHandler } from "express";

import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

export const asyncHandler = <
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
