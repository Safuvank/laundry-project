import { smtpProvider } from "../providers/smtp.provider.js";
import { verifyEmailTemplate } from "../templates/verifyEmail.js";
import { forgotPasswordTemplate } from "../templates/forgotPassword.js";
export class EmailService {
    async sendVerificationEmail(data) {
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
    async sendForgotPasswordEmail(data) {
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
//# sourceMappingURL=email.service.js.map