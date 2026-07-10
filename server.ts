import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialization of GoogleGenAI SDK to prevent app crashing when the key is not defined at load time.
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add your Gemini API Key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

app.use(express.json());

// API route: AI Product Description Generator
app.post("/api/generate-description", async (req, res) => {
  try {
    const { title, category, condition, usedDuration } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required to write a description." });
    }

    const ai = getAiClient();

    const conditionMap: Record<string, string> = {
      like_new: "নতুন এর মতো (Like New)",
      good: "ভালো (Good)",
      fair: "চলবে (Fair)"
    };
    const conditionLabel = conditionMap[condition] || condition || "ভালো";

    const prompt = `You are an expert product description copywriter for "AponBazar" (আপনবাজার), the premier second-hand classified marketplace in Bangladesh.
Write a highly compelling, beautiful, and persuasive product description in Bengali (বাংলা) for the following item:
- Product Name/Title: ${title}
- Category: ${category}
- Condition: ${conditionLabel}
- Duration of Use: ${usedDuration || "N/A"}

Please structure the description beautifully as follows:
1. Start with an exciting or catchy headline/hook in Bengali.
2. Provide a brief narrative paragraph praising the condition of the item.
3. List 4 to 5 key features or reasons to buy in bullet points with relevant emojis.
4. Conclude with a helpful call-to-action asking buyers to call or chat for more details.
5. Tone must be extremely polite, clean, and customized to Bengali buyers. Avoid English sentences, but feel free to keep standard technical terms like "GB", "RAM", "Battery Life", "Processor" in English or English transliteration. Do not output any markdown headers like "#" or "##" (use emojis or bold text instead for sections).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ description: response.text });
  } catch (error: any) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: error.message || "Failed to generate description" });
  }
});

// Serve application
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
