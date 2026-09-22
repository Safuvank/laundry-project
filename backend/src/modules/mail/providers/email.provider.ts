import { Resend, type CreateEmailOptions } from "resend";

import { env } from "../../../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export class EmailProvider {
  async send(email: EmailPayload): Promise<void> {
    const emailData: CreateEmailOptions = {
      from: env.MAIL_FROM,
      to: email.to,
      subject: email.subject,
      html: email.html,
    } as CreateEmailOptions;

    const { error } = await resend.emails.send(emailData);

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message);
    }

    console.log(`Email sent successfully to ${email.to}`);
  }
}

export const emailProvider = new EmailProvider();
