import { prisma } from '../config/prisma';
import { storageService } from './storage.service';
import { geminiService } from './gemini.service';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import fs from 'fs';

export class DocumentService {
  async uploadDocument(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new ApiError(400, 'No file provided for upload');
    }

    const originalName = file.originalname;
    let fileName = originalName;
    
    // Handle duplicate filenames
    let fileExists = await prisma.document.findFirst({
      where: { userId, fileName }
    });
    
    if (fileExists) {
      const ext = originalName.substring(originalName.lastIndexOf('.'));
      const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
      fileName = `${baseName}-${Date.now()}${ext}`;
    }

    const destinationFileName = `${userId}/${fileName}`;
    
    // Upload file to Supabase Object Storage
    const fileUrl = await storageService.uploadFile(file.path, destinationFileName, file.mimetype);

    // Read file buffer for Gemini AI extraction
    let extractedData: any = null;
    try {
      const fileBuffer = fs.readFileSync(file.path);
      extractedData = await geminiService.extractDocumentData(fileBuffer, file.mimetype);

      // Update Profile skills
      if (extractedData && extractedData.skills && Array.isArray(extractedData.skills)) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        let existingSkills: string[] = [];
        if (profile && profile.skills && Array.isArray(profile.skills)) {
           existingSkills = profile.skills as string[];
        }
        const newSkills = [...new Set([...existingSkills, ...extractedData.skills])];
        
        await prisma.profile.upsert({
          where: { userId },
          update: { skills: newSkills },
          create: { userId, skills: newSkills }
        });
      }

      // Create Timeline Events
      if (extractedData) {
        if (Array.isArray(extractedData.projects)) {
          for (const proj of extractedData.projects) {
            await prisma.timelineEvent.create({
              data: {
                userId,
                title: proj.name || 'Project',
                description: proj.description || '',
                category: 'project',
                date: proj.date || new Date().getFullYear().toString()
              }
            });
          }
        }
        if (Array.isArray(extractedData.education)) {
          for (const edu of extractedData.education) {
            await prisma.timelineEvent.create({
              data: {
                userId,
                title: edu.degree || 'Education',
                description: edu.institution || '',
                category: 'education',
                date: edu.date || new Date().getFullYear().toString()
              }
            });
          }
        }
        if (Array.isArray(extractedData.internships)) {
          for (const int of extractedData.internships) {
            await prisma.timelineEvent.create({
              data: {
                userId,
                title: int.role || 'Internship',
                description: int.company || '',
                category: 'experience',
                date: int.date || new Date().getFullYear().toString()
              }
            });
          }
        }
        if (Array.isArray(extractedData.certificates)) {
          for (const cert of extractedData.certificates) {
            await prisma.timelineEvent.create({
              data: {
                userId,
                title: cert.name || 'Certificate',
                description: cert.issuer || '',
                category: 'certificate',
                date: cert.date || new Date().getFullYear().toString()
              }
            });
          }
        }
      }
    } catch (err: any) {
      logger.error(`[DocumentService] Gemini extraction step failed: ${err.message}`);
    }

    // Clean up temporary local upload file
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err: any) {
      logger.warn('Failed to clean up temp local upload file:', err);
    }

    const docRecord = await prisma.document.create({
      data: {
        userId,
        originalName,
        fileName,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadStatus: 'uploaded',
        extractedData: extractedData || {},
        confidence: 98.4
      }
    });

    return docRecord;
  }

  async getDocuments(userId: string) {
    const docs = await prisma.document.findMany({
      where: { userId },
      orderBy: { uploadDate: 'desc' }
    });
    return docs;
  }

  async getDocumentById(userId: string, documentId: string) {
    const doc = await prisma.document.findFirst({
      where: { id: documentId, userId }
    });
    
    if (!doc) {
      throw new ApiError(404, 'Document not found');
    }
    
    return doc;
  }

  async deleteDocument(userId: string, documentId: string) {
    const doc = await this.getDocumentById(userId, documentId);
    
    // Delete from storage
    const destinationFileName = `${userId}/${doc.fileName}`;
    await storageService.deleteFile(destinationFileName);
    
    await prisma.document.delete({
      where: { id: documentId }
    });

    return { message: 'Document deleted successfully', id: documentId };
  }
}

export const documentService = new DocumentService();
