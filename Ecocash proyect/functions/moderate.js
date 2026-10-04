const { GoogleGenerativeAI } = require("@google/generative-ai");

// Lista base de términos inapropiados para filtro inmediato y de respaldo
const SWEAR_PATTERNS = [
  /\b(put[oa]|mierda|pendej[oa]|verga|chinga|cabron|cul[oa]|estupid[oa]|idiota|maldit[oa]|bastard[oa]|hijo\s*de\s*puta|fuck|shit|bitch|asshole|bastard|dick|cunt)\b/i,
  /\b(estafa|scam|fraude|cripto\s*gratis|gana\s*dinero\s*facil|deposito\s*ya|hack|pirata)\b/i
];

exports.handler = async (event) => {
  // Configuración de encabezados CORS
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
    const { text, author } = JSON.parse(event.body || "{}");

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ approved: false, reason: "El comentario no puede estar vacío." })
      };
    }

    const trimmed = text.trim();

    // 1. Verificación rápida local (Heurística de seguridad)
    for (const pattern of SWEAR_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            approved: false,
            flagType: "swear_or_spam",
            reason: "El filtro Eco-AI detectó palabras altisonantes, spam o términos no permitidos en una comunidad escolar.",
            cleanText: trimmed.replace(pattern, "****")
          })
        };
      }
    }

    // 2. Si no hay API KEY configurada en el entorno, pasamos la verificación local con éxito
    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          approved: true,
          flagType: "clean",
          reason: "Comentario verificado mediante filtro ético local.",
          cleanText: trimmed
        })
      };
    }

    // 3. Verificación Semántica Profunda con Google Gemini (Detector Anti-Bullshit y Toxicidad)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Actúa como el Moderador Eco-AI de 'EcoCash', un proyecto escolar de reciclaje y sustentabilidad comunitaria.
Analiza el siguiente comentario de un usuario en la sección de mercado o discusión comunitaria.

Comentario a evaluar: "${trimmed}"

Tu objetivo es detectar:
1. Groserías, insultos, ofensas, acoso o lenguaje altisonante (en español o inglés).
2. 'Bullshit': desinformación absurda sobre reciclaje o ecología (ej: 'quemar llantas es ecológico', 'tira las pilas al río'), estafas financieras, ofertas fraudulentas o spam irrelevante.

Debes responder estrictamente en formato JSON con la siguiente estructura:
{
  "approved": true o false (booleano. Pon false si contiene groserías, estafas, desinformación ecológica dañina o spam),
  "flagType": "clean" | "swear" | "bullshit_disinformation" | "spam_scam",
  "reason": "Explicación respetuosa y constructiva de 1 frase explicando por qué se aprobó o por qué fue rechazado",
  "cleanText": "El texto limpio con asteriscos si hubiese alguna palabra menor o el texto original"
}`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Error en moderación AI:", error);
    // En caso de fallo de red o cuota con la API de IA, aplicar respaldo preventivo
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        approved: true,
        flagType: "fallback",
        reason: "Comentario aprobado por filtro preventivo de seguridad.",
        cleanText: text
      })
    };
  }
};
