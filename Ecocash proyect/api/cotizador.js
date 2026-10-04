const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { material, cantidad, medida } = req.body || {};
    const qty = parseFloat(cantidad) || 1;

    if (!process.env.GEMINI_API_KEY) {
      let baseRate = 7.5;
      const m = (material || "").toLowerCase();
      if (m.includes("cobre")) baseRate = 140.0;
      else if (m.includes("aluminio")) baseRate = 28.0;
      else if (m.includes("bronce")) baseRate = 85.0;
      else if (m.includes("pet")) baseRate = 7.5;
      else if (m.includes("carton") || m.includes("cartón")) baseRate = 2.9;
      else if (m.includes("vidrio")) baseRate = 1.2;

      return res.status(200).json({
        material,
        cantidad: qty,
        unidad: medida,
        totalEstimadoMXN: Number((qty * baseRate).toFixed(2)),
        valorPorKgMXN: baseRate,
        valorPorLMXN: Number((baseRate * 0.9).toFixed(2)),
        valorPorOnzMXN: Number((baseRate * 0.028).toFixed(2)),
        explicacion: `Estimado referencial para ${material} en recicladoras locales.`,
        ecoTip: "Limpia y aplasta los residuos para obtener el mayor precio por kilo."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Calcula el valor de mercado para reciclaje de: "${material}", cantidad: ${qty}, unidad: "${medida}". Precios en MXN.
Responde en JSON:
{
  "totalEstimadoMXN": número,
  "valorPorKgMXN": número,
  "valorPorLMXN": número,
  "valorPorOnzMXN": número,
  "explicacion": "Explicación de mercado",
  "ecoTip": "Consejo de venta"
}`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error Vercel cotizador:", err);
    return res.status(500).json({ error: "Error en Cotizador IA" });
  }
};
