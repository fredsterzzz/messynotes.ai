import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/clean-notes", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that organizes messy notes into clean, structured notes." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const cleanedNotes = response.choices[0].message.content;
    res.json({ cleanedNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clean notes" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));