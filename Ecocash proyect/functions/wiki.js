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
    const { query } = JSON.parse(event.body || "{}");
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Ingresa un término a consultar en la Eco-Wiki." })
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          query,
          summary: `<p><strong>${query}</strong> es un residuo comúnmente generado en hogares, escuelas y comercios. Para su correcto aprovechamiento, la clasificación en origen es el paso más crucial.</p><p>Antes de desecharlo o llevarlo a reciclar, debe estar completamente limpio y seco, separado de materia orgánica contaminante. Consulta siempre los centros de acopio autorizados de tu localidad.</p><p>Reincorporar este recurso a la cadena productiva disminuye la extracción de materias primas vírgenes y fomenta la economía circular escolar.</p>`,
          recyclable: "Comúnmente reciclable según su pureza y tipo",
          badge: "Wiki EcoCash"
        })
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Actúa como un educador y científico ambiental experto en economía circular para el proyecto escolar 'EcoCash'.
Escribe una guía informativa, concisa y atractiva sobre el reciclaje y manejo de: "${query}".

Estructura la respuesta en exactamente 3 párrafos en formato HTML (utiliza etiquetas <p>, <strong> para conceptos clave y <ul><li> si listas pasos):
1. Párrafo 1: ¿Qué es este material, cuál es su composición y su impacto ambiental si se tira a la basura convencional?
2. Párrafo 2: Instrucciones exactas de preparación (¿cómo lavarlo, secarlo, desarmarlo o compactarlo antes de entregarlo?)
3. Párrafo 3: ¿Dónde llevarlo, cómo se transforma y qué alternativas de reutilización creativa o venta existen?`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ summary: text, query })
    };
  } catch (error) {
    console.error("Error en wiki AI:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error al procesar la consulta con la Eco-Wiki IA." })
    };
  }
};