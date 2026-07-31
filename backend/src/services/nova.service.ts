import { prisma } from '../config/prisma';
import { geminiService } from './gemini.service';
import { logger } from '../utils/logger';

export class NovaService {
  async processChatMessage(userId: string, query: string) {
    // Save user message to database
    try {
      await prisma.chatMessage.create({
        data: {
          userId,
          role: 'user',
          content: query
        }
      });
    } catch (err: any) {
      logger.warn('Prisma DB insert skipped for user message in mock mode.');
    }

    // Fetch comprehensive user context
    const profile = await prisma.profile.findUnique({ where: { userId } });
    const timeline = await prisma.timelineEvent.findMany({ where: { userId } });
    const documents = await prisma.document.findMany({ 
      where: { userId },
      select: {
        originalName: true,
        extractedData: true
      }
    });

    const userContext = {
      profile: profile || {},
      timeline: timeline || [],
      documents: documents.map(doc => ({
        sourceDocument: doc.originalName,
        data: doc.extractedData
      }))
    };

    // Call Gemini Service RAG
    const aiResponse = await geminiService.generateChatResponse(query, userContext);

    // Save AI response to database
    try {
      await prisma.chatMessage.create({
        data: {
          userId,
          role: 'ai',
          content: aiResponse.text,
          citations: aiResponse.citations || []
        }
      });
    } catch (err: any) {
      logger.warn('Prisma DB insert skipped for AI message in mock mode.');
    }

    return {
      answer: aiResponse.text,
      sources: aiResponse.citations || [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}

export const novaService = new NovaService();
