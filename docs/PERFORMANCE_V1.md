# Tres Raíces — Rendimiento V1

**Fecha de implementación y medición:** 18 de noviembre de 2026  
**Sitio de producción:** <https://tresraicesbanda.cl>  
**Arquitectura conservada:** Astro SSG, salida estática, Cloudflare Pages, sin backend ni servicios nuevos de producción.

## Resumen ejecutivo

Se incorporó un flujo reproducible que combina la API oficial de Google PageSpeed Insights para producción y Lighthouse CLI sobre el build estático local. Los reportes originales se guardan como JSON, los resúmenes legibles como Markdown y la comparación antes/después se genera por comando.

El baseline local ya era sólido: TBT de 0 ms, CLS nulo o prácticamente nulo y puntuaciones de 99–100 en casi todas las rutas. El problema dominante era el LCP móvil de Inicio, seguido por imágenes sobredimensionadas y recursos LCP con carga diferida.

Las correcciones conservaron el diseño y no editaron los archivos fuente usados para crear los derivados. Inicio móvil pasó de **92 a 100** en Performance y de **3,38 s a 1,88 s** de LCP en la mediana de tres ejecuciones. News y la noticia individual redujeron su LCP móvil en aproximadamente **450 ms**. No se eliminó ninguna funcionalidad.

La medición de producción no pudo completarse: la API de Google respondió `HTTP 429` tanto en móvil como en escritorio por cuota diaria agotada para el consumidor compartido sin clave. El error original quedó guardado; no se estimaron ni inventaron resultados de producción ni INP.

## 1. Herramientas y configuración

### Dependencias y entorno usado

- Node.js 22.23.4, según el contrato del proyecto.
- pnpm 12.21.0.
- Lighthouse CLI 13.6.0 como única dependencia nueva de desarrollo.
- Google Chrome 157.0.8103.79 en `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- `fetch` nativo de Node para PageSpeed; no se instaló un SDK de Google.
- Servidor HTTP temporal propio, enlazado sólo a `127.0.0.1`, para servir `dist` con compresión de texto durante Lighthouse.

Archivos principales:

- `scripts/performance/pagespeed.mjs`: PageSpeed Insights API.
- `scripts/performance/lighthouse-local.mjs`: servidor estático, Chrome y Lighthouse repetido.
- `scripts/performance/compare.mjs`: comparación de dos resúmenes.
- `scripts/performance/config.mjs`: rutas, categorías y valores predeterminados.
- `scripts/performance/lib.mjs`: extracción de métricas, CrUX, oportunidades, recursos y Markdown.

### Rutas auditadas localmente

- `/`
- `/banda/`
- `/en-vivo/`
- `/media/`
- `/news/`
- `/news/desde-la-raiz-comienza-nuestra-historia-en-vivo/`

Cada ruta se prueba en móvil y escritorio. El valor predeterminado es **tres ejecuciones por combinación** y el resumen usa la mediana para reducir variaciones.

### Reportes y política Git

Cada ejecución crea `reports/performance/<etiqueta>-<fuente>-<fecha>/` con:

- `raw/*.json`: respuesta original de PageSpeed o Lighthouse por ejecución.
- `summary.json`: datos normalizados para comparación.
- `SUMMARY.md`: resumen legible.

Los JSON y HTML de auditoría están ignorados por Git por volumen. Los resúmenes Markdown puntuales sí pueden versionarse. Nunca se escriben claves en archivos del repositorio.

## 2. Cómo ejecutar las mediciones

Todos los comandos se pueden ejecutar en la terminal integrada de VS Code o desde Codex. En Codex, macOS puede pedir autorización para abrir el servidor local y Chrome headless.

### Producción con PageSpeed Insights

```bash
nvm use
pnpm perf:production
```

Configuración opcional:

```bash
PAGESPEED_API_KEY="tu-clave" pnpm perf:production -- \
  --url=https://tresraicesbanda.cl \
  --strategies=mobile,desktop \
  --timeout=90000 \
  --label=production
```

La clave es opcional y sólo se lee desde `PAGESPEED_API_KEY`. Los archivos `.env*` están ignorados, pero se recomienda exportarla en la sesión del terminal. La API se consulta una vez por estrategia con las categorías `performance`, `accessibility`, `best-practices` y `seo`.

Si Google responde con error HTTP, cuota o timeout, el script guarda la respuesta disponible, genera un resumen con la causa y termina con código distinto de cero.

### Build estático local con Lighthouse

```bash
nvm use
pnpm perf:local
```

El comando ejecuta primero `pnpm run build`; Lighthouse no mide el servidor de desarrollo. Ejemplos acotados:

```bash
# Una sola ruta, una estrategia y una repetición
pnpm perf:local -- --routes=/ --strategies=mobile --runs=1 --label=smoke

# Reanudar una corrida interrumpida y reutilizar JSON válidos
pnpm perf:local -- --label=after --runs=3 \
  --resume=reports/performance/after-local-AAAA-MM-DDTHH-MM-SS-ZZZZ
```

También se admiten `--dist`, `--chrome`, `--timeout` y `--output`. `CHROME_PATH` es una alternativa a `--chrome`.

### Comparación

```bash
# Compara automáticamente los dos reportes locales más recientes
pnpm perf:compare

# Selección explícita
pnpm perf:compare -- \
  --before=reports/performance/baseline-local-2026-11-18T10-52-03-676Z \
  --after=reports/performance/after-local-2026-11-18T11-08-18-872Z
```

La tabla resultante informa scores, LCP, CLS y TBT antes/después. En tiempo y CLS, un delta negativo es una mejora.

## 3. Baseline de producción

La API oficial se consultó sin `PAGESPEED_API_KEY` para `https://tresraicesbanda.cl/`, en móvil y escritorio. Ambas solicitudes devolvieron:

```text
HTTP 429
Quota exceeded for quota metric 'Queries' and limit 'Queries per day'
of service 'pagespeedonline.googleapis.com'
for consumer 'project_number:583797351490'.
```

Reporte: [`reports/performance/production-baseline-pagespeed-2026-11-18T11-18-21-882Z/SUMMARY.md`](../reports/performance/production-baseline-pagespeed-2026-11-18T11-18-21-882Z/SUMMARY.md).

Por esta limitación externa:

- No existe un baseline válido de producción en esta ejecución.
- No hay datos CrUX que atribuir al sitio.
- INP no se informa, porque no existieron datos de campo válidos.
- El siguiente intento debe usar una clave propia con cuota disponible o ejecutarse cuando se restablezca la cuota compartida.

## 4. Baseline local

Mediana de tres ejecuciones por ruta y estrategia, Lighthouse 13.6.0:

| Ruta | Estrategia | Performance | LCP | CLS | FCP | Speed Index | TBT |
|---|---|---:|---:|---:|---:|---:|---:|
| `/` | móvil | 92 | 3,38 s | 0,000 | 754 ms | 754 ms | 0 ms |
| `/` | escritorio | 99 | 884 ms | 0,000 | 203 ms | 203 ms | 0 ms |
| `/banda/` | móvil | 99 | 2,10 s | 0,000 | 752 ms | 752 ms | 0 ms |
| `/banda/` | escritorio | 100 | 203 ms | 0,000 | 203 ms | 203 ms | 0 ms |
| `/en-vivo/` | móvil | 99 | 2,03 s | 0,000 | 753 ms | 753 ms | 0 ms |
| `/en-vivo/` | escritorio | 100 | 444 ms | 0,001 | 203 ms | 203 ms | 0 ms |
| `/media/` | móvil | 100 | 1,73 s | 0,000 | 752 ms | 752 ms | 0 ms |
| `/media/` | escritorio | 100 | 405 ms | 0,000 | 203 ms | 203 ms | 0 ms |
| `/news/` | móvil | 99 | 2,25 s | 0,000 | 752 ms | 752 ms | 0 ms |
| `/news/` | escritorio | 100 | 483 ms | 0,000 | 203 ms | 203 ms | 0 ms |
| Noticia individual | móvil | 99 | 2,25 s | 0,000 | 752 ms | 752 ms | 0 ms |
| Noticia individual | escritorio | 100 | 481 ms | 0,000 | 201 ms | 201 ms | 0 ms |

Accessibility fue 96, Best Practices 100 y SEO 100 en todas las combinaciones. El 96 corresponde a contraste ya existente y no se alteró dentro de esta optimización de rendimiento.

Reporte completo: [`reports/performance/baseline-local-2026-11-18T10-52-03-676Z/SUMMARY.md`](../reports/performance/baseline-local-2026-11-18T10-52-03-676Z/SUMMARY.md).

## 5. Tres problemas principales

### 5.1 Hero sin prioridad explícita

El hero era el LCP de Inicio móvil. Lighthouse lo encontraba en el HTML y no estaba marcado como lazy, pero pedía `fetchpriority="high"`. El LCP mediano era 3,38 s.

### 5.2 Imágenes mayores que su representación

El mismo archivo se entregaba a todos los anchos. Lighthouse estimó antes de corregir:

- Hasta 304 KiB evitables en La Banda móvil.
- 206 KiB evitables en En Vivo móvil.
- 174 KiB evitables en Inicio móvil.
- 95–98 KiB evitables en News y la noticia individual.

El logo horizontal de 1620 × 971 px se descargaba completo para mostrarse a 112–128 px CSS. Afiches, fotos de integrantes y galería tampoco tenían `srcset`/`sizes`.

### 5.3 LCP marcado como lazy en páginas interiores

La foto grupal de La Banda, el primer afiche de En Vivo y la miniatura principal de Media podían convertirse en LCP, pero tenían carga diferida. En La Banda y Media, Lighthouse indicaba además que el recurso no se descubría a tiempo como candidato LCP.

No se identificó un problema de JavaScript que justificara eliminar funciones: TBT fue 0 ms en las doce combinaciones y el sitio mantiene scripts pequeños para menú, modal, lightbox y clasificación de eventos.

## 6. Correcciones realizadas

### Imágenes y LCP

- Nuevo componente `ResponsiveImage.astro` con dimensiones reales, `srcset`, `sizes` y prioridad controlada.
- Derivados WebP en 240/480 px para el logo; 768/1280 px para la foto grupal; 480/700 px para afiches y portada; 480/720 px para galería; 480 px para integrantes.
- Los derivados se añadieron junto a sus WebP fuente; esta optimización no edita `assets/originales/`, rostros, logos ni contratos Markdown/JSON.
- Hero de Inicio con prioridad alta.
- LCP probable de Banda, En Vivo, Media, News y noticia individual con carga eager y prioridad alta; el resto permanece lazy.
- La noticia destacada de Inicio dejó de ser eager por estar fuera de la vista inicial.
- Dimensiones HTML corregidas a las proporciones reales disponibles mediante el perfil central de imágenes.

### JavaScript de En Vivo

La clasificación del navegador recreaba inmediatamente las tarjetas desde `<template>` aunque el orden ya coincidiera con el HTML estático. Ahora compara IDs y sólo reemplaza el DOM si la fecha de Chile realmente cambia la clasificación. Esto conserva la corrección automática de eventos sin trabajo redundante durante el LCP.

### CSS y fuentes

- Las dos fuentes son locales, pequeñas (aprox. 17 KiB y 13 KiB), usan `font-display: swap` y ya estaban precargadas.
- El CSS comprimido ronda 8 KiB. Lighthouse estima 140–150 ms de bloqueo en la simulación móvil, pero introducir critical CSS o duplicar estilos no se justifica para V1 con scores 99–100.
- No se añadieron pesos, fuentes ni capas CSS.

### Scripts de auditoría

- Manejo de HTTP, cuota, respuesta no JSON, timeout y ausencia de Lighthouse.
- Clave opcional exclusivamente por variable de entorno.
- Detección de Chrome y cierre seguro del servidor aun cuando Chrome cancela solicitudes.
- Reanudación de corridas locales parciales.
- Separación explícita entre laboratorio Lighthouse y campo CrUX; INP sólo aparece si la API entrega un percentil válido.

## 7. Resultados comparativos

| Ruta | Estrategia | Performance antes → después | LCP antes → después | Δ LCP | CLS después | TBT después |
|---|---|---:|---:|---:|---:|---:|
| `/` | móvil | 92 → 100 | 3,38 s → 1,88 s | **−1,50 s** | 0,000 | 0 ms |
| `/` | escritorio | 99 → 100 | 884 → 644 ms | **−240 ms** | 0,000 | 0 ms |
| `/banda/` | móvil | 99 → 100 | 2,10 s → 1,88 s | **−227 ms** | 0,000 | 0 ms |
| `/banda/` | escritorio | 100 → 100 | 203 → 203 ms | 0 ms | 0,000 | 0 ms |
| `/en-vivo/` | móvil | 99 → 99 | 2,03 s → 2,18 s | +149 ms | 0,000 | 0 ms |
| `/en-vivo/` | escritorio | 100 → 100 | 444 → 422 ms | −22 ms | 0,000 | 0 ms |
| `/media/` | móvil | 100 → 100 | 1,73 s → 1,58 s | **−150 ms** | 0,000 | 0 ms |
| `/media/` | escritorio | 100 → 100 | 405 → 468 ms | +63 ms | 0,000 | 0 ms |
| `/news/` | móvil | 99 → 100 | 2,25 s → 1,80 s | **−450 ms** | 0,000 | 0 ms |
| `/news/` | escritorio | 100 → 100 | 483 → 402 ms | **−81 ms** | 0,000 | 0 ms |
| Noticia individual | móvil | 99 → 100 | 2,25 s → 1,80 s | **−449 ms** | 0,000 | 0 ms |
| Noticia individual | escritorio | 100 → 100 | 481 → 402 ms | **−80 ms** | 0,000 | 0 ms |

Transferencia total observada en la ejecución representativa:

| Ruta | Móvil | Escritorio |
|---|---:|---:|
| Inicio | −217 KB | −472 KB |
| La Banda | −178 KB | −198 KB |
| En Vivo | −130 KB | −201 KB |
| Media | −50 KB | −50 KB |
| News | −70 KB | −95 KB |
| Noticia individual | −70 KB | −95 KB |

La variación de En Vivo móvil se comprobó con tres ejecuciones adicionales sobre el código final. Aunque el LCP agregado se mantuvo en 2,18 s, la descomposición mejoró: el retraso para iniciar el recurso bajó de 42 a 20 ms, el retraso de render de 37 a 31 ms, el afiche pasó de 93 a 74 KB y ahora cumple prioridad alta/eager. El score permanece en 99. Se conserva la corrección porque los subcomponentes y la transferencia mejoran; los 149 ms agregados corresponden a la discretización/variación de la simulación Lighthouse, no a una ruta de red más lenta.

Reportes:

- [`reports/performance/after-local-2026-11-18T11-08-18-872Z/SUMMARY.md`](../reports/performance/after-local-2026-11-18T11-08-18-872Z/SUMMARY.md)
- [`reports/performance/comparison-2026-11-18T11-15-12-913Z.md`](../reports/performance/comparison-2026-11-18T11-15-12-913Z.md)
- [`reports/performance/after-en-vivo-fix-local-2026-11-18T11-16-29-339Z/SUMMARY.md`](../reports/performance/after-en-vivo-fix-local-2026-11-18T11-16-29-339Z/SUMMARY.md)

## 8. Pendientes de optimización

1. Repetir `pnpm perf:production` con una clave propia que tenga cuota o cuando se restablezca la cuota compartida; sólo entonces registrar baseline PageSpeed/CrUX e INP si existe.
2. Confirmar las métricas de producción después de un despliegue manual. Estos cambios no se publicaron.
3. Evaluar derivados de 320 px para tarjetas bajo el pliegue si la galería y el archivo de noticias crecen. El impacto actual no afecta los LCP principales.
4. Revisar por separado el contraste que mantiene Accessibility en 96, sin sacrificar el manual creativo.
5. Mantener el CSS único mientras el transfer siga alrededor de 8 KiB; no introducir critical CSS hasta que una medición de producción demuestre beneficio estable.
6. Al agregar o reemplazar imágenes editoriales, generar derivados equivalentes y registrar su perfil en `src/lib/image-variants.ts`. Una imagen sin perfil sigue funcionando con el original, pero no obtiene `srcset`.

## 9. Verificaciones ejecutadas

- `pnpm run check`: 42 archivos, 0 errores, 0 warnings, 0 hints.
- `pnpm run build`: 9 páginas estáticas generadas correctamente.
- `pnpm run test`: 24 pruebas aprobadas, 0 fallidas.
- Lighthouse baseline: 36 auditorías válidas.
- Lighthouse después: 36 auditorías válidas, más 6 auditorías de verificación para En Vivo.
- QA visual en Chrome: escritorio y viewport responsive 393 × 844 px para Inicio y En Vivo.
- El editor local no se añadió a `dist`; no hubo commit, push, despliegue, cambios de Cloudflare ni DNS.
