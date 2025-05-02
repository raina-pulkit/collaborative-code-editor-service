import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JWTGuard } from 'modules/github-auth/auth.guard';
import { MailService } from './mail.service';

@Controller('send-invite')
@UseGuards(JWTGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOkResponse({
    description: 'Successfully sent invites',
  })
  async sendInvites(
    @Body()
    body: {
      interviewees: string[];
      interviewers: string[];
      roomId: string;
    },
  ): Promise<{ message: string; failedEmails?: string[] }> {
    const { interviewees, interviewers, roomId } = body;
    const allEmails = [...interviewees, ...interviewers];

    const joinLink = `${process.env.GITHUB_REDIRECT_URI}/editor/${roomId}`;

    const emailContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c3e50;">🚀 Interview Room Invitation</h2>
    <p>You have been invited to join an interview room.</p>

    <p>
      👉 <strong>Join directly using the link below:</strong><br />
      <a href="${joinLink}" style="color: #1a73e8; text-decoration: none;">
        ${joinLink}
      </a>
    </p>

    <p>🔑 <strong>Room ID:</strong> <code style="background: #f4f4f4; padding: 4px 8px; border-radius: 4px;">${roomId}</code></p>

    <p>You can either click the link above or manually enter the Room ID in the app to join the session.</p>

    <hr style="margin-top: 24px; margin-bottom: 12px;" />
    <p style="font-size: 0.9em; color: #777;">If you have any issues accessing the room, please contact the session organizer.</p>
  </div>
`;

    const failed = await this.mailService.sendBulkInvites(
      allEmails,
      'Interview Room Invitation',
      emailContent,
    );

    if (failed.length > 0) {
      return {
        message: 'Some invites failed to send',
        failedEmails: failed.map(failed => failed.reason),
      };
    }

    return { message: 'Invites sent successfully' };
  }
}
