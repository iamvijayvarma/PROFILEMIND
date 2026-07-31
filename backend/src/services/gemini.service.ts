import { env } from '../config/env';
import { logger } from '../utils/logger';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import mammoth from 'mammoth';

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  /**
   * Extract skills, experience, and metadata from document text/file using Gemini
   */
  async extractDocumentData(fileBuffer: Buffer, mimeType: string): Promise<any> {
    logger.info(`[GeminiService] Extracting document data (MIME: ${mimeType}, Size: ${fileBuffer.length} bytes)`);

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });

      let contentParts: Array<string | Part> = [];

      // If it's a PDF, Image, or plain text, pass it via inlineData if supported,
      // but Gemini natively supports PDF, PNG, JPEG, WEBP via inlineData.
      if (mimeType.includes('pdf') || mimeType.includes('image/')) {
        contentParts.push({
          inlineData: {
            data: fileBuffer.toString('base64'),
            mimeType
          }
        });
      } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
        // Use mammoth to extract text from DOCX
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        contentParts.push(result.value);
      } else {
        // Fallback for raw text
        contentParts.push(fileBuffer.toString('utf-8'));
      }

      const prompt = `
You are a highly accurate digital identity extraction AI.
Analyze the provided document (resume, certificate, internship letter, etc.) and extract the structured professional information into the following exact JSON format.

JSON schema requirements:
{
  "documentType": "string (e.g. Resume, Certificate, Cover Letter)",
  "title": "string (a descriptive title for the document)",
  "summary": "string (a brief 1-2 sentence professional summary)",
  "skills": ["string (list of technical or soft skills)"],
  "projects": [{ "name": "string", "description": "string", "date": "string (e.g. 2023)" }],
  "certificates": [{ "name": "string", "issuer": "string", "date": "string" }],
  "internships": [{ "role": "string", "company": "string", "date": "string" }],
  "companies": ["string (list of companies worked at)"],
  "education": [{ "degree": "string", "institution": "string", "date": "string" }],
  "technologies": ["string (list of specific tools, frameworks, languages)"],
  "achievements": ["string (list of notable accomplishments)"],
  "dates": ["string (list of any significant dates found)"],
  "confidence": number (float between 0 and 100 representing your extraction confidence)
}

If any fields are missing in the document, return an empty array [] or empty string "" as appropriate. Return only the JSON object.
      `;

      contentParts.unshift(prompt);

      const result = await model.generateContent(contentParts as any);
      const response = result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error: any) {
      logger.error(`[GeminiService] Error extracting document data: ${error.message}`);
      throw error;
    }
  }

  async generateChatResponse(query: string, userContext: any): Promise<{ text: string; citations?: string[] }> {
    logger.info(`[GeminiService] Processing query: "${query}"`);

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });

      const prompt = `
You are Nova, an intelligent digital identity assistant for ProfileMind. 
Your goal is to answer the user's question using ONLY the provided structured context (their profile, timeline, and extracted document metadata).

Here is the user's structured context (JSON):
${JSON.stringify(userContext)}

Instructions:
1. Answer the user's question naturally and professionally based ONLY on the provided context.
2. If the answer cannot be found in the context, politely state that you do not have that information. DO NOT hallucinate or guess.
3. Every time you provide a piece of information, you MUST reference the specific source document it came from (use the 'sourceDocument' field from the 'documents' array). Example: "This skill was extracted from your Resume.pdf."
4. Return a strict JSON object with the following schema:
{
  "answer": "Your detailed answer to the user's query",
  "sources": ["sourceDocument1.pdf", "sourceDocument2.docx"]
}

User's Question: "${query}"
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      const parsed = JSON.parse(text);
      return {
        text: parsed.answer || "I could not generate an answer.",
        citations: parsed.sources || []
      };
    } catch (error: any) {
      logger.error(`[GeminiService] Error generating chat response: ${error.message}`);
      return {
        text: "I encountered an error while trying to process your request. Please try again later.",
        citations: []
      };
    }
  }
}

export const geminiService = new GeminiService();
