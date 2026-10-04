const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: "Falta término a consultar." });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        query,
        summary: `<p><strong>${query}</strong> es un material común con alto potencial de reciclaje si se clasifica limpiamente.</p><p>Asegúrate de retirar residuos orgánicos y almacenarlo en un lugar seco antes de entregarlo.</p><p>Reincorporar este residuo apoya la economía circular y la sustentabilidad escolar.</p>`
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Actúa como educador ambiental de 'EcoCash'.
Escribe una guía clara sobre: "${query}".
Estructura en exactamente 3 párrafos en HTML (<p> y <strong>):
1. ¿Qué es este material y su impacto?
2. Instrucciones de lavado y preparación.
3. Dónde llevarlo y cómo se recicla.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return res.status(200).json({ summary: text, query });
  } catch (err) {
    console.error("Error Vercel wiki:", err);
    return res.status(500).json({ error: "Error en Wiki IA" });
  }
};
