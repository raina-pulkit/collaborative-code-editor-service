import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('send-invite')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendInvites(
    @Body() body: { interviewees: string[]; interviewers: string[] },
  ): Promise<{ message: string }> {
    console.log('Received invite request:', body);
    const allEmails = [...body.interviewees, ...body.interviewers];

    await this.mailService.sendBulkInvites(
      allEmails,
      'Interview Room Invitation',
      `<p>You are invited to join the interview room. Please click the link and join at your scheduled time.</p>`,
    );

    return { message: 'Invites sent successfully' };
  }
}
