// import jwt from "jsonwebtoken";
// import { env } from "../../../config/env.js";

// if (!env.ACCESS_TOKEN_SECRET) {
//   throw new Error("ACCESS_TOKEN_SECRET is not defined");
// }

// if (!env.REFRESH_TOKEN_SECRET) {
//   throw new Error("REFRESH_TOKEN_SECRET is not defined");
// }

// const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
// const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

// export const generateAccessToken = (payload: object): string => {
//   return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
//     expiresIn: "10",
//   });
// };

// export const generateRefreshToken = (payload: object): string => {
//   return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
//     expiresIn: "30d",
//   });
// };

// export const verifyAccessToken = (token: string) => {
//   return jwt.verify(token, ACCESS_TOKEN_SECRET);
// };

// export const verifyRefreshToken = (token: string) => {
//   return jwt.verify(token, REFRESH_TOKEN_SECRET);
// };

import jwt from "jsonwebtoken";

import { env } from "../../../config/env.js";

if (!env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

if (!env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (payload: object): string => {
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const decoded = jwt.decode(token);

  console.log("======================================");
  console.log("🔐 ACCESS TOKEN GENERATED");
  console.log("Payload:", payload);
  console.log("Decoded token:", decoded);
  console.log("======================================");

  return token;
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
