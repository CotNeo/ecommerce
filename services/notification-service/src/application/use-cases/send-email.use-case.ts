import { EmailProvider } from '../ports/email-provider';
import { NotificationRepository } from '../ports/notification.repository';

/**
 * Send email use case
 */
export class SendEmailUseCase {
  constructor(
    private emailProvider: EmailProvider = new (require('../../infrastructure/email-provider').SendGridEmailProvider)(),
    private notificationRepository: NotificationRepository = new (require('../../infrastructure/persistence/notification.repository').NotificationRepositoryImpl)()
  ) {}

  async execute(input: {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
  }) {
    console.log('[SendEmailUseCase] Sending email started', { to: input.to, template: input.template });

    let logId: string | null = null;
    let templateData: { subject: string | null; body: string } | null = null;

    try {
      // 1. Get template from database
      const template = await this.notificationRepository.findTemplateByName(input.template);
      
      if (template) {
        templateData = {
          subject: template.subject || input.subject,
          body: template.body,
        };
      } else {
        // Fallback if template not found
        templateData = {
          subject: input.subject,
          body: `<html><body>Template: ${input.template}, Data: ${JSON.stringify(input.data)}</body></html>`,
        };
      }

      // 2. Render template with data
      const html = this.renderTemplate(templateData.body, input.data);
      const subject = this.renderTemplate(templateData.subject || input.subject, input.data);

      // 3. Create notification log (pending)
      const log = await this.notificationRepository.createLog({
        templateId: template?.id,
        type: 'email',
        recipient: input.to,
        subject,
        body: html,
        status: 'pending',
        metadata: { template: input.template, data: input.data },
      });
      logId = log.id;

      // 4. Send email via provider
      await this.emailProvider.send({
        to: input.to,
        subject,
        html,
      });

      // 5. Update log status to sent
      if (logId) {
        await this.notificationRepository.updateLogStatus(logId, 'sent');
      }

      console.log('[SendEmailUseCase] Email sent successfully', { to: input.to, logId });
      return { success: true, logId };
    } catch (error: any) {
      console.error('[SendEmailUseCase] Email sending failed', error);

      // Update log status to failed
      if (logId) {
        await this.notificationRepository.updateLogStatus(
          logId,
          'failed',
          error.message || 'Unknown error'
        );
      } else {
        // Create failed log if we couldn't create one before
        await this.notificationRepository.createLog({
          type: 'email',
          recipient: input.to,
          subject: input.subject,
          body: '',
          status: 'failed',
          error: error.message || 'Unknown error',
          metadata: { template: input.template, data: input.data },
        });
      }

      throw error;
    }
  }

  /**
   * Render template with data
   * Simple template rendering - replace {{variable}} with data values
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    let rendered = template;
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    }
    return rendered;
  }
}

