import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

export class TimelineService {
  async getTimelineEvents(userId: string) {
    try {
      const events = await prisma.timelineEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      if (events && events.length > 0) return events;
    } catch (err: any) {
      logger.warn('Prisma DB unavailable. Returning mock chronological timeline data.');
    }

    return [
      {
        id: 't-1',
        userId,
        title: 'Lead Architect at ProfileMind',
        description: 'Pioneering human-computer interface synthesis and AI-powered digital identities.',
        category: 'workplace',
        date: '2026 - Present',
        tags: ['React', 'TypeScript', 'Node.js', 'Vite', 'Tailwind']
      },
      {
        id: 't-2',
        userId,
        title: 'Senior Software Engineer at Veridian Softworks',
        description: 'Engineered high-throughput design systems and modular frontend micro-services.',
        category: 'workplace',
        date: '2024 - 2026',
        tags: ['Design Systems', 'GraphQL', 'State Management']
      },
      {
        id: 't-3',
        userId,
        title: 'Winner Stanford HackAlpha (Best AI Integration)',
        description: 'Awarded 1st place for building an autonomous memory graph browser.',
        category: 'achievement',
        date: '2025',
        tags: ['AI Agent', 'Python', 'Vector DB']
      },
      {
        id: 't-4',
        userId,
        title: 'B.S. Computer Science, Stanford University',
        description: 'Focused on Distributed Systems, Human-Computer Interaction, and Neural Networks.',
        category: 'education',
        date: '2020 - 2024',
        tags: ['Computer Science', 'Algorithms', 'HCI']
      }
    ];
  }
}

export const timelineService = new TimelineService();
