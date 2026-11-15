# Prompt para iniciar con Codex en VS Code

Copia el siguiente bloque y pégalo en el chat de Codex **después de abrir este repositorio en VS Code**:

---

Actúa como desarrollador senior especializado en Astro, TypeScript y sitios estáticos. Vamos a implementar la web oficial de la banda Tres Raíces, de Talcahuano (Chile).

**Primero lee en el repositorio:**
- `AGENTS.md`
- `docs/BASE_PROPUESTA_V1.md`
- `docs/MANUAL_CREATIVO_OFICIAL.md`
- `docs/CONTRATOS_CONTENIDO_V1.md`
- `docs/ARQUITECTURA_Y_EDITOR_LOCAL.md`
- `docs/HOJA_DE_RUTA.md`
- `docs/DECISIONES.md`

**Objetivo de esta primera intervención (solo Fase 1):**
1. Inspecciona el repositorio y resume brevemente los requisitos y el plan antes de editar.
2. Inicializa una aplicación Astro **estrictamente estática** en la raíz, preservando toda la documentación y los recursos originales. Usa TypeScript donde corresponda.
3. Crea las rutas públicas y una estructura modular mínima de layouts, componentes y estilos basada en el documento base; evita todavía diseño final complejo.
4. Establece colecciones y esquemas de datos para News y En Vivo, y los archivos/contratos mínimos del resto de módulos sin inventar hechos de la banda (si faltan datos reales, usa datos vacíos seguros o marcadores de desarrollo claramente identificados).
5. Prepara el proyecto para Cloudflare Pages (`npm run build` y salida `dist`), sin conectarlo todavía ni configurar un dominio ficticio.
6. Revisa assets originales en `assets/originales/` y deja clara la estrategia de optimización; no modifiques originales ni reproduzcas el logo mediante SVG inventado.
7. Ejecuta verificaciones disponibles, incluyendo `npm run build`, informa resultados y deja una lista de cambios realizada.

**Restricciones obligatorias:**
- Cero bases de datos, NestJS, Supabase, Firebase, SSR, CMS online o API de producción.
- El futuro editor será **solo local**, de administrador único, con selector visual de imágenes y un guardado general. **No implementes el editor todavía** ni publiques `/admin`.
- No introducir borradores ni papelera.
- Mantener fotografía y logo oficiales sin alterar identidad.
- Evitar dependencias innecesarias y no avanzar a Fases 2-4 en esta intervención.
- No inventar enlaces de contacto, material discográfico, noticias, conciertos o fechas como contenido real.
- Si encuentras contradicciones entre documentos, explícalas y pregunta solo por decisiones que realmente impidan completar la fase; registra decisiones nuevas en `docs/DECISIONES.md`.

Al terminar, explica cómo ejecutar localmente el proyecto y cuál es el siguiente paso según `docs/HOJA_DE_RUTA.md`.

---
