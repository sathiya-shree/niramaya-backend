import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate_report", async (req, res) => {
  try {
    const { diary_entry } = req.body;

    if (!diary_entry) {
      return res.status(400).json({ error: "Diary entry required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Analyze the diary entry and give:
• Emotional state
• Stress indicators
• Positive notes
• Gentle self-care suggestions

Diary:
"${diary_entry}"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({ report: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default app;
