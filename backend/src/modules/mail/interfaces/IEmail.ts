// export interface IEmail {
//   to: string;
//   subject: string;
//   html: string;
// }

export interface IEmail {
  to: string;
  subject: string;
  html: string;

  text?: string;

  cc?: string[];

  bcc?: string[];

  replyTo?: string;

  attachments?: {
    filename: string;
    path: string;
  }[];
}
