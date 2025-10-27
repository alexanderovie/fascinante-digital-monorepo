interface EmailAnalytics {
  id: string;
  type: 'contact' | 'confirmation' | 'newsletter' | 'marketing';
  recipient: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  timestamp: string;
  metadata?: {
    service?: string;
    source?: string;
    campaign?: string;
  };
}

interface EmailMetrics {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

class EmailAnalyticsService {
  private analytics: EmailAnalytics[] = [];

  async trackEmailSent(analytics: Omit<EmailAnalytics, 'id' | 'timestamp'>) {
    const emailEvent: EmailAnalytics = {
      ...analytics,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    this.analytics.push(emailEvent);

    // En producción, esto se enviaría a una base de datos
    console.log('📊 Email Analytics:', emailEvent);

    return emailEvent;
  }

  async getMetrics(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<EmailMetrics> {
    const now = new Date();
    const cutoff = new Date();

    switch (timeframe) {
      case 'day':
        cutoff.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
    }

    const recentAnalytics = this.analytics.filter(
      a => new Date(a.timestamp) >= cutoff
    );

    const totalSent = recentAnalytics.length;
    const delivered = recentAnalytics.filter(a =>
      ['delivered', 'opened', 'clicked'].includes(a.status)
    ).length;
    const opened = recentAnalytics.filter(a =>
      ['opened', 'clicked'].includes(a.status)
    ).length;
    const clicked = recentAnalytics.filter(a =>
      a.status === 'clicked'
    ).length;
    const bounced = recentAnalytics.filter(a =>
      a.status === 'bounced'
    ).length;
    const failed = recentAnalytics.filter(a =>
      a.status === 'failed'
    ).length;

    return {
      totalSent,
      delivered,
      opened,
      clicked,
      bounced,
      failed,
      deliveryRate: totalSent > 0 ? (delivered / totalSent) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
    };
  }

  async getTopServices(): Promise<Array<{ service: string; count: number }>> {
    const serviceCounts: Record<string, number> = {};

    this.analytics.forEach(analytics => {
      if (analytics.metadata?.service) {
        const service = analytics.metadata.service;
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      }
    });

    return Object.entries(serviceCounts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const emailAnalytics = new EmailAnalyticsService();
export type { EmailAnalytics, EmailMetrics };
