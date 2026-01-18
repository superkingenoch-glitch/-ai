
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIModel } from "../types";

export class AIService {
  private static getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  static async generateText(model: AIModel, prompt: string, systemInstruction?: string): Promise<string> {
    const ai = this.getClient();
    
    // For non-Gemini models, we use Gemini 3 Pro as the engine with a specific system instruction to adopt the personality
    const targetModel = (model === AIModel.GEMINI_FLASH || model === AIModel.GEMINI_PRO) 
      ? model 
      : AIModel.GEMINI_PRO;

    const personaInstruction = this.getPersonaInstruction(model, systemInstruction);

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: prompt,
        config: {
          systemInstruction: personaInstruction,
          temperature: 0.8,
        },
      });
      return response.text || "No response received.";
    } catch (error) {
      console.error("API Error:", error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }
  }

  static async generateImage(prompt: string, highQuality: boolean = false): Promise<string> {
    const ai = this.getClient();
    const model = highQuality ? AIModel.GEMINI_IMAGE_PRO : AIModel.GEMINI_IMAGE;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in response");
    } catch (error) {
      console.error("Image API Error:", error);
      throw error;
    }
  }

  private static getPersonaInstruction(model: AIModel, custom?: string): string {
    const base = custom || "You are a helpful AI assistant.";
    switch (model) {
      case AIModel.CHATGTP_SIM:
        return `${base} Adopt the persona of OpenAI's GPT-4o. Be concise, direct, and professional. Mention you are GPT-4o.`;
      case AIModel.CLAUDE_SIM:
        return `${base} Adopt the persona of Anthropic's Claude 3.5 Sonnet. Be helpful, harmless, and honest. Use a warm, intellectual tone.`;
      case AIModel.GROK_SIM:
        return `${base} Adopt the persona of xAI's Grok. Be witty, slightly rebellious, and fun. Use modern humor.`;
      case AIModel.META_SIM:
        return `${base} Adopt the persona of Meta's Llama 3.1. Be efficient and open-source focused.`;
      default:
        return base;
    }
  }
}
