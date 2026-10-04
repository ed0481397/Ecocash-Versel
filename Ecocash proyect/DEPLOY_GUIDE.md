# 🌱 EcoCash - Guía Maestra de Puesta en Marcha y Despliegue en Línea

¡Bienvenido al proyecto escolar **EcoCash**! Esta plataforma combina **educación ambiental con IA**, un **mercado escolar de residuos**, **ideas creativas de Upcycling (DIY)**, **comentarios en tiempo real con stickers ecológicos** y un **filtro inteligente Anti-Bullshit y detector de groserías**.

---

## 📋 Arquitectura del Proyecto

```
Ecocash proyect/
├── functions/                     # Funciones Serverless en la Nube (Netlify / AWS Lambda)
│   ├── advisor.js                 # Asesor de Reciclaje con IA (diagnóstico de cualquier residuo)
│   ├── cotizador.js               # Cotizador de valor de mercado en Pesos Mexicanos (MXN)
│   ├── moderate.js                # Detector Anti-Bullshit & Filtro de Groserías con Gemini IA
│   └── wiki.js                    # Generador de artículos de la Eco-Wiki con IA
├── public/                        # Frontend Web (HTML5, Tailwind CSS, JavaScript Moderno)
│   ├── css/
│   │   └── styles.css             # Estilos profesionales, glassmorphism y animaciones
│   ├── js/
│   │   ├── ai.js                  # Conector de Inteligencia Artificial (Google Gemini)
│   │   ├── app.js                 # Controlador principal, vistas y lógica de interacción
│   │   ├── auth.js                # Sistema de autenticación con Google y perfiles escolares
│   │   └── data.js                # Catálogo de materiales, stickers ecológicos y semillas
│   └── index.html                 # Página web completa y responsiva
├── netlify.toml                   # Configuración automática de despliegue en Netlify
├── package.json                   # Dependencias de backend (@google/generative-ai)
└── DEPLOY_GUIDE.md                # Esta guía de despliegue
```

---

## ⚡ 1. Cómo Probar el Proyecto de Inmediato (Localmente)

No necesitas instalar servidores complejos para probar la interfaz:

1. Ve a la carpeta `public/` y haz doble clic sobre el archivo **`index.html`** (se abrirá en tu navegador Chrome, Edge o Firefox).
2. O bien, si usas **VS Code**, haz clic derecho sobre `public/index.html` y selecciona **"Open with Live Server"**.
3. **Perfiles de Demostración para Evaluación:**
   - Haz clic en el botón de usuario (arriba a la derecha).
   - Podrás alternar instantáneamente entre:
     * **Sofía Martínez (3ro B)**: Creadora del Post 1 (Botellas PET) y del DIY de Maceta.
     * **Mateo Gómez (Taller)**: Creador del Post 2 (Cobre) y del DIY de Latas.
     * **Prof. Carlos Rivera**: Creador de la Donación de Cajas y del DIY de Composta.
     * **Nuevo Invitado**: Para probar la experiencia desde cero.
   - **Prueba de Permisos:** Si estás conectado como Mateo, **NO** verás el botón de borrar en las publicaciones de Sofía. Solo podrás borrar las publicaciones que te pertenecen.

---

## 🚀 2. Cómo Poner la Página Web en Línea (100% Gratis en Netlify)

Netlify te permite tener un enlace público gratuito con HTTPS (ejemplo: `https://ecocash-proyecto.netlify.app`) y ejecuta las funciones de Inteligencia Artificial en servidores en la nube.

### Pasos:

1. **Subir tu proyecto a GitHub:**
   - Abre una terminal en la carpeta del proyecto:
     ```bash
     git add .
     git commit -m "Ecocash proyecto escolar completo con IA y mercado"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/ecocash-proyect.git
     git push -u origin main
     ```

2. **Crear cuenta en Netlify:**
   - Ingresa a [netlify.com](https://www.netlify.com/) e inicia sesión con tu cuenta de GitHub.

3. **Importar el Repositorio:**
   - Haz clic en **"Add new site"** → **"Import an existing project"**.
   - Elige **GitHub** y selecciona tu repositorio `ecocash-proyect`.
   - Netlify leerá automáticamente el archivo `netlify.toml`:
     * **Base directory:** (dejar vacío)
     * **Publish directory:** `public`
     * **Functions directory:** `functions`
   - Haz clic en **"Deploy ecocash-proyect"**.

¡En 1 minuto tu sitio web estará público en internet!

---

## 🤖 3. Cómo Conectar la Inteligencia Artificial (Google Gemini)

Tanto el **Asesor de Reciclaje**, la **Eco-Wiki**, el **Cotizador** y el **Detector Anti-Bullshit** utilizan la API oficial de **Google Gemini** (`gemini-1.5-flash`).

### Pasos para obtener tu clave gratuita:

1. Entra a [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Inicia sesión con cualquier cuenta de Google.
3. Haz clic en **"Create API key"** y copia la clave generada (empieza con `AIzaSy...`).
4. **Configurarla en Netlify:**
   - En tu panel de Netlify, ve a **Site configuration** → **Environment variables**.
   - Haz clic en **"Add a variable"**.
   - **Key (Nombre):** `GEMINI_API_KEY`
   - **Value (Valor):** Pega tu clave de Google AI Studio.
   - Haz clic en **Save**.
5. Ve a la pestaña **Deploys** en Netlify y haz clic en **"Trigger deploy"** → **"Clear cache and deploy site"** para que las funciones carguen la clave.

---

## 🔐 4. Cómo Activar el Inicio de Sesión con Google Real (Firebase)

Para permitir que cualquier alumno o profesor ingrese con su cuenta real de Google `@gmail.com` o correo institucional de la escuela:

1. Entra a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **"Crear un proyecto"** (nómbralo `ecocash-escuela`).
3. Ve a **Compilación (Build)** → **Authentication** → botón **"Comenzar"**.
4. En la pestaña **"Sign-in method"**, haz clic en **Google**, actívalo y guarda.
5. Ve a la configuración del proyecto (icono de engranaje ⚙️) → **General**.
6. En la sección *"Tus apps"*, haz clic en el icono Web **`</>`**.
7. Copia el objeto de configuración JavaScript `firebaseConfig`, que se ve así:
   ```json
   {
     "apiKey": "AIzaSy...",
     "authDomain": "ecocash-escuela.firebaseapp.com",
     "projectId": "ecocash-escuela",
     "storageBucket": "ecocash-escuela.appspot.com",
     "messagingSenderId": "123456789",
     "appId": "1:123456789:web:abcdef"
   }
   ```
8. **Vincular en tu sitio web:**
   - Abre tu página de EcoCash.
   - Haz clic en el botón superior **"🚀 ¿Cómo ponerlo online?"**.
   - Pega tu JSON en el campo correspondiente del Paso 3 y haz clic en **"Guardar y Conectar Firebase"**.

---

## 🛡️ 5. Cómo Funciona el Detector Anti-Bullshit y Groserías con IA

El sistema cuenta con un filtro ético escolar de doble capa:

1. **Filtro Heurístico Preventivo:** Bloquea al instante palabras altisonantes en español e inglés y términos de estafa comercial.
2. **Análisis Semántico con Gemini:**
   - Analiza si el usuario está promoviendo mitos peligrosos o desinformación absurda (*bullshit*), como recomendar quemar plásticos o arrojar baterías al drenaje.
   - Bloquea el comentario y muestra una notificación educativa explicando amablemente por qué fue rechazado.
   - Si el mensaje es constructivo, se publica con la insignia verde: **`🛡️ Eco-AI Verificado`**.

---

## 🎨 6. Stickers Ecológicos Disponibles en Comentarios

Los usuarios pueden reaccionar y acompañar sus comentarios con una colección de 12 stickers temáticos:

| Emoji | Nombre del Sticker | Significado Ecológico |
| :---: | :--- | :--- |
| 🌱 | **Brote Verde** | Nueva vida / Crecimiento sustentable |
| ♻️ | **100% Reciclable** | Cierre de ciclo / Zero Waste |
| 🐢 | **Océano Limpio** | Protección de fauna marina y costas |
| 🐝 | **Polinizador Eco** | Cuidado de abejas y biodiversidad |
| 🌍 | **Tierra Viva** | Conciencia sobre nuestro único hogar |
| 💧 | **Gota Pura** | Ahorro y preservación de agua potable |
| 🌻 | **Energía Solar** | Transición a energías limpias |
| 🔋 | **Cero Tóxicos** | Manejo seguro de pilas y electrónicos |
| 🚲 | **Movilidad Verde** | Cero emisiones y transporte limpio |
| 🌲 | **Pulmón Verde** | Reforestación y aire puro |
| 💚 | **Eco-Amor** | Comunidad escolar unida por el planeta |
| 🍄 | **Compost Orgánico** | Nutrición del suelo con residuos de cocina |

---

## 👥 7. Reglas de Autoría y Borrado (Seguridad de la Plataforma)

- **Mercado:** Solo quien creó una oferta de venta, donación o punto de acopio puede ver el botón rojo de **"Borrar"**.
- **Tips & DIY:** Solo el autor de la guía puede eliminar su proyecto.
- **Comentarios:** Solo quien redactó un comentario puede retirarlo.
- Esta regla está garantizada tanto en el frontend como en el validador de permisos de `auth.js`.
