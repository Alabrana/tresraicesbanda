# Correcciones técnicas P0 — Tres Raíces

**Fecha:** 15 de noviembre de 2026  
**Base auditada:** `323dbc3`  
**Alcance:** fechas civiles, contratos compartidos, clasificación de eventos y pruebas automatizadas. No incluye P1, editor local ni cambios de diseño.

## Implementación

- `src/lib/civil-date.ts`: valida y formatea días civiles `YYYY-MM-DD` sin conversiones implícitas; obtiene el día vigente en `America/Santiago`.
- `src/lib/contracts.ts`: centraliza contratos Zod de noticias, eventos y JSON globales; valida IDs, slugs, URLs, YouTube, duplicados e imágenes confinadas a `public/images`.
- `src/lib/events.ts`: aplica una sola política para próximas, pasadas, canceladas y reprogramadas; expone un reloj cliente que reclasifica al cambiar el día chileno.
- `src/content.config.ts` y `src/data/content.ts`: consumen los contratos compartidos.
- `src/components/ShowClassificationState.astro`: activa la reclasificación ligera solamente cuando existen eventos, sin backend ni reconstrucción diaria.
- `src/pages/index.astro` y `src/pages/en-vivo.astro`: consumen la misma clasificación.
- `src/pages/news/`: conserva fechas como cadenas civiles, ordena por `YYYY-MM-DD`, valida slugs y formatea correctamente en `es-CL`.
- `tests/`: cubre contratos, calendario chileno, eventos y fixtures técnicas aisladas de `src/content`.
- `package.json`: incorpora `check`, `test` y `validate` con el runner nativo de Node 22.

## Logos optimizados revisados

- `logoprincipalHorizontal.webp`: 1620 × 971, 57.876 bytes; utilizado en header e Inicio.
- `logoprincipalVertical.webp`: 1254 × 1254, 93.842 bytes; disponible para usos futuros, todavía no referenciado.
- `logoredondo.webp`: 251 × 251, 16.384 bytes; utilizado como favicon con MIME `image/webp`.
- Los archivos originales de `assets/originales/` permanecen intactos.

## Validaciones ejecutadas

| Comando o comprobación | Resultado |
|---|---|
| `pnpm run test` | 16 pruebas aprobadas, 0 fallidas. |
| `pnpm run check` | 23 archivos, 0 errores, 0 warnings y 0 hints. |
| `pnpm run validate` | Pruebas, check y build completados correctamente. |
| Build Astro | 7 páginas estáticas generadas. |
| Fixtures técnicas en `dist` | Ninguna fixture publicada. |
| `git diff --check` | Sin errores de whitespace. |

El build conserva advertencias informativas porque `src/content/news` y `src/content/shows` aún no tienen contenido real.

## P1 pendiente

- SEO técnico: dominio, canonical, Open Graph, sitemap, robots y 404.
- Accesibilidad: enlace de salto, `aria-current`, movimiento reducido y textos alternativos editoriales.
- Optimización responsive de fotografías y política de imágenes.
- Check remoto y configuración segura/reproducible de Cloudflare Pages.
- Encabezados de seguridad compatibles con los embeds que finalmente se utilicen.

No se implementó ninguno de estos asuntos durante P0.
