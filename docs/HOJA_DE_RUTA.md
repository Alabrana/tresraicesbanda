# Hoja de ruta de implementación — Tres Raíces V1

> Avanzar por entregas pequeñas y verificables. **No desarrollar el editor antes de comprobar los contratos y páginas estáticas básicas.**

## Fase 0 — Documentación y repositorio

- [x] Documento base V1 y manual creativo preservados.
- [x] `AGENTS.md` y decisiones para Codex.
- [ ] Inicializar Git y subir repositorio privado a GitHub.

## Fase 1 — Astro mínimo y contratos

- [ ] Crear proyecto Astro en la raíz **sin sobrescribir documentación**.
- [ ] Configurar `output: 'static'`.
- [ ] Crear layouts, rutas públicas vacías/estructurales, estilos base.
- [ ] Definir colecciones y esquemas Markdown/JSON según contratos.
- [ ] Crear muestras técnicas claramente identificadas como placeholders o usar solamente contenido real confirmado.
- [ ] Incorporar assets oficiales optimizados según manual.
- [ ] Validar `npm run build` y confirmar que `dist` NO contiene editor.

**Aceptación:** `npm run build` exitoso y estructura limpia, sin backend, BD ni contenido inventado publicado.

## Fase 2 — Web pública

- [ ] Hero con logo oficial y navegación responsive.
- [ ] Páginas Banda, Media, En Vivo, News, Galería, Network.
- [ ] Inicio en orden aprobado, ocultando secciones vacías.
- [ ] Estados diagonales de eventos; clasificación por fecha Chile.
- [ ] Modal YouTube bajo demanda; lightbox Galería.
- [ ] SEO, imágenes optimizadas, accesibilidad y 404.

**Aceptación:** sitio usable sin API propia ni base de datos; identidad real preservada.

## Fase 3 — Editor local

- [ ] Iniciar editor con comando propio únicamente en localhost.
- [ ] Formularios por módulo y selector visual de imágenes existentes.
- [ ] Detectar modificaciones pendientes entre módulos.
- [ ] Validar esquema y referencias locales.
- [ ] Implementar «Guardar todos» coordinado, con restauración ante errores.
- [ ] Comprobar que editor NO aparece en `dist`.

**Aceptación:** modificar múltiples módulos y guardar juntos, sin publicar ni generar build en cada cambio.

## Fase 4 — Publicación

- [ ] Confirmar contenido y assets definitivos.
- [ ] Conectar GitHub con Cloudflare Pages (`npm run build` → `dist`).
- [ ] Conectar dominio propio y HTTPS.
- [ ] Probar nueva publicación y eventual rollback por Git.
- [ ] Documentar operación y mantenimiento en README.

**Aceptación:** sitio público servido solo como estático, sin servicios de pago obligatorios y sin editor remoto.
