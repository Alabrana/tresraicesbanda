# Instrucciones permanentes para Codex — Tres Raíces

## Antes de actuar

1. Leer `docs/BASE_PROPUESTA_V1.md`, `docs/MANUAL_CREATIVO_OFICIAL.md`, `docs/ARQUITECTURA_Y_EDITOR_LOCAL.md` y `docs/HOJA_DE_RUTA.md`.
2. El documento base es la **fuente principal del alcance V1**. Si existe una contradicción estética, prevalece el manual creativo oficial. Si hay duda funcional, consultar al usuario antes de ampliar alcance.
3. Examinar el repositorio antes de crear o sobrescribir archivos. Comunicar un plan breve y trabajar por fases verificables.

## Restricciones técnicas de V1

- **Astro con salida estática (`output: 'static'`)**, deploy a **Cloudflare Pages**.
- **Un solo repositorio** con sitio web, Markdown/JSON, imágenes y futuro editor local.
- **No introducir** bases de datos, Supabase, Firebase, NestJS, APIs de producción, SSR, CMS SaaS, autenticación online, manejo multiusuario, borradores, papelera, procesos programados ni tiendas online.
- Web pública usable sin backend propio. El editor no se incluye en `dist` ni se publica como `/admin`.
- El futuro editor funciona **solo en localhost**, con capacidad de leer/escribir rutas autorizadas del repositorio; no debe exponer acceso al sistema de archivos fuera de localhost.
- Contenido en `src/content/` y `src/data/`; imágenes web en `public/images/`. Evitar contenido ficticio presentado como real.
- **Un solo guardado general de edición**; publicar es **manual con Git** y separado del guardado local.
- Mantener sencillez: elegir la menor cantidad de dependencias y capas que satisfagan requisitos.

## Identidad y contenido

- Tres Raíces: rock de Talcahuano, puerto, mar, barrio, industria, cultura chorera.
- Visual grunge/industrial, negro/gris/blanco envejecido/azul petróleo, legibilidad y responsive.
- Usar **logo oficial sin redibujarlo** y fotos auténticas sin alterar identidad de los integrantes.
- No crear árboles genéricos, anclas, olas o símbolos gratuitos de marca.
- Integrantes V1: Víctor (bajo y voz), Alex (guitarra), Pato (batería), editables pero fijos.
- Copy cercano, rockero y humano, sin tono corporativo. No inventar contacto, URLs, hitos o fechas.

## Forma de trabajar

- Entregar primero la **web pública y los contratos de datos**, después el editor local.
- Proponer cambios pequeños, describir archivos modificados y ejecutar comprobaciones disponibles (`npm run build`, etc.) cuando ya exista proyecto.
- No implementar requisitos futuros por iniciativa propia.
- Si aparece una decisión nueva, documentarla en `docs/DECISIONES.md`.
- No modificar ni borrar assets originales de `assets/originales/`.
- Si un requisito tiene costo operativo, señalarlo antes de implementarlo.
