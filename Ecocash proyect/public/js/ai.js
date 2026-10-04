/**
 * EcoCash - Conector Universal de Inteligencia Artificial (Google Gemini)
 * Diseñado para funcionar en VERCEL, GITHUB PAGES, RENDER, CLOUDFLARE PAGES o Localmente.
 * ¡CERO dependencia de Netlify, CERO errores 404 y CERO consumo de créditos de servidor!
 */

const EcoAI = {
  // Obtener la clave API (desde config.js o desde localStorage)
  getApiKey() {
    if (window.ECO_CONFIG && window.ECO_CONFIG.GEMINI_API_KEY) {
      return window.ECO_CONFIG.GEMINI_API_KEY.trim();
    }
    const saved = localStorage.getItem('ecocash_gemini_key');
    return saved ? saved.trim() : null;
  },

  setApiKey(key) {
    if (key) {
      localStorage.setItem('ecocash_gemini_key', key.trim());
    } else {
      localStorage.removeItem('ecocash_gemini_key');
    }
  },

  hasApiKey() {
    const k = this.getApiKey();
    return !!(k && k.length > 10);
  },

  // Llamada DIRECTA a la API de Google Gemini (Cliente a Nube de Google)
  // No pasa por ningún servidor intermedio, por lo que NO gasta créditos de hosting ni da error 404.
  async callDirectGemini(prompt, isJson = false) {
    const key = this.getApiKey();
    if (!key) {
      throw new Error("No hay API Key configurada.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`;
    
    const bodyPayload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    if (isJson) {
      bodyPayload.generationConfig = {
        responseMimeType: "application/json"
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Error en Google Gemini (${response.status})`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Respuesta vacía de Gemini");

    return isJson ? JSON.parse(rawText) : rawText;
  },

  // 1. DETECTOR ANTI-BULLSHIT Y GROSERÍAS CON IA
  async moderateComment(text, authorName = "Estudiante") {
    // 1. Verificación rápida preventiva (filtro de palabras altisonantes)
    const localCheck = this.localModerateHeuristic(text);
    if (!localCheck.approved) {
      return localCheck;
    }

    // 2. Si hay clave de Google Gemini, llamamos directo a la IA
    if (this.hasApiKey()) {
      try {
        const prompt = `Actúa como el Moderador Eco-AI de 'EcoCash', un proyecto escolar de reciclaje y sustentabilidad comunitaria.
Analiza el siguiente comentario de un usuario en la sección de mercado o debate escolar.

Comentario a evaluar: "${text}"

Tu objetivo es detectar:
1. Groserías, insultos, ofensas, acoso o lenguaje altisonante (en español o inglés).
2. 'Bullshit': desinformación absurda sobre reciclaje o ecología (ej: 'quemar llantas es bueno', 'tira las pilas al río'), estafas financieras, ofertas fraudulentas o spam comercial.

Debes responder estrictamente en formato JSON con la siguiente estructura exacta:
{
  "approved": true o false (booleano),
  "flagType": "clean" | "swear" | "bullshit_disinformation" | "spam_scam",
  "reason": "Explicación respetuosa y constructiva de 1 frase explicando por qué se aprobó o por qué fue rechazado",
  "cleanText": "El texto limpio"
}`;

        const aiResult = await this.callDirectGemini(prompt, true);
        return {
          approved: aiResult.approved !== false,
          flagType: aiResult.flagType || 'clean',
          reason: aiResult.reason || 'Comentario verificado por Google Gemini IA.',
          cleanText: aiResult.cleanText || text
        };
      } catch (err) {
        console.warn("Llamada directa a Gemini falló, usando filtro ético de respaldo:", err);
      }
    }

    // 3. Si se desplegó en Vercel con variable de entorno en /api/moderate
    try {
      const vRes = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author: authorName })
      });
      if (vRes.ok) return await vRes.json();
    } catch (e) {}

    // 4. Respaldo preventivo seguro
    return localCheck;
  },

  localModerateHeuristic(text) {
    const raw = text.toLowerCase();
    
    // Lista de groserías e insultos comunes
    const swears = [
      'puta', 'puto', 'mierda', 'pendejo', 'pendeja', 'verga', 'chinga', 'cabron', 'cabrona',
      'culo', 'estupido', 'estupida', 'idiota', 'maldito', 'maldita', 'bastardo', 'zorra',
      'fuck', 'shit', 'bitch', 'asshole', 'dick', 'cunt'
    ];

    for (const w of swears) {
      if (raw.includes(w)) {
        return {
          approved: false,
          flagType: 'swear',
          reason: `El filtro detectó la palabra ("${w}"). En EcoCash fomentamos un espacio escolar limpio, respetuoso y constructivo.`,
          cleanText: text
        };
      }
    }

    // Detector de "Bullshit" / Desinformación dañina / Estafas
    const bullshitPatterns = [
      { pattern: /(quemar|quema)\s+(pl[aá]stico|llanta|basura)/i, reason: 'Quemar plásticos o basura libera dioxinas cancerígenas. ¡Desinformación nociva detectada por Eco-AI!' },
      { pattern: /(tira|arroja)\s+(al\s+r[ií]o|al\s+mar|a\s+la\s+calle)/i, reason: 'Tirar residuos a cuerpos de agua o calles contamina los ecosistemas. Mantén limpia la comunidad.' },
      { pattern: /(gana\s+dinero\s+f[aá]cil|cripto|inversi[oó]n\s+segura|hack|dep[oó]sito\s+inmediato)/i, reason: 'El filtro detectó posible publicidad engañosa, estafa financiera o spam comercial.' }
    ];

    for (const b of bullshitPatterns) {
      if (b.pattern.test(raw)) {
        return {
          approved: false,
          flagType: 'bullshit_disinformation',
          reason: b.reason,
          cleanText: text
        };
      }
    }

    return {
      approved: true,
      flagType: 'clean',
      reason: 'Comentario verificado por el filtro Eco-AI.',
      cleanText: text
    };
  },

  // 2. ASESOR DE RECICLAJE CON IA (¿QUÉ RECICLO, DÓNDE Y CÓMO?)
  async askAdvisor(itemQuery) {
    if (this.hasApiKey()) {
      try {
        const prompt = `Actúa como el Asesor Experto en Gestión de Residuos y Economía Circular de 'EcoCash'.
Un estudiante consulta sobre el siguiente residuo/objeto: "${itemQuery}".

Analiza minuciosamente si se puede reciclar, cómo prepararlo, dónde desecharlo o venderlo, y qué idea DIY se puede hacer.
Responde estrictamente en formato JSON con la siguiente estructura exacta:
{
  "item": "${itemQuery}",
  "canRecycle": "Sí" | "No" | "Condicional" | "Residuo Peligroso / Especial",
  "category": "Plástico" | "Papel / Cartón" | "Metal" | "Vidrio" | "Electrónico" | "Orgánico" | "Especial",
  "preparation": "Instrucciones claras y concisas de preparación (ej: vaciar, limpiar, secar, retirar tapas, aplanar)",
  "whereToTake": "Lugar específico para llevarlo o desecharlo (ej: chatarrera, contenedor verde escolar, farmacia con contenedor SINGREM, etc.)",
  "upcycleIdea": "Una idea creativa y práctica de 'Hazlo Tú Mismo' (DIY) para reutilizar este residuo en casa o colegio",
  "environmentalImpact": "Dato o impacto ecológico positivo de reciclar este material (1-2 frases)",
  "canSell": true o false,
  "marketValueNote": "Nota breve sobre su valor comercial aproximado"
}`;

        const data = await this.callDirectGemini(prompt, true);
        return data;
      } catch (err) {
        console.warn("Direct Gemini advisor falló, usando respaldo:", err);
      }
    }

    // Probar /api/advisor si está en Vercel
    try {
      const vRes = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemQuery })
      });
      if (vRes.ok) return await vRes.json();
    } catch (e) {}

    // Respaldo inteligente local garantizado
    return this.localAdvisorFallback(itemQuery);
  },

  localAdvisorFallback(itemQuery) {
    const q = itemQuery.toLowerCase();
    
    if (q.includes('pizza') || q.includes('grasa')) {
      return {
        item: itemQuery,
        canRecycle: "Condicional (Solo las partes limpias)",
        category: "Papel / Cartón",
        preparation: "Corta la tapa superior si está completamente limpia y libre de grasa para reciclarla en cartón. El fondo con queso derretido o grasa NO se recicla (va a orgánicos o composta).",
        whereToTake: "Contenedor azul escolar para la parte limpia; contenedor café/orgánico para la grasa.",
        upcycleIdea: "Usa la base grasosa troceada como cama seca absorbente para tu compostera casera.",
        environmentalImpact: "La grasa y el aceite impiden que las fibras de celulosa se disuelvan en agua en la planta papelera.",
        canSell: false,
        marketValueNote: "El cartón engrasado no tiene valor de reventa."
      };
    } else if (q.includes('pila') || q.includes('bateria') || q.includes('batería')) {
      return {
        item: itemQuery,
        canRecycle: "Residuo Peligroso / Especial",
        category: "Especial / Electrónico",
        preparation: "Coloca cinta aislante o transparente cubriendo los dos polos para evitar cortos eléctricos y fugas de sustancias.",
        whereToTake: "Contenedores certificados 'Ponte las Pilas' en el auditorio escolar, estaciones de transporte o supermercados.",
        upcycleIdea: "¡Bajo ninguna circunstancia intentes perforarlas o hacer manualidades con pilas! Su manejo debe ser 100% profesional.",
        environmentalImpact: "Una sola pila de botón de mercurio puede llegar a contaminar hasta 600,000 litros de agua potable.",
        canSell: false,
        marketValueNote: "Se entregan sin costo en centros de manejo de residuos peligrosos."
      };
    } else if (q.includes('aceite')) {
      return {
        item: itemQuery,
        canRecycle: "Sí (Transformación Especial)",
        category: "Especial / Químico Orgánico",
        preparation: "Deja enfriar el aceite, fíltralo con un colador fino o tela para quitar restos de comida y viértelo en una botella de plástico cerrada.",
        whereToTake: "Centros de acopio de aceite de cocina usado para transformación en biodiésel.",
        upcycleIdea: "Elabora jabón biodegradable casero para lavar ropa mediante saponificación con hidróxido de sodio (con asesoría docente).",
        environmentalImpact: "1 litro de aceite vegetal vertido al drenaje puede contaminar 1,000 litros de agua y tapar las tuberías municipales.",
        canSell: true,
        marketValueNote: "Se compra entre $4 y $7 MXN por litro en plantas de biodiésel."
      };
    }

    return {
      item: itemQuery,
      canRecycle: "Sí (con correcta separación)",
      category: "Material General",
      preparation: "Lava cualquier resto orgánico o líquido, escurre y seca completamente. Si es plástico o lata, aplástalo para reducir volumen.",
      whereToTake: "Contenedores de acopio escolar de EcoCash o punto limpio municipal más cercano.",
      upcycleIdea: "Revisa nuestra sección de Tips & DIY para convertir este material en un organizador escolar o maceta.",
      environmentalImpact: "Cada kilo de material reciclado ahorra aproximadamente 1.5 kg de CO2 emitidos a la atmósfera.",
      canSell: true,
      marketValueNote: "Consulta su precio exacto en nuestro Cotizador de Chatarra y Residuos."
    };
  },

  // 3. COTIZADOR DE RESIDUOS
  async getValuation(material, cantidad, medida) {
    const qty = parseFloat(cantidad) || 1;

    if (this.hasApiKey()) {
      try {
        const prompt = `Calcula el valor de mercado comercial estimado para reciclaje o chatarra del material: "${material}", cantidad: ${qty}, unidad: "${medida}".
Considera precios de recicladoras en México / Latinoamérica en Pesos Mexicanos (MXN).
Responde estrictamente en formato JSON con la siguiente estructura:
{
  "totalEstimadoMXN": número,
  "valorPorKgMXN": número,
  "valorPorLMXN": número,
  "valorPorOnzMXN": número,
  "explicacion": "Breve explicación del precio de mercado actual",
  "ecoTip": "Consejo para venderlo más caro (limpieza, separación)"
}`;
        const data = await this.callDirectGemini(prompt, true);
        return data;
      } catch (err) {
        console.warn("Direct cotizador falló, usando cálculo:", err);
      }
    }

    // Probar /api/cotizador
    try {
      const vRes = await fetch('/api/cotizador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material, cantidad, medida })
      });
      if (vRes.ok) return await vRes.json();
    } catch (e) {}

    // Cálculo local
    let rate = 7.5;
    const m = material.toLowerCase();
    if (m.includes('cobre')) rate = 140.0;
    else if (m.includes('aluminio')) rate = 28.0;
    else if (m.includes('bronce')) rate = 85.0;
    else if (m.includes('pet')) rate = 7.5;
    else if (m.includes('carton') || m.includes('cartón')) rate = 2.9;
    else if (m.includes('vidrio')) rate = 1.2;
    else if (m.includes('fierro') || m.includes('chatarra')) rate = 4.3;

    return {
      material,
      cantidad: qty,
      unidad: medida,
      totalEstimadoMXN: Number((qty * rate).toFixed(2)),
      valorPorKgMXN: rate,
      valorPorLMXN: Number((rate * 0.9).toFixed(2)),
      valorPorOnzMXN: Number((rate * 0.028).toFixed(2)),
      explicacion: `Cotización de referencia para ${material}. Los precios varían según la limpieza y el volumen entregado en recicladoras locales.`,
      ecoTip: 'Retira etiquetas y tapas de diferente material para recibir la tarifa más alta por kilo.'
    };
  },

  // 4. BÚSQUEDA EN LA ECO-WIKI
  async searchWiki(query) {
    if (this.hasApiKey()) {
      try {
        const prompt = `Actúa como un científico ambiental para el proyecto escolar 'EcoCash'.
Escribe una guía atractiva sobre el reciclaje y manejo de: "${query}".
Estructura la respuesta en exactamente 3 párrafos en formato HTML (usa <p> y <strong>):
1. ¿Qué es este material y su impacto ambiental?
2. Instrucciones exactas de preparación y limpieza.
3. Dónde llevarlo y cómo se transforma.`;

        const html = await this.callDirectGemini(prompt, false);
        return { query, summary: html };
      } catch (err) {
        console.warn("Direct wiki falló, usando respaldo:", err);
      }
    }

    try {
      const vRes = await fetch('/api/wiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (vRes.ok) return await vRes.json();
    } catch (e) {}

    return {
      query,
      summary: `<p><strong>${query}</strong> es un residuo reciclable o reutilizable de alto impacto. La separación adecuada en casa o en la escuela es el primer paso indispensable.</p><p>Para maximizar su aprovechamiento, asegúrate de mantenerlo limpio de restos de comida y libre de humedad.</p><p>Fomenta la economía circular compartiendo o vendiendo este material en nuestro Eco-Market.</p>`
    };
  }
};
