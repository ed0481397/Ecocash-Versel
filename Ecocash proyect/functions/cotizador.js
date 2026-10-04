const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { material, cantidad, medida } = JSON.parse(event.body || "{}");

    if (!material || !cantidad || !medida) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Por favor proporciona el material, la cantidad y la unidad de medida." })
      };
    }

    const qty = parseFloat(cantidad);
    if (isNaN(qty) || qty <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "La cantidad debe ser un número válido mayor a 0." })
      };
    }

    // Si aún no está configurada la GEMINI_API_KEY en Netlify
    if (!process.env.GEMINI_API_KEY) {
      // Cálculo de referencia local estándar (Mercado México / LATAM)
      let baseRate = 8.5; // MXN base por kg
      const matLower = material.toLowerCase();
      if (matLower.includes("cobre")) baseRate = 145.0;
      else if (matLower.includes("aluminio")) baseRate = 28.0;
      else if (matLower.includes("bronce")) baseRate = 85.0;
      else if (matLower.includes("pet") || matLower.includes("plastico") || matLower.includes("plástico")) baseRate = 7.5;
      else if (matLower.includes("carton") || matLower.includes("cartón")) baseRate = 2.8;
      else if (matLower.includes("vidrio")) baseRate = 1.2;
      else if (matLower.includes("bateria") || matLower.includes("batería")) baseRate = 18.0;
      else if (matLower.includes("fierro") || matLower.includes("chatarra")) baseRate = 4.2;

      const total = qty * baseRate;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          material,
          cantidad: qty,
          unidad: medida,
          totalEstimadoMXN: Number(total.toFixed(2)),
          valorPorKgMXN: Number(baseRate.toFixed(2)),
          valorPorLMXN: Number((baseRate * 0.9).toFixed(2)),
          valorPorOnzMXN: Number((baseRate * 0.028).toFixed(2)),
          explicacion: `Estimado referencial para ${material} en centros de acopio y recicladoras locales. Los precios pueden variar según limpieza y separación del material.`,
          ecoTip: "Para obtener el mejor precio: limpia los residuos, retira etiquetas adhesivas y separa por tipo de material.",
          isDemo: true
        })
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Calcula el valor de mercado comercial estimado para reciclaje, chatarra o reutilización del siguiente material:
    - Material: "${material}"
    - Cantidad: ${qty}
    - Unidad de medida: "${medida}"

    Considera precios actuales de recicladoras y centros de acopio en México / Latinoamérica (en Pesos Mexicanos MXN).
    Responde estrictamente en formato JSON con la siguiente estructura exacta:
    {
      "totalEstimadoMXN": número (valor total estimado en MXN),
      "valorPorKgMXN": número (precio unitario estimado por Kg en MXN),
      "valorPorLMXN": número (precio aproximado por Litro o unidad equivalente en MXN),
      "valorPorOnzMXN": número (precio aproximado por onza en MXN),
      "explicacion": "Explicación concisa y realista de cómo se cotiza este material en el mercado de reciclaje",
      "ecoTip": "Consejo práctico para maximizar su valor (ej: quitar tapas, lavar, aplastar, separar calidades)"
    }`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Error en cotizador:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error al cotizar el material con la IA. Por favor intenta nuevamente." })
    };
  }
};