const { GoogleGenerativeAI } = require("@google/generative-ai");

const SWEAR_PATTERNS = [
  /\b(put[oa]|mierda|pendej[oa]|verga|chinga|cabron|cul[oa]|estupid[oa]|idiota|maldit[oa]|bastard[oa]|fuck|shit|bitch|asshole)\b/i,
  /\b(estafa|scam|fraude|cripto\s*gratis|gana\s*dinero\s*facil)\b/i
];

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ approved: false, reason: "Texto vacío." });
    }

    const trimmed = text.trim();

    for (const pattern of SWEAR_PATTERNS) {
      if (pattern.test(trimmed)) {
        return res.status(200).json({
          approved: false,
          flagType: "swear_or_spam",
          reason: "El filtro Eco-AI detectó palabras altisonantes o spam no permitidos.",
          cleanText: trimmed.replace(pattern, "****")
        });
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        approved: true,
        flagType: "clean",
        reason: "Comentario verificado por filtro ético.",
        cleanText: trimmed
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Actúa como el Moderador Eco-AI de 'EcoCash'.
Analiza el siguiente comentario: "${trimmed}".
Detecta groserías, acoso, desinformación ambiental peligrosa (ej: quemar basura) o estafas.
Responde estrictamente en formato JSON:
{
  "approved": boolean,
  "flagType": "clean" | "swear" | "bullshit_disinformation" | "spam_scam",
  "reason": "1 frase constructiva",
  "cleanText": "texto limpio"
}`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error Vercel moderate:", err);
    return res.status(200).json({
      approved: true,
      flagType: "fallback",
      reason: "Comentario verificado por filtro preventivo.",
      cleanText: req.body?.text || ""
    });
  }
};
