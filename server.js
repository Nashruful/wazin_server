import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

let conversationHistory = [];

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    conversationHistory.push({ role: "user", content: prompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversationHistory,
    });

    const aiResponse = completion.choices[0]?.message?.content || "No response";

    conversationHistory.push({ role: "assistant", content: aiResponse });

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error generating response:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate response from OpenAI" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
