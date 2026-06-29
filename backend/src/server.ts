import app from "./app.js";

import { env } from "./config/env.js";

import { connectDatabase } from "./config/database.js";

import { smtpProvider } from "./modules/mail/providers/smtp.provider.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    await smtpProvider.verifyConnection();

    app.listen(Number(env.PORT), () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

startServer();
