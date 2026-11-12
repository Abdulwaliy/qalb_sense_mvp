import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server dir first, then fallback/override from cwd
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PRIMARY_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const FALLBACK_MODEL = "qwen/qwen3.8-27b";

async function requestGroqChat(model, mood, journal) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `You are a structured Islamic emotional reflection assistant.
Do NOT repeat user text verbatim.
Do NOT say "you wrote".
Return ONLY the following 5 sections:

1. Emotional Mirror
2. Insight
3. Reframe
4. Action Step
5. Spiritual Reminder`,
        },
        {
          role: "user",
          content: `Mood: ${mood}\n\nJournal:\n${journal}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

/* ---------------- Health Check ---------------- */
app.get("/", (req, res) => {
  res.send("QalbSense backend is alive 🧠");
});

/* ---------------- Reflection Route ---------------- */
app.post("/api/reflection", async (req, res) => {
  console.log("🔥 Reflection route HIT");

  try {
    const { mood, journal } = req.body;

    if (!mood || !journal) {
      return res.status(400).json({
        error: "Mood and journal are required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ Missing GROQ_API_KEY in environment variables");
      return res.status(500).json({
        error: "Missing GROQ_API_KEY on server",
      });
    }

    console.log(`🌐 Requesting reflection with model: ${PRIMARY_MODEL}`);
    let result = await requestGroqChat(PRIMARY_MODEL, mood, journal);

    if (!result.ok && PRIMARY_MODEL !== FALLBACK_MODEL) {
      console.warn(`⚠️ Primary model (${PRIMARY_MODEL}) failed. Trying fallback: ${FALLBACK_MODEL}...`);
      result = await requestGroqChat(FALLBACK_MODEL, mood, journal);
    }

    if (!result.ok) {
      console.error("❌ Groq API error response:", result.data);
      return res.status(result.status || 500).json({
        error: "Groq API error",
        details: result.data?.error?.message || result.data,
      });
    }

    const reflection =
      result.data?.choices?.[0]?.message?.content || "No reflection generated";

    console.log("✅ Generated reflection successfully");

    return res.json({
      reflection,
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({
      error: "Reflection failed",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
