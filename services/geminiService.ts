
import { GoogleGenAI } from "@google/genai";
import { Animal, MedicalRecord } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (animal: Animal, history: MedicalRecord[]) => {
  try {
    const prompt = `
      Você é um assistente veterinário experiente. 
      Analise o histórico médico do seguinte animal e forneça um breve resumo, alertando sobre possíveis cuidados futuros ou vacinas atrasadas.
      
      Animal: ${animal.name || 'Sem nome'} (Espécie: ${animal.species}, Raça: ${animal.breed})
      Histórico:
      ${history.map(h => `- ${h.date}: ${h.type} - ${h.title}: ${h.description}`).join('\n')}
      
      Responda em Português de forma profissional e concisa.
    `;

    // Using ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // The text property directly returns the string output.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível carregar os insights de IA no momento.";
  }
};