import "dotenv/config";
import express from "express";
import { Agent, CursorAgentError } from "@cursor/sdk";

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.AGENT_SDK_PORT || 8787);
const API_KEY = process.env.CURSOR_API_KEY;
const DEFAULT_CWD = process.env.AGENT_SDK_CWD || process.cwd();
const MODEL_ID = process.env.CURSOR_MODEL_ID || "composer-2";

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "hackhub-agent-sdk" });
});

app.post("/agent/prompt", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ detail: "CURSOR_API_KEY is not configured" });
  }

  const prompt = req.body?.prompt;
  const cwd = req.body?.cwd || DEFAULT_CWD;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ detail: "prompt is required" });
  }

  try {
    const result = await Agent.prompt(prompt, {
      apiKey: API_KEY,
      model: { id: MODEL_ID },
      local: { cwd }
    });

    if (result.status === "error") {
      return res.status(422).json({
        detail: "Agent run failed",
        status: result.status,
        runId: result.id
      });
    }

    return res.json({
      status: result.status,
      runId: result.id,
      output: result.result || ""
    });
  } catch (error) {
    if (error instanceof CursorAgentError) {
      return res.status(502).json({
        detail: "Cursor SDK startup failed",
        message: error.message,
        retryable: error.isRetryable
      });
    }
    return res.status(500).json({ detail: "Unexpected agent error", message: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`HackHub Agent SDK service listening on http://localhost:${PORT}`);
});
