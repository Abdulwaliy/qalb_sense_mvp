import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ---------------- Middleware ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- Health Check ---------------- */
app.get("/", (req, res) => {
  res.send("QalbSense backend is alive 🧠");
});

/* ---------------- Reflection Route ---------------- */
app.post("/api/reflection", async (req, res) => {
  console.log("🔥 Reflection route HIT");

  try {
    const { mood, journal } = req.body;

    /* ---------------- Input validation ---------------- */
    if (!mood || !journal) {
      return res.status(400).json({
        error: "Mood and journal are required",
      });
    }

    /* ---------------- API key check ---------------- */
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY in .env",
      });
    }

    console.log("🌐 Sending request to Groq...");

    /* ---------------- Groq API Call ---------------- */
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a calm, emotionally intelligent Islamic reflection assistant. Be gentle, structured, and supportive.",
            },
            {
              role: "user",
              content: `
Mood: ${mood}

Journal:
${journal}

Return a structured reflection:

1. Emotional Mirror
2. Insight
3. Reframe
4. Action Step
5. Spiritual Reminder (light and gentle)
              `,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    /* ---------------- DEBUG: raw response ---------------- */
    const rawText = await response.text();
    console.log("🔴 RAW GROQ RESPONSE:", rawText);

    /* ---------------- Handle invalid JSON ---------------- */
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      return res.status(500).json({
        error: "Groq returned invalid JSON",
        raw: rawText,
      });
    }

    /* ---------------- Handle API errors ---------------- */
    if (!response.ok) {
      return res.status(500).json({
        error: "Groq API error",
        details: data,
      });
    }

    /* ---------------- Extract reflection safely ---------------- */
    const reflection =
      data?.choices?.[0]?.message?.content ||
      "No reflection generated";

    return res.json({ reflection });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);

    return res.status(500).json({
      error: "Reflection failed",
      details: err.message,
    });
  }
});

/* ---------------- Start Server ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});