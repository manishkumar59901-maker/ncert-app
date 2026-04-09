import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function solveDoubt(question: string, imageBase64?: string) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are an expert NCERT teacher for Class 6-12. 
  Explain concepts simply in a mix of Hindi and English (Hinglish).
  Provide step-by-step explanations.
  Keep responses conceptually clear and concise.
  If an image is provided, perform OCR and solve the problem shown.`;

  const contents: any[] = [];
  
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }
  
  contents.push({ text: question || "Please solve the problem in this image." });

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
}

export async function generateQuiz(chapterTitle: string, subject: string, classLevel: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Generate a 5-question MCQ quiz for Class ${classLevel} ${subject} chapter: "${chapterTitle}".
  Each question should have 4 options and 1 correct answer (0-indexed).
  Include a brief explanation for each answer.
  Return the response as a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getChapterSummary(chapterTitle: string, subject: string, classLevel: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Provide a concise summary, key points, 3 important questions, and a hierarchical mind map structure for Class ${classLevel} ${subject} chapter: "${chapterTitle}".
  Explain in a mix of Hindi and English.
  Return as JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          importantQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          mindMap: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              children: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING } } } }
                  }
                }
              }
            }
          }
        },
        required: ["summary", "keyPoints", "importantQuestions", "mindMap"]
      }
    }
  });

  return JSON.parse(response.text);
}
