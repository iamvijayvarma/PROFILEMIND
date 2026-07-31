import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export class AuthService {
  async syncUser(data: { id: string; email: string; fullName: string; avatarUrl?: string }) {
    try {
      // Upsert User
      const user = await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email: data.email,
          fullName: data.fullName,
        },
        create: {
          id: data.id,
          email: data.email,
          password: '', // OAuth/Supabase handles passwords
          fullName: data.fullName,
        }
      });

      // Upsert Profile
      const profile = await prisma.profile.upsert({
        where: { userId: data.id },
        update: {
          avatarUrl: data.avatarUrl || null,
        },
        create: {
          userId: data.id,
          avatarUrl: data.avatarUrl || null,
          headline: 'Digital Identity Explorer',
          skills: []
        }
      });

      return { user, profile };
    } catch (error: any) {
      logger.error(`Error syncing user: ${error.message}`);
      throw new ApiError(500, 'Failed to sync user profile');
    }
  }

  async getMe(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      throw new ApiError(404, 'User not found');
    } catch (err: any) {
      logger.error(`Error fetching user profile: ${err.message}`);
      throw new ApiError(500, 'Failed to fetch user profile');
    }
  }
}

export const authService = new AuthService();
