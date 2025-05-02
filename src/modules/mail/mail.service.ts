import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendBulkInvites(emails: string[], subject: string, body: string) {
    const mailOptions = emails.map(email => ({
      from: `"Collaborative Editor" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject,
      html: body,
    }));

    const allResp = await Promise.allSettled(
      mailOptions.map(opt => this.transporter.sendMail(opt)),
    );

    const failed = allResp.filter(resp => resp.status === 'rejected');
    return failed;
  }
}
