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
    const { itemQuery } = JSON.parse(event.body || "{}");

    if (!itemQuery || typeof itemQuery !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Debes ingresar un material u objeto a consultar." })
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      // Respuesta de respaldo si aún no han configurado la clave de entorno
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          item: itemQuery,
          status: "Consultable",
          canRecycle: "Sí (requiere separación adecuada)",
          category: "Material General",
          preparation: "Asegúrate de vaciar cualquier líquido, enjuagar con poca agua y secar completamente.",
          whereToTake: "Centros de reciclaje locales, centros de acopio escolar o camión de separación de residuos.",
          upcycleIdea: "Úsalo como contenedor organizador, maceta para plantas pequeñas o material didáctico escolar.",
          environmentalImpact: "Reciclar este residuo ahorra energía, evita la saturación de rellenos sanitarios y disminuye la huella de carbono.",
          isDemo: true
        })
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Actúa como el Asesor Experto en Gestión de Residuos y Economía Circular de 'EcoCash'.
Un estudiante o vecino consulta sobre el siguiente residuo/objeto: "${itemQuery}".

Analiza minuciosamente si se puede reciclar, cómo prepararlo, dónde tirarlo o venderlo, y qué idea DIY se puede hacer.
Responde estrictamente en formato JSON con la siguiente estructura exacta:
{
  "item": "${itemQuery}",
  "canRecycle": "Sí" | "No" | "Condicional" | "Residuo Peligroso / Especial",
  "category": "Plástico" | "Papel / Cartón" | "Metal" | "Vidrio" | "Electrónico" | "Orgánico" | "Especial",
  "preparation": "Instrucciones claras y concisas de preparación (ej: limpiar, quitar grasa, separar tapas, aplastar)",
  "whereToTake": "Lugar específico para llevarlo o desecharlo (ej: chatarrera para venta, contenedor verde escolar, farmacia para medicamentos, etc.)",
  "upcycleIdea": "Una idea creativa y práctica de 'Hazlo Tú Mismo' (DIY) para reutilizar este residuo en casa o colegio",
  "environmentalImpact": "Dato o impacto ecológico positivo de reciclar este material (1-2 frases)",
  "canSell": true o false,
  "marketValueNote": "Nota breve sobre su valor comercial aproximado o si no se paga"
}`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Error en advisor AI:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error al consultar con el Asesor Eco-AI. Por favor intenta de nuevo." })
    };
  }
};
