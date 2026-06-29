import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../../../config/env.js";

import type { IEmail } from "../interfaces/IEmail.js";

export class SMTPProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,

      port: env.SMTP_PORT,

      secure: env.SMTP_SECURE,

      auth: {
        user: env.SMTP_USER,

        pass: env.SMTP_PASS,
      },
    });
  }

  async send(email: IEmail): Promise<void> {
    await this.transporter.sendMail({
      from: env.MAIL_FROM,

      to: email.to,

      subject: email.subject,

      html: email.html,

      text: email.text,

      cc: email.cc,

      bcc: email.bcc,

      replyTo: email.replyTo,

      attachments: email.attachments,
    });
  }

  async verifyConnection(): Promise<void> {
    await this.transporter.verify();

    console.log("SMTP Connected Successfully");
  }
}

export const smtpProvider = new SMTPProvider();
