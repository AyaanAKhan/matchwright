import React, { useState, useRef, useCallback } from "react";
import {
  Upload, FileText, Code2, Sparkles, Download, Copy, Check, Loader2, Wand2,
  AlertTriangle, ScanLine, UserCheck, ExternalLink, X, Mail, TrendingUp, FileType,
} from "lucide-react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,900&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
* { box-sizing:border-box; margin:0; padding:0; }
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes rise { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
.rt-root {
  --paper:#ffffff; --cream:#f4f7f5; --cream-2:#e7eef0; --ink:#14201d; --ink-soft:#47524e;
  --muted:#78847f; --accent:#0f8b8d; --accent-dark:#0a6769; --line:#d5dedc; --green:#2f855a; --amber:#b7791f;
  font-family:'Hanken Grotesk',sans-serif; background:linear-gradient(135deg,#f7faf7 0%,#eef4f6 56%,#fff5ee 100%); color:var(--ink); min-height:100vh; width:100%;
  background-attachment:fixed;
}
.rt-wrap { max-width:1180px; margin:0 auto; padding:40px 24px 90px; }
.rt-eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.rt-title { font-family:'Fraunces',serif; font-weight:900; font-size:clamp(34px,6vw,60px); line-height:0.96; letter-spacing:-0.02em; }
.rt-title em { font-style:italic; color:var(--accent); }
.rt-sub { margin-top:14px; max-width:610px; color:var(--ink-soft); font-size:15px; line-height:1.55; }
.rt-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:34px; }
@media (max-width:760px){ .rt-grid{ grid-template-columns:1fr; } }
.rt-card { background:var(--paper); border:1px solid var(--line); border-radius:4px; box-shadow:0 1px 0 rgba(33,31,27,0.04), 0 18px 40px -28px rgba(33,31,27,0.4); }
.rt-field { padding:18px; display:flex; flex-direction:column; height:100%; }
.rt-label { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.rt-num { color:var(--accent); font-weight:500; }
.rt-modes { display:flex; border:1px solid var(--line); border-radius:3px; overflow:hidden; margin-bottom:12px; }
.rt-mode { flex:1; font-family:'Hanken Grotesk',sans-serif; font-weight:600; font-size:13px; background:#fffdf8; border:none; cursor:pointer; color:var(--muted); padding:10px 12px; display:inline-flex; align-items:center; justify-content:center; gap:7px; }
.rt-mode + .rt-mode { border-left:1px solid var(--line); }
.rt-mode.active { background:var(--accent); color:#fff5ef; }
.rt-mode-note { font-size:11.5px; color:var(--muted); margin-bottom:10px; line-height:1.5; }
.rt-mode-note b { color:var(--ink-soft); }
.rt-pills { margin-top:18px; display:flex; gap:8px; flex-wrap:wrap; }
.rt-pill { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--ink-soft); background:rgba(255,255,255,.72); border:1px solid var(--line); border-radius:100px; padding:6px 10px; }
.rt-drop { border:1.5px dashed var(--line); border-radius:4px; background:#fffdf8; padding:30px; text-align:center; cursor:pointer; transition:border-color .15s, background .15s; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:210px; }
.rt-drop:hover, .rt-drop.drag { border-color:var(--accent); background:#fff8f4; }
.rt-drop svg { color:var(--accent); }
.rt-drop .t { font-weight:600; font-size:14px; margin-top:12px; }
.rt-drop .s { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted); margin-top:6px; }
.rt-loaded { display:flex; align-items:center; gap:10px; background:#fffdf8; border:1px solid var(--line); border-radius:4px; padding:14px; }
.rt-loaded .name { font-family:'JetBrains Mono',monospace; font-size:12.5px; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rt-loaded .ok { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--green); }
.rt-loaded button { background:none; border:none; cursor:pointer; color:var(--muted); display:flex; }
.rt-loaded button:hover { color:var(--accent); }
textarea.rt-input { width:100%; flex:1; min-height:210px; resize:vertical; border:1px solid var(--line); border-radius:3px; background:#fffdf8; padding:14px; font-family:'JetBrains Mono',monospace; font-size:12.5px; line-height:1.6; color:var(--ink); outline:none; }
textarea.rt-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(182,69,44,0.12); }
textarea.rt-input::placeholder { color:#b3aa98; }
.rt-actionbar { margin-top:22px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.rt-btn { font-family:'Hanken Grotesk',sans-serif; font-weight:600; font-size:15px; border:none; cursor:pointer; border-radius:3px; padding:14px 26px; display:inline-flex; align-items:center; gap:10px; transition:transform .12s, background .12s; }
.rt-btn:active { transform:translateY(1px); }
.rt-btn-primary { background:var(--accent); color:#fff5ef; }
.rt-btn-primary:hover { background:var(--accent-dark); }
.rt-btn-primary:disabled { background:#cbbfae; color:#f3eee2; cursor:not-allowed; }
.rt-btn-ghost { background:transparent; color:var(--ink); border:1px solid var(--line); font-size:13px; padding:9px 14px; font-weight:500; }
.rt-btn-ghost:hover { background:var(--cream-2); }
.rt-hint { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted); }
.rt-error { margin-top:18px; padding:14px 16px; border-radius:3px; background:#fbeae5; border:1px solid #e6b3a6; color:var(--accent-dark); display:flex; gap:10px; align-items:flex-start; font-size:13.5px; line-height:1.5; }
.rt-results { margin-top:42px; animation:rise .4s ease both; }
.rt-hero { display:grid; grid-template-columns:auto 1fr; gap:28px; align-items:center; background:var(--paper); border:1px solid var(--line); border-radius:4px; padding:26px 28px; box-shadow:0 18px 40px -30px rgba(33,31,27,0.5); }
@media (max-width:620px){ .rt-hero{ grid-template-columns:1fr; text-align:center; justify-items:center; } }
.rt-gauge-wrap { position:relative; width:140px; height:140px; }
.rt-gauge-num { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.rt-gauge-num .n { font-family:'Fraunces',serif; font-weight:900; font-size:42px; line-height:1; }
.rt-gauge-num .o { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.1em; color:var(--muted); margin-top:3px; }
.rt-hero-co { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--accent); }
.rt-hero-role { font-family:'Fraunces',serif; font-size:24px; font-weight:600; margin:4px 0 6px; line-height:1.1; }
.rt-climb { display:inline-flex; align-items:center; gap:7px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--green); background:#eaf1ec; border:1px solid #bcd4c2; border-radius:100px; padding:3px 10px; margin-bottom:8px; }
.rt-hero-verdict { font-size:14.5px; line-height:1.6; color:var(--ink-soft); }
.rt-tabs { display:flex; gap:4px; border-bottom:2px solid var(--line); margin-top:30px; flex-wrap:wrap; }
.rt-tab { font-family:'Hanken Grotesk',sans-serif; font-weight:600; font-size:14px; background:none; border:none; cursor:pointer; color:var(--muted); padding:12px 16px; display:inline-flex; align-items:center; gap:8px; border-bottom:2px solid transparent; margin-bottom:-2px; }
.rt-tab:hover { color:var(--ink); }
.rt-tab.active { color:var(--accent); border-bottom-color:var(--accent); }
.rt-panel { background:var(--paper); border:1px solid var(--line); border-top:none; padding:26px; }
.rt-block { margin-bottom:24px; } .rt-block:last-child { margin-bottom:0; }
.rt-block h4 { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.rt-li { list-style:none; display:flex; flex-direction:column; gap:9px; }
.rt-li li { display:flex; gap:10px; font-size:14px; line-height:1.55; color:var(--ink-soft); }
.rt-li li svg { flex-shrink:0; margin-top:3px; }
.rt-flag { border:1px solid var(--line); border-left:3px solid var(--accent); border-radius:3px; padding:13px 15px; margin-bottom:10px; background:#fffdf8; }
.rt-flag .issue { font-weight:600; font-size:14px; display:flex; gap:8px; align-items:flex-start; }
.rt-flag .issue svg { color:var(--accent); flex-shrink:0; margin-top:2px; }
.rt-flag .fix { font-size:13.5px; color:var(--ink-soft); margin-top:6px; line-height:1.55; padding-left:24px; }
.rt-flag .fix b { color:var(--green); font-weight:600; }
.rt-skip { border:1px solid var(--line); border-radius:3px; padding:13px 15px; margin-bottom:10px; background:#fffdf8; }
.rt-skip .sec { font-weight:700; font-size:13px; text-transform:uppercase; letter-spacing:0.04em; }
.rt-skip .why { font-size:13.5px; color:var(--ink-soft); margin-top:5px; line-height:1.55; }
.rt-chips { display:flex; flex-wrap:wrap; gap:7px; }
.rt-chip { font-family:'JetBrains Mono',monospace; font-size:11px; background:var(--cream-2); border:1px solid var(--line); border-radius:100px; padding:4px 11px; color:var(--ink-soft); }
.rt-chip.now { background:#eaf1ec; border-color:#bcd4c2; color:var(--green); }
.rt-code { background:#1c1a17; color:#e8e3d6; border-radius:3px; padding:18px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.55; white-space:pre; overflow:auto; max-height:520px; }
.rt-panel-bar { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:18px; align-items:center; }
.rt-letter { background:#fff; border:1px solid var(--line); border-radius:3px; padding:40px 46px; color:#1a1a1a; max-width:680px; font-family:'Times New Roman', Times, serif; }
.rt-letter .nm { font-size:21px; font-weight:700; }
.rt-letter .meta { font-size:13.5px; color:#333; margin:16px 0 20px; line-height:1.5; }
.rt-letter p { font-size:14.5px; line-height:1.7; margin-bottom:14px; }
.rt-loading { display:flex; flex-direction:column; align-items:center; gap:14px; padding:64px 20px; color:var(--muted); }
.rt-loading svg { color:var(--accent); animation:spin 1s linear infinite; }
.rt-loading .t { font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.06em; }
.rt-callout { margin-top:18px; background:var(--cream-2); border:1px solid var(--line); border-radius:3px; padding:13px 15px; font-size:13px; line-height:1.55; color:var(--ink-soft); }
.rt-callout b { color:var(--ink); }
.rt-toast { position:fixed; bottom:26px; left:50%; transform:translateX(-50%); background:var(--ink); color:var(--paper); padding:11px 18px; border-radius:4px; font-size:13px; font-weight:500; display:flex; align-items:center; gap:8px; z-index:50; box-shadow:0 12px 30px -12px rgba(0,0,0,0.5); }
.rt-foot { margin-top:50px; text-align:center; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted); line-height:1.7; }
`;

/* ---------- API ---------- */
async function callOpenAI(content, maxTokens) {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, max_tokens: maxTokens || 4000 }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err.error ? `: ${err.error}` : "";
    } catch (e) {
      detail = "";
    }
    throw new Error(`OpenAI API ${res.status}${detail}`);
  }
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}
function parseJSON(text) {
  let t = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s !== -1 && e !== -1) t = t.slice(s, e + 1);
  return JSON.parse(t);
}
function between(text, a, b) { const i = text.indexOf(a), j = text.indexOf(b); if (i === -1 || j === -1) return ""; return text.slice(i + a.length, j).trim(); }

/* ---------- clipboard (with sandbox fallback) ---------- */
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    const fallback = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.top = "0"; ta.style.left = "0"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.focus(); ta.select();
        ta.setSelectionRange(0, text.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("execCommand failed"));
      } catch (e) { reject(e); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(resolve).catch(fallback);
    } else { fallback(); }
  });
}

/* ---------- CDN loaders ---------- */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(s);
  });
}
async function ensureJsPDF() {
  if (!window.jspdf) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  return window.jspdf.jsPDF;
}
async function ensureJSZip() {
  if (!window.JSZip) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  return window.JSZip;
}

/* ---------- DOCX (true .docx via OOXML zip, Times New Roman) ---------- */
function x(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function run(text, o = {}) {
  const sz = o.size || 24;
  return `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>${o.bold ? "<w:b/>" : ""}${o.italic ? "<w:i/>" : ""}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${x(text)}</w:t></w:r>`;
}
function para(inner, o = {}) {
  const after = o.after == null ? 120 : o.after;
  const pPr = `<w:pPr>${o.align ? `<w:jc w:val="${o.align}"/>` : ""}<w:spacing w:after="${after}" w:line="${o.line || 264}" w:lineRule="auto"/>${o.border ? '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="auto"/></w:pBdr>' : ""}${o.ind ? `<w:ind w:left="${o.ind}"/>` : ""}</w:pPr>`;
  return `<w:p>${pPr}${inner || ""}</w:p>`;
}
const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
const DOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
function docWrap(body, margin) {
  const m = margin || 1080;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="${m}" w:right="${m}" w:bottom="${m}" w:left="${m}" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}
async function makeDocxBlob(body, margin) {
  const JSZip = await ensureJSZip();
  const zip = new JSZip();
  zip.file("[Content_Types].xml", CONTENT_TYPES);
  zip.folder("_rels").file(".rels", DOT_RELS);
  zip.folder("word").file("document.xml", docWrap(body, margin));
  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
function resumeDocxBody(d) {
  let b = "";
  b += para(run((d.name || "").toUpperCase(), { bold: true, size: 36 }), { align: "center", after: 40 });
  if (d.contact) b += para(run(d.contact, { size: 20 }), { align: "center", after: 160 });
  const heading = (t) => para(run(t.toUpperCase(), { bold: true, size: 24 }), { after: 60, border: true });
  const bullet = (t) => para(run("\u2022  " + t, { size: 21 }), { after: 30, ind: 240, line: 252 });
  if (d.summary) { b += heading("Summary"); b += para(run(d.summary, { size: 21 }), { after: 140, line: 252 }); }
  if (d.skills && d.skills.length) { b += heading("Technical Skills"); d.skills.forEach((s) => { b += para(run((s.category || "") + ": ", { bold: true, size: 21 }) + run(s.items || "", { size: 21 }), { after: 40, line: 252 }); }); }
  if (d.experience && d.experience.length) {
    b += heading("Experience");
    d.experience.forEach((e) => {
      b += para(run(e.title || "", { bold: true, size: 22 }) + (e.dates ? run("   \u2014   " + e.dates, { size: 20 }) : ""), { after: 20 });
      const sub = [e.company, e.location].filter(Boolean).join(", ");
      if (sub) b += para(run(sub, { italic: true, size: 21 }), { after: 40 });
      (e.bullets || []).forEach((x2) => (b += bullet(x2)));
      b += para("", { after: 80 });
    });
  }
  if (d.projects && d.projects.length) {
    b += heading("Projects");
    d.projects.forEach((p) => {
      b += para(run(p.name || "", { bold: true, size: 22 }) + (p.meta ? run("   \u2014   " + p.meta, { italic: true, size: 20 }) : ""), { after: 20 });
      (p.bullets || []).forEach((x2) => (b += bullet(x2)));
      b += para("", { after: 80 });
    });
  }
  if (d.education && d.education.length) {
    b += heading("Education");
    d.education.forEach((ed) => {
      b += para(run(ed.school || "", { bold: true, size: 22 }) + (ed.dates ? run("   \u2014   " + ed.dates, { size: 20 }) : ""), { after: 20 });
      const sub = [ed.degree, ed.location].filter(Boolean).join(", ");
      if (sub) b += para(run(sub, { italic: true, size: 21 }), { after: 80 });
    });
  }
  return b;
}
function coverDocxBody(c) {
  let b = "";
  b += para(run(c.candidateName || "", { bold: true, size: 32 }), { after: 280 });
  if (c.company) b += para(run(c.company, { size: 24 }), { after: 120 });
  const greeting = c.hiringManager ? `Dear ${c.hiringManager},` : "Dear Hiring Manager,";
  b += para(run(greeting, { size: 24 }), { after: 160 });
  (c.paragraphs || []).forEach((p) => (b += para(run(p, { size: 24 }), { after: 180, line: 300 })));
  b += para(run("Sincerely,", { size: 24 }), { after: 40 });
  b += para(run(c.candidateName || "", { size: 24 }), { after: 40 });
  return b;
}

/* ---------- PDF (jsPDF, built-in Times) ---------- */
async function resumePdfDoc(d) {
  const JsPDF = await ensureJsPDF();
  const doc = new JsPDF({ unit: "pt", format: "letter" });
  const M = 54, PW = doc.internal.pageSize.getWidth(), PH = doc.internal.pageSize.getHeight(), W = PW - M * 2;
  let y = 60;
  const ensure = (h) => { if (y + h > PH - M) { doc.addPage(); y = 60; } };
  doc.setFont("times", "bold"); doc.setFontSize(20);
  doc.text((d.name || "").toUpperCase(), PW / 2, y, { align: "center" }); y += 18;
  doc.setFont("times", "normal"); doc.setFontSize(10);
  if (d.contact) { doc.text(d.contact, PW / 2, y, { align: "center" }); y += 16; }
  const section = (t) => { ensure(28); y += 8; doc.setFont("times", "bold"); doc.setFontSize(12); doc.text(t.toUpperCase(), M, y); y += 5; doc.setLineWidth(0.9); doc.line(M, y, PW - M, y); y += 14; };
  const bullets = (arr) => { doc.setFont("times", "normal"); doc.setFontSize(10.5); (arr || []).forEach((bx) => { const ls = doc.splitTextToSize("\u2022  " + bx, W - 14); ensure(ls.length * 13); doc.text(ls, M + 12, y); y += ls.length * 13 + 3; }); };
  if (d.summary) { section("Summary"); doc.setFont("times", "normal"); doc.setFontSize(10.5); const ls = doc.splitTextToSize(d.summary, W); ensure(ls.length * 13); doc.text(ls, M, y); y += ls.length * 13 + 4; }
  if (d.skills && d.skills.length) { section("Technical Skills"); doc.setFontSize(10.5); d.skills.forEach((s) => { const line = `${s.category || ""}: ${s.items || ""}`; const ls = doc.splitTextToSize(line, W); ensure(ls.length * 13); doc.setFont("times", "bold"); const cat = (s.category || "") + ": "; doc.text(cat, M, y); const cw = doc.getTextWidth(cat); doc.setFont("times", "normal"); const rest = doc.splitTextToSize(s.items || "", W - cw); doc.text(rest[0] || "", M + cw, y); if (rest.length > 1) { doc.text(rest.slice(1), M, y + 13); y += (rest.length - 1) * 13; } y += 14; }); }
  if (d.experience && d.experience.length) { section("Experience"); d.experience.forEach((e) => { ensure(34); doc.setFont("times", "bold"); doc.setFontSize(11); doc.text(e.title || "", M, y); if (e.dates) { doc.setFont("times", "normal"); doc.setFontSize(10); doc.text(e.dates, PW - M, y, { align: "right" }); } y += 14; const sub = [e.company, e.location].filter(Boolean).join(", "); if (sub) { doc.setFont("times", "italic"); doc.setFontSize(10.5); doc.text(sub, M, y); y += 13; } bullets(e.bullets); y += 6; }); }
  if (d.projects && d.projects.length) { section("Projects"); d.projects.forEach((p) => { ensure(28); doc.setFont("times", "bold"); doc.setFontSize(11); doc.text(p.name || "", M, y); if (p.meta) { doc.setFont("times", "italic"); doc.setFontSize(10); doc.text(p.meta, PW - M, y, { align: "right" }); } y += 14; bullets(p.bullets); y += 6; }); }
  if (d.education && d.education.length) { section("Education"); d.education.forEach((ed) => { ensure(28); doc.setFont("times", "bold"); doc.setFontSize(11); doc.text(ed.school || "", M, y); if (ed.dates) { doc.setFont("times", "normal"); doc.setFontSize(10); doc.text(ed.dates, PW - M, y, { align: "right" }); } y += 14; const sub = [ed.degree, ed.location].filter(Boolean).join(", "); if (sub) { doc.setFont("times", "italic"); doc.setFontSize(10.5); doc.text(sub, M, y); y += 14; } }); }
  return doc;
}
async function coverPdfDoc(c) {
  const JsPDF = await ensureJsPDF();
  const doc = new JsPDF({ unit: "pt", format: "letter" });
  const M = 72, PW = doc.internal.pageSize.getWidth(), W = PW - M * 2;
  let y = 78;
  doc.setFont("times", "bold"); doc.setFontSize(16); doc.text(c.candidateName || "", M, y); y += 30;
  doc.setFont("times", "normal"); doc.setFontSize(11.5);
  if (c.company) { doc.text(c.company, M, y); y += 22; }
  const greeting = c.hiringManager ? `Dear ${c.hiringManager},` : "Dear Hiring Manager,";
  doc.text(greeting, M, y); y += 22;
  (c.paragraphs || []).forEach((p) => { const ls = doc.splitTextToSize(p, W); doc.text(ls, M, y, { lineHeightFactor: 1.5 }); y += ls.length * 17 + 12; });
  y += 4; doc.text("Sincerely,", M, y); y += 18; doc.text(c.candidateName || "", M, y);
  return doc;
}

/* ---------- Prompts ---------- */
const SCHEMA = `{
 "company": "detected company name or empty string",
 "role": "detected role title or empty string",
 "matchScore": 0,
 "projectedScore": 0,
 "scoreRationale": "one or two sentences explaining the scores",
 "recruiterVerdict": "3-4 sentences as a senior recruiter for THIS role: how strong a fit this becomes after tailoring and why",
 "strengths": ["concrete strengths relevant to this role"],
 "redFlags": [ { "issue": "a red flag a recruiter would notice in the original", "fix": "how the rewrite addresses it" } ],
 "skippedSections": [ { "section": "a section a manager skimming 200 resumes would skip", "why": "why their eye slides past it and what makes them stop" } ],
 "missingKeywords": ["job-description keywords now woven into the tailored resume"]
}`;
const analysisHeader = `You are a SENIOR TECHNICAL RECRUITER at the exact company in the job description, and you run the ATS filter while skimming 200+ resumes per sitting. "matchScore" = honest score of the resume as-is. "projectedScore" = realistic score after aggressively tailoring it truthfully to this role (should be high). Be specific.
Return ONLY valid JSON, no markdown, in this exact shape:
${SCHEMA}`;
const tailorGoal = `GOAL: position this candidate as the strongest possible match for THIS exact role and push the fit as close to perfect as the truth allows. Reframe every relevant bullet in the role's language, naturally include the job description's exact terminology and tools wherever the candidate has the underlying experience, lead with the most role-relevant work, and cut or downplay anything irrelevant. Do not copy the job description wholesale into the resume unless it accurately describes the candidate's real experience.
TRUTH GUARDRAIL: do not invent employers, titles, dates, degrees, certifications, or fabricate metrics with no basis in the resume. Everything must survive an interview and a background check.`;
const rewriteRulesLatex = `Return the SAME LaTeX with the LAYOUT UNCHANGED: identical documentclass, packages, macros, section order, environments, spacing commands. Do not add/remove/reorder sections or change any command. Change only the natural-language TEXT. Preserve all LaTeX escaping.`;
const rewriteTemplatePdf = `The resume is attached as a PDF (no LaTeX source), so build a clean, ATS-friendly, single-column LaTeX resume that compiles in Overleaf using ONLY these packages:
\\documentclass[letterpaper,11pt]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}
Centered name + contact header, \\section* headings with a title rule, tight itemize bullets. Section order: Summary (only if present originally), Technical Skills, Experience, Projects, Education. Pull name, contact, employers, titles, dates, education from the PDF.`;
const contentRules = `WRITING RULES:
- Rewrite EXPERIENCE and PROJECT bullets with the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]." Lead with the result.
- One or two lines per bullet. ATS-friendly. No em dashes. No corporate filler. Strong action verbs.

OUTPUT FORMAT (exactly this, nothing else):
===BEGIN_LATEX===
<full tailored LaTeX document>
===END_LATEX===
===BEGIN_JSON===
{ "name":"", "contact":"one line: email | phone | location | links", "summary":"", "skills":[{"category":"","items":"comma separated"}], "experience":[{"title":"","company":"","location":"","dates":"","bullets":[""]}], "projects":[{"name":"","meta":"tech | dates","bullets":[""]}], "education":[{"school":"","degree":"","location":"","dates":""}] }
===END_JSON===
===BEGIN_CHANGES===
- one short line per meaningful rewrite
===END_CHANGES===
The JSON must contain the SAME tailored content as the LaTeX.`;
const coverHeader = `Write a cover letter that positions this candidate as the ideal hire. 3-4 short paragraphs. Open with a specific hook about the company or role. Ground every claim in the candidate's real experience, never invent anything. Confident, human, direct. No em dashes, no corporate filler. Detect the company, role, hiring manager (empty string if absent), and candidate name.
Return ONLY JSON: { "candidateName":"", "company":"", "role":"", "hiringManager":"", "paragraphs":["","",""] }`;

function openInOverleaf(latex) {
  const form = document.createElement("form");
  form.method = "POST"; form.action = "https://www.overleaf.com/docs"; form.target = "_blank";
  const snip = document.createElement("textarea"); snip.name = "snip"; snip.value = latex; snip.style.display = "none"; form.appendChild(snip);
  const nm = document.createElement("input"); nm.type = "hidden"; nm.name = "snip_name"; nm.value = "resume.tex"; form.appendChild(nm);
  document.body.appendChild(form); form.submit(); document.body.removeChild(form);
}

function ScoreGauge({ score }) {
  const r = 58, c = 2 * Math.PI * r, pct = Math.max(0, Math.min(100, score)) / 100;
  const color = score >= 75 ? "var(--green)" : score >= 50 ? "var(--amber)" : "var(--accent)";
  return (
    <div className="rt-gauge-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--cream-2)" strokeWidth="11" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 70 70)" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="rt-gauge-num"><span className="n" style={{ color }}>{score}</span><span className="o">/ 100 MATCH</span></div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("pdf");
  const [pdfData, setPdfData] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [latexSrc, setLatexSrc] = useState("");
  const [jd, setJd] = useState("");
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [newTex, setNewTex] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [changes, setChanges] = useState([]);
  const [cover, setCover] = useState(null);
  const [tab, setTab] = useState("recruiter");
  const [toast, setToast] = useState("");
  const fileInput = useRef(null);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2200); };

  const readResumeFile = useCallback((file) => {
    if (!file) return;
    if (/\.tex$/i.test(file.name)) {
      setError("");
      const reader = new FileReader();
      reader.onload = (e) => { setMode("latex"); setLatexSrc(String(e.target.result || "")); setPdfData(""); setPdfName(file.name); };
      reader.readAsText(file);
      return;
    }
    if (file.type && file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) { setError("Please upload a PDF or .tex file."); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => { const b64 = String(e.target.result || "").split(",")[1] || ""; setPdfData(b64); setPdfName(file.name); };
    reader.readAsDataURL(file);
  }, []);
  const onDrop = (e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) readResumeFile(f); };

  const generate = async () => {
    setError(""); setLoading(true); setReport(null); setNewTex(""); setResumeData(null); setChanges([]); setCover(null);
    try {
      let analysisContent, rewriteContent, coverContent;
      if (mode === "pdf") {
        const doc = { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfData } };
        analysisContent = [doc, { type: "text", text: `${analysisHeader}\n\nThe resume is attached as a PDF.\n\n=== JOB DESCRIPTION ===\n${jd}` }];
        rewriteContent = [doc, { type: "text", text: `Tailor the attached resume to the job below.\n\n${tailorGoal}\n\n${rewriteTemplatePdf}\n\n${contentRules}\n\n=== JOB DESCRIPTION ===\n${jd}` }];
        coverContent = [doc, { type: "text", text: `${coverHeader}\n\nThe candidate's resume is attached as a PDF.\n\n=== JOB DESCRIPTION ===\n${jd}` }];
      } else {
        analysisContent = `${analysisHeader}\n\n=== RESUME (LaTeX) ===\n${latexSrc}\n\n=== JOB DESCRIPTION ===\n${jd}`;
        rewriteContent = `Tailor the LaTeX resume below to the job.\n\n${tailorGoal}\n\n${rewriteRulesLatex}\n\n${contentRules}\n\n=== RESUME (LaTeX) ===\n${latexSrc}\n\n=== JOB DESCRIPTION ===\n${jd}`;
        coverContent = `${coverHeader}\n\n=== RESUME (LaTeX) ===\n${latexSrc}\n\n=== JOB DESCRIPTION ===\n${jd}`;
      }
      const [aRaw, rRaw, cRaw] = await Promise.all([
        callOpenAI(analysisContent, 3000),
        callOpenAI(rewriteContent, 8000),
        callOpenAI(coverContent, 2000),
      ]);
      const rep = parseJSON(aRaw);
      let t = between(rRaw, "===BEGIN_LATEX===", "===END_LATEX===");
      if (!t) t = rRaw.replace(/```latex/gi, "").replace(/```/g, "").trim();
      let rData = null;
      const jsonBlock = between(rRaw, "===BEGIN_JSON===", "===END_JSON===");
      if (jsonBlock) { try { rData = parseJSON(jsonBlock); } catch (e) { rData = null; } }
      const chBlock = between(rRaw, "===BEGIN_CHANGES===", "===END_CHANGES===");
      const ch = chBlock.split("\n").map((l) => l.replace(/^[-*]\s?/, "").trim()).filter(Boolean);
      const cl = parseJSON(cRaw);
      setReport(rep); setNewTex(t); setResumeData(rData); setChanges(ch); setCover(cl); setTab("recruiter");
    } catch (e) {
      console.error(e);
      setError(`${e.message || "Generation failed"}. Configure OPENAI_API_KEY on the server, then try again. If the PDF is large, use Paste LaTeX mode for the best layout-preserving result.`);
    } finally { setLoading(false); }
  };

  const copyText = (t, label) => { copyToClipboard(t).then(() => showToast(`${label} copied`)).catch(() => showToast("Copy failed, select and copy manually")); };
  const saveBlob = (blob, filename, label) => { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); showToast(`${label} downloaded`); };

  const dlResumePdf = async () => { if (!resumeData) return showToast("No resume content"); try { const doc = await resumePdfDoc(resumeData); doc.save("resume-tailored.pdf"); showToast("Resume PDF downloaded"); } catch (e) { console.error(e); showToast("PDF export failed"); } };
  const dlResumeDocx = async () => { if (!resumeData) return showToast("No resume content"); try { const blob = await makeDocxBlob(resumeDocxBody(resumeData), 1080); saveBlob(blob, "resume-tailored.docx", "Resume .docx"); } catch (e) { console.error(e); showToast(".docx export failed"); } };
  const dlCoverPdf = async () => { try { const doc = await coverPdfDoc(cover); doc.save("cover-letter.pdf"); showToast("Cover letter PDF downloaded"); } catch (e) { console.error(e); showToast("PDF export failed"); } };
  const dlCoverDocx = async () => { try { const blob = await makeDocxBlob(coverDocxBody(cover), 1440); saveBlob(blob, "cover-letter.docx", "Cover letter .docx"); } catch (e) { console.error(e); showToast(".docx export failed"); } };

  const coverPlain = cover ? [cover.hiringManager ? `Dear ${cover.hiringManager},` : "Dear Hiring Manager,", ...(cover.paragraphs || []), `Sincerely,\n${cover.candidateName || ""}`].join("\n\n") : "";
  const canRun = (mode === "pdf" ? pdfData : latexSrc.trim().length > 80) && jd.trim().length > 40 && !loading;

  return (
    <div className="rt-root">
      <style>{STYLE}</style>
      <div className="rt-wrap">
        <header>
          <div className="rt-eyebrow"><Wand2 size={13} /> Matchwright</div>
          <h1 className="rt-title">Matchwright<br /><em>rewrites the resume,</em> not the truth.</h1>
          <p className="rt-sub">Upload a resume and paste a job description. Matchwright scores the fit honestly, rewrites role-relevant bullets with the XYZ formula, preserves LaTeX layouts when you provide .tex source, and drafts the cover letter package.</p>
          <div className="rt-pills">
            <span className="rt-pill">OpenAI-powered backend</span>
            <span className="rt-pill">Honest 0-100 scoring</span>
            <span className="rt-pill">No fabricated experience</span>
          </div>
        </header>

        <div className="rt-grid">
          <div className="rt-card">
            <div className="rt-field">
              <div className="rt-label"><span className="rt-num">01</span> Your resume</div>
              <div className="rt-modes">
                <button className={`rt-mode ${mode === "pdf" ? "active" : ""}`} onClick={() => setMode("pdf")}><FileText size={14} /> Upload file</button>
                <button className={`rt-mode ${mode === "latex" ? "active" : ""}`} onClick={() => setMode("latex")}><Code2 size={14} /> Paste LaTeX</button>
              </div>
              {mode === "pdf" ? (
                <>
                  <div className="rt-mode-note">Upload a PDF for the model to read, or upload a .tex file to preserve the exact LaTeX layout. <b>Best:</b> use .tex when you want only the words changed.</div>
                  {!pdfData ? (
                    <div className={`rt-drop ${drag ? "drag" : ""}`} onClick={() => fileInput.current && fileInput.current.click()} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
                      <Upload size={28} /><div className="t">Drop your resume PDF or .tex here</div><div className="s">.tex preserves layout; .pdf is read by the model</div>
                    </div>
                  ) : (
                    <div className="rt-loaded"><FileText size={18} style={{ color: "var(--accent)" }} /><span className="name">{pdfName}</span><span className="ok">loaded</span><button title="Remove" onClick={() => { setPdfData(""); setPdfName(""); }}><X size={16} /></button></div>
                  )}
                  <input ref={fileInput} type="file" accept="application/pdf,.pdf,.tex,text/x-tex,text/plain" style={{ display: "none" }} onChange={(e) => readResumeFile(e.target.files && e.target.files[0])} />
                </>
              ) : (
                <>
                  <div className="rt-mode-note">Paste your full <b>.tex</b> source. Only the words change; the Overleaf export keeps your layout byte-for-byte.</div>
                  <textarea className="rt-input" placeholder="Paste your entire LaTeX resume source here..." value={latexSrc} onChange={(e) => setLatexSrc(e.target.value)} />
                </>
              )}
            </div>
          </div>
          <div className="rt-card">
            <div className="rt-field">
              <div className="rt-label"><span className="rt-num">02</span> Job description</div>
              <textarea className="rt-input" style={{ minHeight: 280 }} placeholder="Paste the full job posting: company name, role title, requirements, and responsibilities." value={jd} onChange={(e) => setJd(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="rt-actionbar">
          <button className="rt-btn rt-btn-primary" onClick={generate} disabled={!canRun}>
            {loading ? (<><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Tailoring...</>) : (<><Sparkles size={17} /> Generate tailored pack</>)}
          </button>
          {!loading && (<span className="rt-hint">{mode === "pdf" && !pdfData ? "Upload a PDF to start" : mode === "latex" && latexSrc.trim().length <= 80 ? "Paste your LaTeX source" : jd.trim().length <= 40 ? "Paste a job description" : "Resume + cover letter, tailored to the role"}</span>)}
        </div>

        {error ? (<div className="rt-error"><AlertTriangle size={18} /><span>{error}</span></div>) : null}

        {loading ? (<div className="rt-results"><div className="rt-panel" style={{ border: "1px solid var(--line)" }}><div className="rt-loading"><Loader2 size={30} /><div className="t">Scoring the fit, rewriting the resume, drafting the cover letter...</div></div></div></div>) : null}

        {report ? (
          <div className="rt-results">
            <div className="rt-hero">
              <ScoreGauge score={report.projectedScore || report.matchScore || 0} />
              <div>
                {report.company ? <div className="rt-hero-co">{report.company}</div> : null}
                <div className="rt-hero-role">{report.role || "This role"}</div>
                {typeof report.matchScore === "number" && report.projectedScore > report.matchScore ? (<div className="rt-climb"><TrendingUp size={13} /> {report.matchScore} → {report.projectedScore} after tailoring</div>) : null}
                <div className="rt-hero-verdict">{report.recruiterVerdict}</div>
              </div>
            </div>
            <div className="rt-tabs">
              <button className={`rt-tab ${tab === "recruiter" ? "active" : ""}`} onClick={() => setTab("recruiter")}><UserCheck size={15} /> Recruiter report</button>
              <button className={`rt-tab ${tab === "ats" ? "active" : ""}`} onClick={() => setTab("ats")}><ScanLine size={15} /> ATS scan</button>
              <button className={`rt-tab ${tab === "tex" ? "active" : ""}`} onClick={() => setTab("tex")}><FileType size={15} /> Tailored resume</button>
              <button className={`rt-tab ${tab === "cover" ? "active" : ""}`} onClick={() => setTab("cover")}><Mail size={15} /> Cover letter</button>
            </div>
            <div className="rt-panel">
              {tab === "recruiter" && (
                <>
                  {report.strengths?.length ? (<div className="rt-block"><h4><Check size={13} /> What lands</h4><ul className="rt-li">{report.strengths.map((s, i) => (<li key={i}><Check size={15} style={{ color: "var(--green)" }} />{s}</li>))}</ul></div>) : null}
                  {report.redFlags?.length ? (<div className="rt-block"><h4><AlertTriangle size={13} /> Red flags fixed in the rewrite</h4>{report.redFlags.map((f, i) => (<div className="rt-flag" key={i}><div className="issue"><AlertTriangle size={15} />{f.issue}</div><div className="fix"><b>Fix:</b> {f.fix}</div></div>))}</div>) : null}
                </>
              )}
              {tab === "ats" && (
                <>
                  <div className="rt-block"><h4><ScanLine size={13} /> Skimming 200 resumes — where the eye slides past</h4>{(report.skippedSections || []).map((s, i) => (<div className="rt-skip" key={i}><div className="sec">{s.section}</div><div className="why">{s.why}</div></div>))}</div>
                  <div className="rt-block"><h4>Job keywords now woven in</h4><div className="rt-chips">{(report.missingKeywords || []).map((k, i) => (<span className="rt-chip now" key={i}>{k}</span>))}</div></div>
                </>
              )}
              {tab === "tex" && (
                <>
                  <div className="rt-panel-bar">
                    <button className="rt-btn rt-btn-primary" style={{ padding: "10px 18px", fontSize: 13 }} onClick={dlResumePdf}><Download size={14} /> Download PDF</button>
                    <button className="rt-btn rt-btn-ghost" onClick={dlResumeDocx}><FileType size={14} /> Download .docx</button>
                    <button className="rt-btn rt-btn-ghost" onClick={() => openInOverleaf(newTex)}><ExternalLink size={14} /> Open in Overleaf</button>
                    <button className="rt-btn rt-btn-ghost" onClick={() => copyText(newTex, "LaTeX")}><Copy size={14} /> Copy LaTeX</button>
                  </div>
                  {changes.length ? (<div className="rt-block"><h4><Wand2 size={13} /> What I rewrote</h4><ul className="rt-li">{changes.map((c, i) => (<li key={i}><Check size={15} style={{ color: "var(--accent)" }} />{c}</li>))}</ul></div>) : null}
                  <div className="rt-code">{newTex}</div>
                  <div className="rt-callout"><b>PDF / Word</b> download a clean, ready-to-send file directly. <b>Open in Overleaf</b> compiles the LaTeX{mode === "latex" ? ", preserving your exact original layout" : " into a clean PDF"}. Skim the changes before sending.</div>
                </>
              )}
              {tab === "cover" && cover && (
                <>
                  <div className="rt-panel-bar">
                    <button className="rt-btn rt-btn-primary" style={{ padding: "10px 18px", fontSize: 13 }} onClick={dlCoverPdf}><Download size={14} /> Download PDF</button>
                    <button className="rt-btn rt-btn-ghost" onClick={dlCoverDocx}><FileType size={14} /> Download .docx</button>
                    <button className="rt-btn rt-btn-ghost" onClick={() => copyText(coverPlain, "Cover letter")}><Copy size={14} /> Copy text</button>
                  </div>
                  <div className="rt-letter">
                    <div className="nm">{cover.candidateName}</div>
                    <div className="meta">{cover.company ? <div>{cover.company}</div> : null}{cover.role ? <div>Re: {cover.role}</div> : null}</div>
                    <p>{cover.hiringManager ? `Dear ${cover.hiringManager},` : "Dear Hiring Manager,"}</p>
                    {(cover.paragraphs || []).map((p, i) => (<p key={i}>{p}</p>))}
                    <p style={{ marginTop: 4 }}>Sincerely,<br />{cover.candidateName}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}

        <div className="rt-foot">PDF and Word downloads are set in Times New Roman, ready to send.<br />Paste-LaTeX mode also lets you compile your exact original layout in Overleaf.</div>
      </div>
      {toast ? (<div className="rt-toast"><Check size={15} /> {toast}</div>) : null}
    </div>
  );
}
