import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
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

    await Promise.all(mailOptions.map(opt => this.transporter.sendMail(opt)));
  }
}