import mongoose from "mongoose";

import { env } from "./env.js";

export const connectDatabase =
  async (): Promise<void> => {
    try {
      await mongoose.connect(
        env.MONGODB_URI
      );

      console.log(
        "MongoDB Connected Successfully"
      );
    } catch (error) {
      console.error(
        "Database Connection Failed",
        error
      );

      process.exit(1);
    }
  };