# 🚀 Guía Definitiva: Cómo Publicar EcoCash en Vercel o GitHub Pages (¡Sin Netlify y Sin Errores 404!)

Esta guía te explica cómo tener tu sitio **EcoCash** y toda su **Inteligencia Artificial** funcionando en línea **100% gratis**, **sin límite de créditos** y **sin el molesto error 404 de funciones caídas de Netlify**.

---

## 💡 ¿Por qué es mucho mejor que Netlify?

1. **Cero Límites de Crédito:** Netlify cobra o bloquea sitios cuando se supera un número bajo de ejecuciones de funciones serverless.
2. **Cero Errores 404:** La web ahora puede llamar a **Google Gemini directamente desde el navegador** del usuario, por lo que **nunca se caerá tu backend**.
3. **Compatibilidad Universal:** Funciona exactamente igual en **Vercel**, en **GitHub Pages**, en **Render**, en **Cloudflare Pages** o en una memoria USB.

---

## 🥇 Opción 1: Publicar en VERCEL (Recomendado, 3 minutos)

Vercel es la plataforma de hosting moderna más rápida y generosa del mundo para proyectos web.

### Pasos:

1. **Sube tus cambios a GitHub:**
   Abre tu terminal en la carpeta del proyecto y ejecuta:
   ```bash
   git add .
   git commit -m "Migrado para Vercel y GitHub Pages con IA directa"
   git push
   ```

2. **Entra a Vercel:**
   - Ve a [https://vercel.com](https://vercel.com) e inicia sesión con tu cuenta de **GitHub**.

3. **Importar el Proyecto:**
   - Haz clic en el botón azul **"Add New..."** → **"Project"**.
   - Busca tu repositorio `Ecocash proyect` o el nombre que le diste en GitHub y haz clic en **"Import"**.

4. **Configuración Automática:**
   - No necesitas mover nada: Vercel detectará automáticamente nuestro archivo `vercel.json` y las funciones de la carpeta `api/`.
   - *(Opcional)* En la sección **"Environment Variables"**, puedes agregar:
     * **Name:** `GEMINI_API_KEY`
     * **Value:** Tu clave de [Google AI Studio](https://aistudio.google.com/app/apikey).

5. **Haz clic en "Deploy":**
   - En 30 segundos Vercel te dará tu enlace en vivo (ejemplo: `https://ecocash-tu-escuela.vercel.app`).
   - ¡Cero errores 404 y cero consumo de créditos limitantes!

---

## 🥈 Opción 2: Publicar en GITHUB PAGES (100% Gratis para Siempre)

Si quieres alojarlo directamente en los servidores de GitHub sin depender de ninguna otra plataforma:

### Pasos:

1. **Asegúrate de haber hecho `git push`** de tu repositorio a GitHub.
2. En la página de tu repositorio en GitHub, haz clic en la pestaña **"Settings"** (⚙️ Configuración).
3. En el menú de la izquierda, busca y haz clic en **"Pages"**.
4. En la sección **"Build and deployment"**:
   - **Source:** Selecciona *Deploy from a branch*.
   - **Branch:** Selecciona `main` y en la carpeta deja `/ (root)`.
   - Haz clic en **"Save"**.
5. Espera 1 minuto y recarga la página. Verás un mensaje en verde:
   > *"Your site is live at `https://tu-usuario.github.io/tu-repositorio/`"*
6. Hemos colocado un redireccionador automático en la raíz, por lo que entrará directo a tu aplicación de EcoCash.

---

## 🔑 Cómo Activar la Inteligencia Artificial (Google Gemini)

La Inteligencia Artificial ahora se conecta de forma directa y universal:

### Método 1 (El más fácil - Directo desde la página):
1. Abre tu página web ya publicada (en Vercel, GitHub Pages o en tu computadora).
2. En la barra superior, haz clic en el botón verde con el icono de llave: **`🔑 Clave IA`**.
3. Pega tu clave gratuita de [Google AI Studio](https://aistudio.google.com/app/apikey).
4. Haz clic en **"Guardar y Probar Conexión"**.
5. ¡Listo! La web confirmará la conexión y quedará guardada de forma segura en tu navegador.

### Método 2 (Para que quede pre-configurada para todos los alumnos):
1. Abre el archivo [**`public/js/config.js`**](file:///c:/Users/ed048/OneDrive/Desktop/Ecocash%20proyect/public/js/config.js).
2. Pega tu clave en:
   ```javascript
   window.ECO_CONFIG = {
     GEMINI_API_KEY: "AIzaSy...", // Tu clave aquí
   };
   ```
3. Guarda el archivo y haz `git push`. ¡Cualquier persona que entre a la web tendrá la IA activa automáticamente sin configurar nada!

---

## 🛡️ ¿Qué pasa si alguien entra sin clave de IA?

**Nunca verán un error 404 ni se romperá la página.**

Si la clave no está configurada o se cae internet, EcoCash activa automáticamente su **Motor Heurístico Escolar Integrado**:
- Filtra groserías y desinformación con su diccionario ético escolar.
- Proporciona respuestas reales de reciclaje y preparación de residuos.
- Cotiza materiales con tarifas de mercado de chatarra y reciclaje en México / LATAM.
- Permite crear, borrar (solo creadores) y comentar con stickers ecológicos con total fluidez.
