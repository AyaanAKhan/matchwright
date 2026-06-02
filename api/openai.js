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

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const payload = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(401).json({ error: "Missing OPENAI_API_KEY on the server" });
      return;
    }

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        input: [{ role: "user", content: toOpenAIContent(payload.content) }],
        max_output_tokens: payload.max_tokens || 4000,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.error?.message || "OpenAI request failed" });
      return;
    }

    res.status(200).json({ content: [{ type: "text", text: responseText(data) }] });
  } catch (error) {
    res.status(500).json({ error: error.message || "Proxy error" });
  }
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "30mb",
    },
  },
};
