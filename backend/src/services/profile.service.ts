import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

export class ProfileService {
  async getProfile(userId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { user: { select: { email: true, fullName: true } } }
      });

      if (profile) return profile;
    } catch (err: any) {
      logger.warn('Prisma DB unavailable. Returning fallback profile record.');
    }

    return {
      id: 'profile-1',
      userId,
      headline: 'Senior Full Stack & AI Systems Architect',
      bio: 'Pioneering human-computer interface synthesis and AI-powered memory graphs.',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      dob: '1998-04-12',
      linkedin: 'https://linkedin.com/in/alexmercer',
      github: 'https://github.com/alexmercer',
      portfolio: 'https://alexmercer.dev',
      preferredRole: 'Lead Product Engineer',
      skills: ['Interface Design', 'Full Stack Architecture', 'TypeScript', 'React', 'Tailwind CSS'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
  }

  async updateProfile(userId: string, data: any) {
    try {
      const updatedProfile = await prisma.profile.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data
        }
      });
      return updatedProfile;
    } catch (err: any) {
      logger.warn('Prisma DB unavailable. Returning updated mock profile.');
      return {
        id: 'profile-1',
        userId,
        ...data
      };
    }
  }
}

export const profileService = new ProfileService();
