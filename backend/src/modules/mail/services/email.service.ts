import { smtpProvider } from "../providers/smtp.provider.js";

import { verifyEmailTemplate } from "../templates/verifyEmail.js";

export class EmailService {
  async sendVerificationEmail(data: {
    firstName: string;
    email: string;
    verificationUrl: string;
  }): Promise<void> {
    const html = verifyEmailTemplate({
      firstName: data.firstName,
      verificationUrl: data.verificationUrl,
    });

    await smtpProvider.send({
      to: data.email,

      subject: "Verify Your Email Address",

      html,
    });
  }
}

export const emailService = new EmailService();
