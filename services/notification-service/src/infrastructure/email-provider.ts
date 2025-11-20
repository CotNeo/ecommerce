import { EmailProvider } from '../application/ports/email-provider';

/**
 * SendGrid email provider implementation
 * TODO: Implement actual SendGrid integration
 */
export class SendGridEmailProvider implements EmailProvider {
  async send(input: { to: string; subject: string; html: string }): Promise<void> {
    // Mock implementation
    console.log(`[EmailProvider] Sending email to ${input.to} with subject: ${input.subject}`);
    // TODO: Implement actual SendGrid API call
  }
}

