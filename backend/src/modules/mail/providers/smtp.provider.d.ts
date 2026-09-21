import type { IEmail } from "../interfaces/IEmail.js";
export declare class SMTPProvider {
    private transporter;
    constructor();
    send(email: IEmail): Promise<void>;
    verifyConnection(): Promise<void>;
}
export declare const smtpProvider: SMTPProvider;
//# sourceMappingURL=smtp.provider.d.ts.map