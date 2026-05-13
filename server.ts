import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Bible Assistant Endpoint
  app.post("/api/bible/explain", async (req, res) => {
    try {
      const { verse, context, targetAudience } = req.body;
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain the following Bible verse: "${verse}". 
        Context: ${context || "General"}. 
        Target Audience: ${targetAudience || "Adults"}.
        Provide a meaningful, spiritual, and easy-to-understand explanation. 
        If it's for kids, use simple language and stories.`,
      });
      const response = await model;
      res.json({ explanation: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate explanation" });
    }
  });

  // Daily Devotional Endpoint
  app.get("/api/bible/devotional", async (req, res) => {
    try {
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate a daily Bible devotional. Include a verse, a short reflection, and a prayer. Format as JSON with fields: verse, reference, reflection, prayer.",
        config: {
          responseMimeType: "application/json"
        }
      });
      const response = await model;
      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate devotional" });
    }
  });

  // Vite middleware for development
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
