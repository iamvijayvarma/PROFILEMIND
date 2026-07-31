import { Request, Response, NextFunction } from 'express';
import { documentService } from '../services/document.service';
import { ApiResponse } from '../utils/apiResponse';

export class DocumentController {
  uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const file = req.file as Express.Multer.File;
      const result = await documentService.uploadDocument(userId, file);
      
      return res.status(201).json({
        success: true,
        fileUrl: result.fileUrl,
        documentId: result.id,
        extractedData: result.extractedData
      });
    } catch (error) {
      next(error);
    }
  };

  getDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const docs = await documentService.getDocuments(userId);
      return ApiResponse.success(res, docs, 'Documents retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const documentId = req.params.id;
      const doc = await documentService.getDocumentById(userId, documentId);
      return ApiResponse.success(res, doc, 'Document details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const documentId = req.params.id;
      const result = await documentService.deleteDocument(userId, documentId);
      return ApiResponse.success(res, result, 'Document deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const documentController = new DocumentController();
