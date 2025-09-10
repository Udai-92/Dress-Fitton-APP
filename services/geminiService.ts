
import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `You are a virtual fashion stylist AI. Your task is to realistically place the dress from the second image onto the person in the first image.
Instructions:
1. Identify the person in the first image. Preserve their body shape, pose, skin tone, and the background.
2. Identify the dress in the second image.
3. Generate a new image where the person is wearing the dress. The dress should fit naturally, with correct lighting, shadows, and draping according to the person's pose.
4. Do not alter the person or the background. Only replace their current clothing with the new dress.
5. The final image should be photorealistic.`;

export const generateFitOnImage = async (
  userImage: UploadedFile,
  dressImage: UploadedFile
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: userImage.base64,
              mimeType: userImage.mimeType,
            },
          },
          {
            inlineData: {
              data: dressImage.base64,
              mimeType: dressImage.mimeType,
            },
          },
          {
            text: PROMPT,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData
    );

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      const textPart = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.text
      );
      throw new Error(
        `Could not generate image. AI response: ${textPart?.text || 'No details provided.'}`
      );
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
