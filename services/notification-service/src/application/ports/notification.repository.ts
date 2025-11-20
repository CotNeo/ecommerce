/**
 * Notification repository interface (port)
 */
export interface NotificationRepository {
  /**
   * Find notification template by name
   */
  findTemplateByName(name: string): Promise<{
    id: string;
    name: string;
    type: string;
    subject: string | null;
    body: string;
    variables: any;
  } | null>;

  /**
   * Create notification log
   */
  createLog(data: {
    templateId?: string;
    type: string;
    recipient: string;
    subject?: string;
    body: string;
    status: string;
    error?: string;
    metadata?: any;
  }): Promise<{ id: string }>;

  /**
   * Update notification log status
   */
  updateLogStatus(id: string, status: string, error?: string): Promise<void>;
}

