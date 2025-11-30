
import { GoogleGenAI, Type } from "@google/genai";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface HerbInfo {
    description: string;
    ayurvedicProperties: string[];
}

export const getHerbInfo = async (herbName: string): Promise<HerbInfo | null> => {
    if (!API_KEY) return null;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a brief description and a list of 3 key Ayurvedic properties for the herb "${herbName}".`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: {
                            type: Type.STRING,
                            description: "A brief, one or two sentence description of the herb."
                        },
                        ayurvedicProperties: {
                            type: Type.ARRAY,
                            description: "An array of 3 strings, each describing a key Ayurvedic property or use.",
                            items: {
                                type: Type.STRING,
                            }
                        }
                    },
                    required: ["description", "ayurvedicProperties"]
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedData: HerbInfo = JSON.parse(jsonText);
        return parsedData;

    } catch (error) {
        console.error("Error fetching herb info from Gemini:", error);
        return null;
    }
};
