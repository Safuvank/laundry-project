export declare class EmailService {
    sendVerificationEmail(data: {
        firstName: string;
        email: string;
        verificationUrl: string;
    }): Promise<void>;
    sendForgotPasswordEmail(data: {
        firstName: string;
        email: string;
        resetPasswordUrl: string;
    }): Promise<void>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=email.service.d.ts.map