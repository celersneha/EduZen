import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize and return a Google Generative AI instance
 * @returns {GoogleGenerativeAI} Configured Gemini AI instance
 */
export function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Get a configured Gemini model instance
 * @param {string} modelName - The model name (default: 'gemini-2.0-flash')
 * @returns {GenerativeModel} Configured model instance
 */
export function getGeminiModel(modelName = 'gemini-2.0-flash') {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Generate content using Gemini AI
 * @param {string|Array} prompt - The prompt or array of content parts
 * @param {string} modelName - Optional model name (default: 'gemini-2.0-flash')
 * @returns {Promise<string>} Generated text content
 */
export async function generateContent(prompt, modelName = 'gemini-2.0-flash') {
  const model = getGeminiModel(modelName);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

/**
 * Clean JSON response from Gemini (removes markdown code blocks and extra formatting)
 * @param {string} text - Raw text response from Gemini
 * @returns {string} Cleaned JSON string
 */
export function cleanJsonResponse(text) {
  return text
    .replace(/^```json\s*|\s*```$/g, '') // Remove markdown code block markers
    .replace(/^["']|["']$/g, '') // Remove surrounding quotes if any
    .replace(/\\"/g, '"') // Replace escaped quotes with regular quotes
    .trim(); // Remove extra whitespace
}

