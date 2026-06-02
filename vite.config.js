import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 30_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function toOpenAIContent(content) {
  if (typeof content === "string") return [{ type: "input_text", text: content }];
  return (content || []).map((part) => {
    if (part.type === "text") return { type: "input_text", text: part.text || "" };
    if (part.type === "document") {
      return {
        type: "input_file",
        filename: part.filename || "resume.pdf",
        file_data: part.source?.data || "",
      };
    }
    return { type: "input_text", text: JSON.stringify(part) };
  });
}

function responseText(data) {
  if (data.output_text) return data.output_text;
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((item) => item.text || item.output_text || "")
    .filter(Boolean)
    .join("\n");
}

async function handleOpenAI(req, res, env) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method not allowed");
    return;
  }

  try {
    const payload = JSON.parse(await readBody(req));
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing OPENAI_API_KEY on the server" }));
      return;
    }

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5.4-mini",
        input: [{ role: "user", content: toOpenAIContent(payload.content) }],
        max_output_tokens: payload.max_tokens || 4000,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: data.error?.message || "OpenAI request failed" }));
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ content: [{ type: "text", text: responseText(data) }] }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Proxy error" }));
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      {
        name: "openai-api-proxy",
        configureServer(server) {
          server.middlewares.use("/api/openai", (req, res) => handleOpenAI(req, res, env));
        },
      },
    ],
    server: {
      host: "127.0.0.1",
    },
  };
});
