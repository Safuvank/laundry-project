import { smtpProvider } from "../providers/smtp.provider.js";

import { verifyEmailTemplate } from "../templates/verifyEmail.js";

import { forgotPasswordTemplate } from "../templates/forgotPassword.js";

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


  
  async sendForgotPasswordEmail(data: {
    firstName: string;
    email: string;
    resetPasswordUrl: string;
  }): Promise<void> {
    const html = forgotPasswordTemplate({
      firstName: data.firstName,
      resetPasswordUrl: data.resetPasswordUrl,
    });

    await smtpProvider.send({
      to: data.email,
      subject: "Reset Your Password",
      html,
    });
  }
}

export const emailService = new EmailService();
