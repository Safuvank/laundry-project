import nodemailer, {} from "nodemailer";
import { env } from "../../../config/env.js";
export class SMTPProvider {
    transporter;
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
    async send(email) {
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
    async verifyConnection() {
        await this.transporter.verify();
        console.log("SMTP Connected Successfully");
    }
}
export const smtpProvider = new SMTPProvider();
//# sourceMappingURL=smtp.provider.js.map