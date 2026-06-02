# Matchwright

Matchwright is an OpenAI-powered resume tailoring app that:

- Scores a resume against a job description like a senior recruiter.
- Rewrites role-relevant bullets with the Google XYZ formula.
- Preserves an existing LaTeX layout when users upload or paste `.tex` source.
- Reads PDF resumes when source LaTeX is not available.
- Generates a tailored LaTeX resume, PDF/DOCX exports, and a matching cover letter.

The app is built with Vite, React, and a server-side OpenAI proxy.

## Why Not Browser-Only?

Resume tailoring requires model calls. A public website cannot safely put an API key in frontend JavaScript, so Matchwright uses `/api/openai` as a backend route. Visitors do not need their own API key, but the deployed site owner pays for OpenAI usage.

Before sharing publicly, add authentication, usage limits, or a credit/payment system if you do not want open-ended API spend.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `OPENAI_API_KEY` in `.env`.

Optional:

```bash
OPENAI_MODEL=gpt-5.5
```

The default model is `gpt-5.4-mini` to keep costs lower. Use `gpt-5.5` for stronger reasoning and writing quality.

## Deploy To Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` optional, defaults to `gpt-5.4-mini`
4. Deploy.

Vercel uses:

- `npm run build`
- `dist` as the static output
- `api/openai.js` as the serverless OpenAI proxy

## Resume Layout Notes

For exact layout preservation, use `.tex` input. PDFs can be read by the model, but they do not contain the original LaTeX source, macros, or spacing commands.

## Safety Notes

Matchwright is designed to improve truthful positioning, not fabricate credentials. The prompt explicitly tells the model not to invent employers, dates, degrees, certifications, tools, or metrics that are not supported by the resume.
