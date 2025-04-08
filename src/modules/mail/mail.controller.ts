import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('invite')
export class AppController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendInvites(@Body() body: { interviewees: string[], interviewers: string[] }) {
    const allEmails = [...body.interviewees, ...body.interviewers];

    await this.mailService.sendBulkInvites(
      allEmails,
      'Interview Room Invitation',
      `<p>You are invited to join the interview room. Please click the link and join at your scheduled time.</p>`
    );

    return { message: 'Invites sent successfully' };
  }
}