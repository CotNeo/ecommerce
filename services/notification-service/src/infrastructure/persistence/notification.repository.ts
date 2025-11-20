import { NotificationRepository as INotificationRepository } from '../../application/ports/notification.repository';
import { getPrismaClient } from './prisma-client';

/**
 * Notification repository implementation with Prisma
 */
export class NotificationRepositoryImpl implements INotificationRepository {
  private prisma = getPrismaClient();

  /**
   * Find notification template by name
   */
  async findTemplateByName(name: string): Promise<{
    id: string;
    name: string;
    type: string;
    subject: string | null;
    body: string;
    variables: any;
  } | null> {
    console.log('[NotificationRepository] Finding template by name:', name);
    try {
      const template = await (this.prisma as any).notificationTemplate.findUnique({
        where: { name },
      });

      if (!template) {
        console.log('[NotificationRepository] Template not found:', name);
        return null;
      }

      return {
        id: template.id,
        name: template.name,
        type: template.type,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
      };
    } catch (error) {
      console.error('[NotificationRepository] Error finding template:', error);
      throw error;
    }
  }

  /**
   * Create notification log
   */
  async createLog(data: {
    templateId?: string;
    type: string;
    recipient: string;
    subject?: string;
    body: string;
    status: string;
    error?: string;
    metadata?: any;
  }): Promise<{ id: string }> {
    console.log('[NotificationRepository] Creating notification log', {
      type: data.type,
      recipient: data.recipient,
      status: data.status,
    });
    try {
      const log = await (this.prisma as any).notificationLog.create({
        data: {
          templateId: data.templateId,
          type: data.type,
          recipient: data.recipient,
          subject: data.subject,
          body: data.body,
          status: data.status,
          error: data.error,
          metadata: data.metadata,
        },
      });

      console.log('[NotificationRepository] Notification log created successfully:', log.id);
      return { id: log.id };
    } catch (error) {
      console.error('[NotificationRepository] Error creating notification log:', error);
      throw error;
    }
  }

  /**
   * Update notification log status
   */
  async updateLogStatus(id: string, status: string, error?: string): Promise<void> {
    console.log('[NotificationRepository] Updating notification log status', { id, status });
    try {
      await (this.prisma as any).notificationLog.update({
        where: { id },
        data: {
          status,
          error,
        },
      });

      console.log('[NotificationRepository] Notification log status updated successfully:', id);
    } catch (error) {
      console.error('[NotificationRepository] Error updating notification log status:', error);
      throw error;
    }
  }
}

