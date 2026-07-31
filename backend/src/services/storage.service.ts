import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import fs from 'fs';

export class StorageService {
  private bucket: string;

  constructor() {
    this.bucket = env.SUPABASE_STORAGE_BUCKET;
  }

  /**
   * Uploads a file buffer or path to Supabase Storage bucket
   */
  async uploadFile(filePath: string, destinationFileName: string, mimeType: string): Promise<string> {
    try {
      const fileBuffer = fs.readFileSync(filePath);

      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(destinationFileName, fileBuffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        logger.warn(`Supabase Storage upload warning: ${error.message}. Returning local mock path.`);
        return `/uploads/${destinationFileName}`;
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err: any) {
      logger.error('Error in StorageService.uploadFile:', err);
      return `/uploads/${destinationFileName}`;
    }
  }

  /**
   * Removes a file from Supabase Storage bucket
   */
  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([fileName]);

      if (error) {
        logger.warn(`Supabase Storage deletion warning: ${error.message}`);
        return false;
      }

      return true;
    } catch (err: any) {
      logger.error('Error in StorageService.deleteFile:', err);
      return false;
    }
  }
}

export const storageService = new StorageService();
