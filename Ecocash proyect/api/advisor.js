const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { itemQuery } = req.body || {};
    if (!itemQuery) return res.status(400).json({ error: "Falta residuo a consultar." });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        item: itemQuery,
        canRecycle: "Sí (con correcta separación)",
        category: "Material General",
        preparation: "Enjuagar, secar completamente y compactar antes de entregar.",
        whereToTake: "Punto limpio municipal o centro de acopio escolar.",
        upcycleIdea: "Úsalo como organizador escolar o contenedor para el huerto.",
        environmentalImpact: "Cada kilo reciclado ahorra 1.5 kg de CO2.",
        canSell: true,
        marketValueNote: "Consulta cotización en el mercado escolar."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Actúa como Asesor de Residuos de 'EcoCash'.
Analiza el residuo: "${itemQuery}".
Responde en JSON:
{
  "item": "${itemQuery}",
  "canRecycle": "Sí" | "No" | "Condicional" | "Residuo Peligroso / Especial",
  "category": "Plástico" | "Papel / Cartón" | "Metal" | "Vidrio" | "Electrónico" | "Orgánico" | "Especial",
  "preparation": "Instrucciones de limpieza y secado",
  "whereToTake": "Lugar específico de depósito o venta",
  "upcycleIdea": "Idea creativa DIY",
  "environmentalImpact": "Dato ecológico",
  "canSell": true o false,
  "marketValueNote": "Nota comercial"
}`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error Vercel advisor:", err);
    return res.status(500).json({ error: "Error en Asesor IA" });
  }
};
