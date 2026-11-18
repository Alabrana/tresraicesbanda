# Tres Raíces — Plan SEO integral V1

**Fecha de auditoría:** 18 de noviembre de 2026  
**Sitio oficial:** <https://tresraicesbanda.cl>  
**Alcance:** auditoría, plan e implementación local de metadatos definitivos; sin cambios de diseño, contenido visible, DNS ni despliegue.
**Arquitectura respetada:** Astro SSG (`output: 'static'`) en Cloudflare Pages, sin backend, SSR, base de datos ni servicios de pago.

## Actualización de implementación — 18 de noviembre de 2026

Se implementó el lote técnico de metadatos definitivos aprobado. La auditoría original se conserva debajo como registro del estado anterior; esta sección representa el estado actual del código y prevalece cuando una observación histórica indica que una función todavía no existía.

### Cambios completados

- Titles y descriptions finales y únicos para Inicio, Banda, En Vivo, Media, News, Galería y Network, sin sufijos duplicados.
- Metadata compartida centralizada en `src/lib/seo.ts`: nombre del sitio, URL principal, `lang`, locale Open Graph, color de tema, identificador estable de la banda, fallback social y textos por ruta.
- `BaseLayout.astro` conserva canonical autorreferente y añade `og:locale`, dimensiones/tipo cuando se conocen, alt para Open Graph y Twitter, `theme-color` y fecha editorial para artículos.
- Inicio incluye un único bloque JSON-LD con `WebSite` y `MusicGroup`, enlazados mediante identificadores estables; la banda conserva Talcahuano, Rock, correo, redes oficiales, logo, fotografía y los tres integrantes confirmados.
- Cada detalle de noticia construye title, description, canonical, Open Graph, `article:published_time` y `BlogPosting` desde el Markdown real. El mismo bloque JSON-LD incluye `BreadcrumbList` para evitar scripts duplicados.
- Se conservaron Astro SSG, sitemap, `robots.txt`, 404 con `noindex`, H1 visibles, diseño, navegación, contratos de eventos y contratos editoriales.
- No se implementó `Event`, `dateModified`, hora de publicación, autor personal, keywords, geolocalización artificial, backend ni servicios externos.

### Comparación de metadatos renderizados

| Ruta | Title anterior | Title definitivo | Description |
|---|---|---|---|
| `/` | `Inicio \| Tres Raíces` | `Tres Raíces \| Rock desde Talcahuano` | Sitio oficial de Tres Raíces, banda de rock chileno oriunda de Talcahuano. Conoce nuestra música, historia, videos y próximas presentaciones en vivo. |
| `/banda/` | `La Banda \| Tres Raíces` | `La Banda \| Tres Raíces, rock desde Talcahuano` | Conoce la historia de Tres Raíces, banda de rock de Talcahuano, y a sus integrantes: Víctor en bajo y voz, Alexis en guitarra y Patricio en batería. |
| `/en-vivo/` | `En Vivo \| Tres Raíces` | `En Vivo \| Presentaciones de Tres Raíces` | Revisa las próximas tocatas de Tres Raíces, sus fechas, lugares y entradas disponibles. Conoce también nuestras presentaciones anteriores. |
| `/media/` | `Media \| Tres Raíces` | `Música y Videos \| Tres Raíces` | Mira videos y registros en vivo de Tres Raíces, banda de rock oriunda de Talcahuano. Encuentra nuestro canal oficial de YouTube y plataformas musicales. |
| `/news/` | `News \| Tres Raíces` | `News \| Noticias de Tres Raíces` | Noticias y novedades de Tres Raíces: nuevas canciones, presentaciones, videos y experiencias de una banda de rock nacida en Talcahuano. |
| `/galeria/` | `Galería \| Tres Raíces` | `Galería \| Fotos de Tres Raíces` | Fotografías de Tres Raíces en ensayos, escenarios y presentaciones en vivo. Imágenes de nuestra historia y el rock que hacemos desde Talcahuano. |
| `/network/` | `Network \| Tres Raíces` | `Network \| Bandas Amigas de Tres Raíces` | Conoce las bandas amigas y los vínculos musicales de Tres Raíces, compartiendo escenarios y rock desde Talcahuano y la escena chilena. |
| Detalle de noticia | Título editorial con sufijo | Sin cambio visible | Summary real de cada Markdown. |

### Estrategia de palabras clave por página

La estrategia se organiza por intención de búsqueda para evitar que todas las rutas compitan por las mismas frases. Las palabras clave son una guía editorial y semántica: no se exige repetirlas literalmente cuando el title, la description y el contenido visible ya expresan la misma intención con lenguaje natural. No se añade `<meta name="keywords">`.

| Ruta | Intención principal | Término principal asignado | Términos relacionados | Respaldo visible actual | Decisión sobre metadata |
|---|---|---|---|---|---|
| `/` | Encontrar el sitio oficial y reconocer origen y género | `Tres Raíces` / `banda de rock de Talcahuano` | `Tres Raíces banda`, `Tres Raíces Talcahuano`, `Tres Raíces Rock`, `Tres Raíces Chile`, `rock chileno`, `rock desde Talcahuano` | Hero con `Talcahuano · Chile`, H1 `Rock & Roll del puerto`, presentación de la banda y accesos a música, noticias y fechas | El title y la description aprobados ya cubren marca, género, origen y contenidos principales. No cambiar. |
| `/banda/` | Conocer la historia, identidad e integrantes | `rock desde Talcahuano` | `rock chorero`, `rock del puerto`, `banda de rock de Talcahuano`, `banda de rock & roll`, `Tres Raíces Talcahuano` | Encabezado `Talcahuano, Chile`; historia ligada al mar, puerto y orígenes choreros; Rock & Roll como base; integrantes e instrumentos | El title prioriza `rock desde Talcahuano` y la description identifica banda, ciudad e integrantes. Los términos choreros quedan respaldados por el cuerpo, sin repetirlos artificialmente en metadata. |
| `/en-vivo/` | Consultar próximas fechas y actuaciones anteriores | `Tres Raíces en vivo` | `tocatas de Tres Raíces`, `presentaciones de Tres Raíces`, `rock en vivo` | H1 `En Vivo`, próxima fecha, historial, recintos, ciudades y entradas cuando existen | El title expresa En Vivo y presentaciones; la description contiene `próximas tocatas de Tres Raíces`. No cambiar. |
| `/media/` | Encontrar música, videos y canales oficiales | `música de Tres Raíces` | `videos de Tres Raíces`, `Tres Raíces Rock`, `rock chileno`, `registros en vivo` | Encabezado `Música y videos de Tres Raíces`, canal oficial de YouTube, plataformas y videos publicados | El title y la description cubren música, videos, registros en vivo, origen y canales oficiales. No cambiar. |
| `/news/` | Consultar novedades oficiales de la banda | `noticias de Tres Raíces` | `Tres Raíces banda`, `nuevas canciones`, `presentaciones de Tres Raíces`, `videos de Tres Raíces` | H1 `News`, noticia destacada y archivo de publicaciones reales | El title identifica noticias de marca y la description delimita canciones, presentaciones y videos. No introducir términos ajenos a cada noticia. |
| `/news/[slug]/` | Resolver la búsqueda concreta de una novedad, canción o presentación | Título editorial y tema real de cada noticia | Marca `Tres Raíces` más términos presentes en su summary y cuerpo; por ejemplo, `Tres Raíces en vivo` o `rock desde Talcahuano` cuando correspondan | H1, summary, fecha, portada y cuerpo procedentes del Markdown real | Metadata dinámica desde Markdown con sufijo de marca. No imponer una frase fija a todas las noticias ni crear nuevos campos obligatorios. |
| `/galeria/` | Buscar imágenes auténticas de la banda | `fotografías de Tres Raíces` | `fotos de Tres Raíces`, `Tres Raíces en vivo`, `rock desde Talcahuano` | H1 `Galería`, fotografías seleccionadas y descripciones reales | El title usa la variante natural `Fotos de Tres Raíces` y la description contiene `Fotografías de Tres Raíces`. No cambiar. |
| `/network/` | Conocer vínculos musicales y bandas amigas | `bandas amigas de Tres Raíces` | `vínculos musicales`, `escena chilena`, `rock desde Talcahuano` | H1 `Network`, eyebrow `Bandas amigas` y tarjetas de vínculos confirmados | Mantener intención propia. No convertir esta ruta en una landing genérica de rock chileno ni añadir nombres de otras agrupaciones como palabras clave. |
| `/404/` | Recuperación de navegación, sin intención de posicionamiento | Ninguno | Ninguno | Mensaje de página no encontrada y enlace a Inicio | Mantener `noindex`; no optimizar para palabras clave. |

#### Distribución de los grupos prioritarios

- **Marca:** Inicio concentra `Tres Raíces` y sus variantes principales. Las páginas interiores combinan la marca con su función específica para evitar competencia interna.
- **Identidad:** Banda desarrolla `rock desde Talcahuano`, `rock chorero`, `rock del puerto` y `banda de rock & roll`; Inicio resume origen y género.
- **Contenido:** En Vivo concentra tocatas y presentaciones; Media concentra música y videos; Galería concentra fotografías; News trabaja novedades reales sin forzar una frase fija.
- **Variantes semánticas:** `fotos`/`fotografías`, `tocatas`/`presentaciones` y `rock & roll`/`rock` se tratan como lenguaje natural relacionado, no como cadenas que deban repetirse juntas.

#### Evaluación editorial

El contenido visible actual respalda las asignaciones principales. No se modifican H1 ni textos visibles en este lote. Las oportunidades futuras deben surgir de información real —nuevas canciones, videos, tocatas o noticias— y no de páginas creadas solo para posicionar términos. Cualquier cambio de copy visible requiere aprobación editorial previa.

### Imagen social oficial configurada

El archivo `public/images/seo/tres-raices-og.webp` fue ajustado a **1200 × 630 px exactos**, conserva la fotografía auténtica de los tres integrantes e incorpora el logo horizontal oficial sin redibujarlo ni alterar su tipografía. Su MIME real es WebP y pesa 125.826 bytes. Está configurado como imagen predeterminada de Open Graph y Twitter mediante URL absoluta, con `og:image:width=1200`, `og:image:height=630`, `og:image:type=image/webp` y texto alternativo descriptivo. Las portadas específicas de noticias se mantienen cuando existen.

La comprobación HTTP `200` de la nueva imagen social queda pendiente hasta desplegar esta versión y verificar la URL pública.

### Validación local posterior

- `pnpm run check` y `pnpm run build`: no pudieron ejecutar sus scripts porque pnpm rechazó su propia identidad al no poder verificarla contra el registro (`ERR_PNPM_PNPM_ENGINE_IDENTITY_UNVERIFIABLE`).
- Binario local `astro check` con Node 22.23.4: 43 archivos, 0 errores, 0 warnings y 0 hints.
- Pruebas existentes con Node 22.23.4: 24 aprobadas, 0 fallidas.
- Build estático con Node 22.23.4: 9 páginas generadas y sitemap creado correctamente.
- HTML generado: un title, una description y un canonical por salida; 8 rutas públicas en sitemap; ninguna URL `pages.dev`; JSON-LD parseable; 404 con `noindex`; editor y admin ausentes de `dist`.
- `robots.txt` conserva rastreo permitido y referencia al sitemap oficial.

### Pendientes externos o de aprobación

1. Tras desplegar, comprobar respuesta HTTP `200`, `Content-Type: image/webp` y previews de Open Graph/Twitter.
2. Validar el HTML publicado con Schema Markup Validator y Rich Results Test.
3. Mantener las comprobaciones manuales de hosts alternativos y Search Console descritas en este plan.

## Resumen ejecutivo

La base SEO técnica es funcional y no debe reconstruirse: el dominio oficial está configurado como `site` de Astro, todas las páginas públicas generan canonical absoluto, existe `robots.txt`, el sitemap incluye las rutas públicas y el detalle de noticia, la página 404 usa `noindex`, la navegación interna es rastreable y el editor local no entra en `dist`.

No se encontró un bloqueo confirmado de indexación en el build actual. Los principales problemas son de calidad y consolidación:

1. Todas las páginas de sección reutilizan la misma meta description genérica porque el texto visible de `PageHeader` no se entrega a `BaseLayout`.
2. Los titles son válidos pero demasiado genéricos, especialmente `Inicio | Tres Raíces`, y no posicionan con claridad a la banda como rock de Talcahuano.
3. La imagen social predeterminada es un logo cuadrado de 251 × 251 px, aunque se declara `summary_large_image`; no existe una imagen social horizontal dedicada.
4. No existe JSON-LD. Conviene añadir una implementación mínima de `MusicGroup`, `BlogPosting` y `BreadcrumbList`, usando solo datos confirmados.
5. El afiche usado en En Vivo y en la noticia pesa 2.052.676 bytes en PNG. Además, varias imágenes carecen de variantes responsive o tienen atributos `width`/`height` que no coinciden con sus dimensiones reales.
6. No fue posible verificar el hostname exacto `*.pages.dev` desde el repositorio. Un canonical no impide por sí solo que una copia accesible sea rastreada o indexada: se debe comprobar y redirigir ese hostname en Cloudflare.
7. `public/images/.DS_Store` se copia a `dist/images/.DS_Store`; no está enlazado ni en el sitemap, pero es un archivo temporal que no debe publicarse.

La prioridad recomendada es consolidar hosts y metadatos, corregir la entrega de imágenes críticas y registrar Search Console. Los datos estructurados y el refinamiento editorial pueden seguir inmediatamente después, sin ampliar la arquitectura V1.

---

## 1. Estado técnico actual

### 1.1 Evidencia revisada

- `AGENTS.md`, documento base, manual creativo, arquitectura, hoja de ruta, contratos y decisiones.
- Auditorías técnica y visual previas, correcciones P0 y `README.md`.
- `astro.config.mjs`, `BaseLayout.astro`, componentes compartidos y todas las páginas públicas.
- Colecciones `news` y `shows`, datos JSON globales, imágenes y recursos bajo `public/`.
- Build estático y salida generada en `dist/`.
- Comprobaciones HTTP puntuales sobre el dominio publicado.
- Documentación oficial vigente de Astro, Cloudflare, Google Search Central, Search Console y Schema.org.

### 1.2 Implementado, verificado y pendiente

| Área | Implementado en código | Verificado localmente | Verificado en producción | Estado / acción |
|---|---|---|---|---|
| Astro SSG | Sí, `output: 'static'` | Build de 9 páginas | El dominio responde desde Cloudflare | Conservar |
| Dominio base | `site: 'https://tresraicesbanda.cl'` | URLs absolutas correctas | Raíz HTTPS `200` | Conservar |
| Canonical | Autorreferente por `Astro.url.pathname` | Correcto en las 9 salidas | No se recuperó todo el HTML remoto por fallos intermitentes del resolver | No rehacer; comprobar en Search Console |
| Meta robots | `index, follow` por defecto; 404 `noindex, follow` | Correcto | 404 remoto devuelve estado `404` | Conservar |
| Open Graph / Twitter | Presente en `BaseLayout` | Correcto en HTML | No validado con depuradores sociales | Extender, no reemplazar |
| Sitemap | `@astrojs/sitemap` con filtro para 404 | 8 URLs públicas | Índice e hijo responden `200` | Conservar |
| `robots.txt` | Permite rastreo y referencia sitemap | Copiado a `dist` | `200 text/plain` | Conservar |
| Noticia individual | `getStaticPaths()` | Se genera una URL de detalle | Endpoint no comprobado individualmente en esta sesión | Conservar |
| 404 | `src/pages/404.astro` | Genera `dist/404.html` | URL inexistente devuelve `404` | Conservar |
| Enlaces internos | HTML estático con `href` normales | 177 enlaces internos, 0 rotos | No se rastrearon todas las rutas remotas | Conservar |
| Editor / admin | Fuera de Astro | No aparece en `dist` | No verificado remotamente | Conservar |
| JSON-LD | No | Ausente en todas las páginas | No aplica | Añadir en P1 |
| Search Console | No verificable desde el repositorio | No aplica | Pendiente manual | Ejecutar en P0 |
| `pages.dev` | No figura el hostname exacto | No verificable | Pendiente en panel Cloudflare | Comprobar y redirigir en P0 |
| Core Web Vitals | Sin medición incluida | Sin Lighthouse disponible | Sin acceso a CrUX/Search Console | Medir; no hay métricas que reportar |

### 1.3 Comprobaciones ejecutadas

- `pnpm run build` no pudo iniciarse en esta sesión porque el gestor rechazó ejecutar pnpm al no poder verificar su firma contra npm (`ERR_PNPM_PNPM_ENGINE_IDENTITY_UNVERIFIABLE`). Es una limitación del entorno de auditoría, no un error del proyecto.
- Usando directamente Node 22.23.4 y los binarios ya instalados:
  - `astro check`: 35 archivos, 0 errores, 0 warnings y 0 hints.
  - `astro build`: 9 páginas estáticas y sitemap generados correctamente.
  - runner nativo de pruebas: 24 aprobadas, 0 fallidas.
- Salida generada:
  - `/`, `/banda/`, `/en-vivo/`, `/media/`, `/news/`, un detalle de noticia, `/galeria/`, `/network/` y `404.html`.
  - 177 enlaces internos revisados; 0 destinos faltantes.
  - No se encontraron archivos o rutas `admin`/`editor` dentro de `dist`.

### 1.4 Producción comprobada el 18 de noviembre de 2026

| Solicitud | Resultado observado |
|---|---|
| `https://tresraicesbanda.cl/` | `200` |
| `https://www.tresraicesbanda.cl/` | `301` a `https://tresraicesbanda.cl/` |
| `http://tresraicesbanda.cl/` | `301` a `https://tresraicesbanda.cl/` |
| `http://www.tresraicesbanda.cl/` | `301` a `https://tresraicesbanda.cl/` |
| URL inexistente de prueba | `404 text/html` |
| `/robots.txt` | `200 text/plain` |
| `/sitemap-index.xml` | `200 application/xml` |
| `/sitemap-0.xml` | `200 application/xml` |

El acceso remoto fue intermitente después de estas comprobaciones: el resolver del entorno dejó de resolver el dominio, y las herramientas de navegador tampoco estuvieron disponibles. Por ello no se atribuyen al sitio publicado comprobaciones que solo se realizaron contra el build local.

### 1.5 Indexación, canonical y hosts

#### Correcto

- Existe un único dominio declarado: `https://tresraicesbanda.cl`.
- `BaseLayout.astro` construye el canonical con el pathname y el `site` de Astro; elimina parámetros de consulta y genera URL absoluta.
- Todas las páginas públicas del build tienen canonical autorreferente con HTTPS, dominio raíz y slash final.
- Todas usan `index, follow`, excepto la 404, que usa `noindex, follow`.
- HTTP y `www` redirigen con `301` al dominio HTTPS raíz, al menos en la portada comprobada.
- Los enlaces internos apuntan a rutas canónicas con slash final.
- El sitemap solo enumera el dominio oficial.

Google considera las redirecciones y `rel="canonical"` señales fuertes y el sitemap una señal más débil; aun así, Google decide finalmente la canonical. No debe suponerse que el canonical elimina por sí solo una copia accesible. Referencia: [Google — consolidar URLs duplicadas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

#### Pendiente

1. Identificar en **Workers & Pages → proyecto** el hostname de producción `<proyecto>.pages.dev`.
2. Abrir la portada y una ruta profunda en ese hostname.
3. Si entrega el mismo sitio con `200`, crear un Bulk Redirect `301` al dominio oficial, preservando query string, subpath y sufijo de ruta. Cloudflare documenta expresamente este procedimiento para evitar que el contenido se sirva también desde `pages.dev`: [Cloudflare — redirect `pages.dev` to custom domain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/).
4. Probar también `www` con una ruta profunda y parámetros, no solo la portada.
5. En Search Console, comparar **canonical declarada** y **canonical seleccionada por Google** para el dominio raíz, `www` y cualquier `pages.dev` descubierto.

### 1.6 Exclusión de contenido no público

- El editor local está fuera de `src/pages` y no aparece en `dist`: correcto.
- Las fixtures de pruebas no se publican: correcto.
- La 404 queda fuera del sitemap y tiene `noindex`: correcto.
- `dist/images/.DS_Store` sí se publica por provenir de `public/images/.DS_Store`: retirar ese archivo y prevenir su reaparición.
- No aparecen patrones antiguos `Nombre de...` o `ejemplo.cl` en las rutas principales, pero dos registros requieren confirmación manual antes de tratarlos como oficiales:
  - `Mister a` reutiliza logo y URL de `Mister O` en `network.json`.
  - `Gutierres Arquitectos` enlaza a `https://www.google.cl` en `collaborators.json`.

No se afirma que esos registros sean ficticios; se marca que su autenticidad y destino no pueden confirmarse con el repositorio. Si no son definitivos, deben ocultarse mediante el campo `visible` ya existente, sin crear estados editoriales nuevos.

### 1.7 Sitemap y `robots.txt`

El sitemap está generado correctamente por la integración oficial de Astro:

- `sitemap-index.xml` referencia `https://tresraicesbanda.cl/sitemap-0.xml`.
- `sitemap-0.xml` contiene 8 URLs:
  - Inicio.
  - Banda.
  - En Vivo.
  - Galería.
  - Media.
  - Network.
  - News.
  - La noticia individual actual.
- No contiene 404, editor ni rutas administrativas.
- Todas las URLs usan el dominio oficial.
- `robots.txt` permite rastreo y referencia el índice del sitemap.

No se recomienda crear un sitemap de Google News. La presencia del namespace XML `news` en la salida genérica no convierte este archivo en un sitemap especializado; el sitio es una web musical con novedades, no se ha establecido elegibilidad como medio informativo.

Tampoco se recomienda inventar `lastmod`: el contrato actual no conserva una fecha de modificación fiable. Puede evaluarse en P2 solo si se deriva de datos editoriales reales y mantenibles.

---

## 2. Matriz SEO por página

### 2.1 Estado actual generado

Todas las rutas incluyen canonical, Open Graph y Twitter Cards. Salvo el detalle de noticia, usan la misma descripción y el mismo logo social.

| Ruta | Title actual | Meta description actual | H1 actual | Canonical | OG / imagen social | Problema principal |
|---|---|---|---|---|---|---|
| `/` | `Inicio \| Tres Raíces` | `Sitio oficial de Tres Raíces, rock desde Talcahuano.` | `Rock & Roll del puerto` | `https://tresraicesbanda.cl/` | `website`; logo redondo 251 × 251 | Title débil; H1 no nombra la entidad; imagen pequeña para tarjeta grande |
| `/banda/` | `La Banda \| Tres Raíces` | Descripción global genérica | `La Banda` | `https://tresraicesbanda.cl/banda/` | `website`; logo redondo | No resume historia, origen ni integrantes en el snippet |
| `/en-vivo/` | `En Vivo \| Tres Raíces` | Descripción global genérica | `En Vivo` | `https://tresraicesbanda.cl/en-vivo/` | `website`; logo redondo | No expresa presentaciones ni Talcahuano en metadata |
| `/media/` | `Media \| Tres Raíces` | Descripción global genérica | `Media` | `https://tresraicesbanda.cl/media/` | `website`; logo redondo | “Media” es poco descriptivo fuera del contexto del sitio |
| `/news/` | `News \| Tres Raíces` | Descripción global genérica | `News` | `https://tresraicesbanda.cl/news/` | `website`; logo redondo | No explica que son novedades musicales de la banda |
| `/news/desde-la-raiz-comienza-nuestra-historia-en-vivo/` | `Desde la Raíz: comienza nuestra historia en vivo \| Tres Raíces` | Resumen real de la noticia | Título de la noticia | Canonical absoluto correcto | `article`; afiche PNG vertical de 2,05 MB | Metadata específica correcta; imagen pesada y relación poco adecuada para compartir |
| `/galeria/` | `Galería \| Tres Raíces` | Descripción global genérica | `Galería` | `https://tresraicesbanda.cl/galeria/` | `website`; logo redondo | No describe fotos de la banda o actuaciones |
| `/network/` | `Network \| Tres Raíces` | Descripción global genérica | `Network` | `https://tresraicesbanda.cl/network/` | `website`; logo redondo | Término ambiguo y contenido oficial pendiente de confirmar |

La causa de las descriptions repetidas está en la separación de responsabilidades: `PageHeader` recibe descripciones visibles, pero las páginas no pasan `description` a `BaseLayout`. La solución debe reutilizar ambos componentes y una única fuente de metadata, no duplicar layouts.

### 2.2 Titles, descriptions y H1 propuestos

Las siguientes cadenas son propuestas editoriales para revisión. Se muestran como resultado final renderizado; la implementación debe evitar añadir dos veces `| Tres Raíces`.

| Ruta | Title propuesto | Meta description propuesta | H1 recomendado | Extensión title / description |
|---|---|---|---|---:|
| `/` | `Tres Raíces \| Banda de rock de Talcahuano` | `Sitio oficial de Tres Raíces, banda de rock chileno oriunda de Talcahuano. Conoce su historia, música, videos, noticias y próximas presentaciones en vivo.` | `Tres Raíces: Rock & Roll del puerto` | 41 / 154 aprox. |
| `/banda/` | `La banda \| Tres Raíces, rock de Talcahuano` | `Conoce la historia de Tres Raíces, banda de rock oriunda de Talcahuano, y a Víctor, Alex y Pato: bajo y voz, guitarra y batería.` | `Tres Raíces: la banda` | 42 / 128 |
| `/en-vivo/` | `Tres Raíces en vivo \| Próximas presentaciones` | `Revisa las próximas presentaciones en vivo de Tres Raíces y el archivo de fechas de esta banda de rock de Talcahuano.` | `Tres Raíces en vivo` | 45 / 117 |
| `/media/` | `Música y videos \| Tres Raíces` | `Mira videos y escucha la música de Tres Raíces, banda de rock de Talcahuano, Chile, con registros de sus presentaciones en vivo.` | `Música y videos de Tres Raíces` | 29 / 128 |
| `/news/` | `News \| Novedades de Tres Raíces` | `Noticias y novedades de Tres Raíces: música, presentaciones en vivo y el camino de esta banda de rock oriunda de Talcahuano.` | `News de Tres Raíces` | 31 / 124 |
| Detalle actual | `Desde la Raíz: comienza nuestra historia en vivo \| Tres Raíces` | `Tres Raíces inicia su etapa en vivo con Desde la Raíz: una noche de rock en Zalsipuedes, Talcahuano, junto a Lucius Band y Santos en la Corte.` | Mantener título editorial actual | 62 / 142 |
| `/galeria/` | `Galería \| Tres Raíces en vivo` | `Fotografías de Tres Raíces sobre el escenario: Víctor, Alex y Pato, rock desde Talcahuano.` | `Galería de Tres Raíces` | 29 / 90 |
| `/network/` | `Bandas amigas \| Network de Tres Raíces` | `Conoce las bandas amigas y vínculos de la escena que acompañan el camino de Tres Raíces, rock desde Talcahuano.` | `Bandas amigas de Tres Raíces` | 38 / 111 |

Los H1 propuestos cambian texto visible y, por tanto, requieren aprobación editorial. Los titles y descriptions pueden implementarse sin alterar la composición visual. No es necesario forzar todas las palabras clave en todas las páginas: la intención se reparte naturalmente por ruta.

### 2.3 Open Graph y social por ruta

| Grupo | Recomendación |
|---|---|
| Inicio / Banda | Derivado horizontal 1200 × 630 de una foto grupal auténtica, con logo oficial proporcionado y sin alterar rostros |
| En Vivo | Imagen horizontal confirmada de una presentación o derivado del afiche vigente que no corte información esencial |
| Media | Fotograma o miniatura auténtica del video, almacenada como derivado social si hay autorización; no depender de una URL que pueda cambiar |
| News | Imagen general auténtica para el índice; cada detalle debe usar su portada o un derivado social específico |
| Galería | Fotografía real representativa, con recorte aprobado |
| Network | Imagen oficial de Tres Raíces; no usar como imagen social el logo de una banda amiga |

Extender el OG actual con `og:locale: es_CL`, `og:image:width`, `og:image:height`, `og:image:type` y `twitter:image:alt`. Para noticias, añadir `article:published_time` usando solo la fecha conocida. No añadir una cuenta de X/Twitter porque no fue confirmada.

---

## 3. Errores críticos y hallazgos P0

### 3.1 Bloqueos de indexación confirmados

**Ninguno en el build auditado.** Canonical, robots, sitemap, 404 y enlaces internos están operativos. Los siguientes P0 son riesgos o deficiencias importantes que conviene resolver antes de considerar cerrado el SEO V1.

| ID | Hallazgo | Evidencia | Riesgo | Resolución |
|---|---|---|---|---|
| SEO-P0-01 | `pages.dev` no verificado | El hostname exacto no existe en el repositorio ni hubo acceso al panel | Contenido duplicado accesible pese al canonical | Identificar y redirigir `301` a dominio oficial, preservando ruta y query |
| SEO-P0-02 | Descripciones duplicadas | 7 rutas usan la descripción global | Snippets poco diferenciados y menor claridad temática | Pasar metadata específica al layout compartido |
| SEO-P0-03 | Imagen social insuficiente | Logo 251 × 251 con `summary_large_image` | Previews pequeñas, recortadas o poco expresivas | Crear derivado social auténtico 1200 × 630 y variantes de artículo |
| SEO-P0-04 | Afiche de 2,05 MB | `Flyer Zalsi Nov 2026.png` se usa en En Vivo y News; existe un WebP de 95 KB aún no referenciado | LCP y transferencia móvil innecesarios | Validar el WebP disponible, referenciar derivados por uso y conservar el original |
| SEO-P0-05 | Dimensiones HTML incorrectas | Portada de artículo declara 1600 × 900, pero el archivo mide 1122 × 1402; posters declaran 1200 × 900 | Reserva de espacio incorrecta y riesgo de CLS | Usar dimensiones reales o contenedor de aspecto explícito y estable |
| SEO-P0-06 | Archivo temporal público | `.DS_Store` aparece en `dist/images` | Higiene de despliegue y exposición innecesaria | Retirar de `public` y añadir prevención en Git |
| SEO-P0-07 | Registros externos no confirmados | Duplicación `Mister a`/`Mister O` y enlace genérico de colaborador | Señales de confianza y experiencia de usuario | Confirmar manualmente; ocultar si no son definitivos |

---

## 4. Mejoras recomendadas

### 4.1 Mantener lo que ya funciona

- No reemplazar `@astrojs/sitemap` ni crear un sitemap manual.
- No duplicar canonical en cada página: extender `BaseLayout` como única fuente.
- No cambiar `robots.txt` salvo que aparezca una ruta pública nueva que realmente deba excluirse.
- No crear una segunda 404 ni redirecciones de host dentro de Astro; los hosts se consolidan en Cloudflare.
- No introducir un plugin SEO pesado. Las necesidades V1 se resuelven con props tipadas y JSON-LD estático.
- No añadir SSR, Functions, API ni base de datos.

### 4.2 Metadata técnica

1. Definir en cada página un objeto o props compartidas con title final, description, imagen y alt.
2. Permitir que Inicio defina un title completo sin producir `... | Tres Raíces | Tres Raíces`.
3. Mantener canonical derivado automáticamente.
4. Mantener `og:type="website"` para secciones y `article` para noticias.
5. Añadir metadata específica de artículo y social image con dimensiones conocidas.
6. Validar que todos los metadatos generados sean URLs absolutas y que la imagen responda `200`.

### 4.3 Contenido SEO sustentado en material real

- **Inicio:** mantener la voz “Rock & Roll del puerto”; el title y una frase breve pueden aclarar que Tres Raíces es una banda de rock de Talcahuano sin convertir el hero en texto publicitario.
- **Banda:** es la página con mayor base semántica real. Conservar los antecedentes del Liceo Industrial, el reencuentro y la identidad chorera. Corregir en una revisión editorial separada errores mecánicos como `escenario.Su`, sin reescribir la historia.
- **En Vivo:** preservar fechas, recintos, ciudades y estados. No generar páginas individuales de tocatas en V1. El archivo de actuaciones aporta información real y no necesita páginas artificiales por ciudad o palabra clave.
- **Media:** añadir fecha y descripción de cada video solo cuando se conozcan. El título actual ya contiene banda, actuación, festival, ciudad y año; no repetirlos artificialmente en párrafos.
- **News:** publicar novedades reales con título específico, resumen útil y enlaces internos a En Vivo, Media o Galería solo cuando ayuden al lector.
- **Galería:** las descripciones ya funcionan como alt. Revisar ortografía y precisión editorial antes de aumentar la colección.
- **Network:** no es una landing de keywords. Su valor es demostrar vínculos reales de escena; publicar solo bandas confirmadas.

No se recomienda crear páginas como `/rock-chileno`, `/banda-rock-talcahuano` o equivalentes. Las entidades y temas se pueden cubrir con las rutas existentes.

### 4.4 Enlazado interno

La navegación principal ya hace rastreables todas las secciones. Mejoras pequeñas:

- En cada noticia, enlazar de forma editorial a la fecha relacionada en `/en-vivo/` o a un video en `/media/` cuando exista relación real.
- Desde En Vivo, enlazar a la noticia asociada solo si existe un vínculo estable entre contenidos.
- Mantener enlaces descriptivos (`Ver fechas`, `Leer noticia`, `Música y videos`) y evitar “haz clic aquí”.
- No introducir taxonomías, tags o paginación hasta que el volumen de contenido real lo justifique.

---

## 5. Datos estructurados propuestos

### 5.1 Estado actual

No existen scripts `application/ld+json` en el build. Open Graph no sustituye Schema.org; ambos cumplen funciones distintas.

Schema.org define `MusicGroup` para bandas y grupos musicales: [Schema.org — MusicGroup](https://schema.org/MusicGroup). Google admite `Article` o `BlogPosting` para artículos y no garantiza rich results aunque el marcado sea válido: [Google — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article).

### 5.2 `MusicGroup`

Implementar una entidad estable, idealmente en Inicio, con un `@id` reutilizable:

```json
{
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "@id": "https://tresraicesbanda.cl/#musicgroup",
  "name": "Tres Raíces",
  "url": "https://tresraicesbanda.cl/",
  "description": "Banda de rock oriunda de Talcahuano, Chile.",
  "genre": "Rock",
  "email": "tresraicesbanda@gmail.com",
  "logo": "https://tresraicesbanda.cl/images/logos/logoredondo.webp",
  "image": "https://tresraicesbanda.cl/images/band/tresRaices1.webp",
  "sameAs": [
    "https://www.youtube.com/@tresraicesbanda",
    "https://www.instagram.com/tresraicesbanda",
    "https://www.facebook.com/profile.php?id=61589867742279",
    "https://www.tiktok.com/@tresraicesbanda"
  ],
  "member": [
    { "@type": "Person", "name": "Víctor", "description": "Bajo y voz" },
    { "@type": "Person", "name": "Alex", "description": "Guitarra" },
    { "@type": "Person", "name": "Pato", "description": "Batería" }
  ]
}
```

No añadir Spotify, fecha de fundación, discografía, premios, coordenadas ni otros atributos no confirmados.

### 5.3 `BlogPosting` para cada noticia

`BlogPosting` es más preciso que `NewsArticle` para novedades de una banda que no se presenta como medio periodístico.

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://tresraicesbanda.cl/news/desde-la-raiz-comienza-nuestra-historia-en-vivo/#article",
  "mainEntityOfPage": "https://tresraicesbanda.cl/news/desde-la-raiz-comienza-nuestra-historia-en-vivo/",
  "headline": "Desde la Raíz: comienza nuestra historia en vivo",
  "description": "Tres Raíces prepara una nueva noche de rock en Talcahuano.",
  "datePublished": "2026-11-16",
  "inLanguage": "es-CL",
  "image": "https://tresraicesbanda.cl/images/shows/Flyer%20Zalsi%20Nov%202026.png",
  "author": {
    "@type": "MusicGroup",
    "@id": "https://tresraicesbanda.cl/#musicgroup",
    "name": "Tres Raíces",
    "url": "https://tresraicesbanda.cl/"
  },
  "publisher": {
    "@type": "MusicGroup",
    "@id": "https://tresraicesbanda.cl/#musicgroup",
    "name": "Tres Raíces",
    "url": "https://tresraicesbanda.cl/"
  }
}
```

Usar el summary completo real en producción. No añadir `dateModified` hasta contar con un dato editorial fiable. No inventar hora de publicación; la fecha civil actual es el único dato confirmado.

### 5.4 `BreadcrumbList`

Aplicar al detalle de noticia, donde sí existe una jerarquía clara:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://tresraicesbanda.cl/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "News",
      "item": "https://tresraicesbanda.cl/news/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Desde la Raíz: comienza nuestra historia en vivo"
    }
  ]
}
```

Referencia: [Google — Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

### 5.5 `Event`, analizado por separado

No implementar `Event` en V1. La arquitectura actual solo ofrece un listado en `/en-vivo/`, mientras que Google exige para su experiencia de eventos una URL única por evento y una página enfocada en un solo evento: [Google — Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event).

Crear páginas individuales de tocatas modificaría el mapa público y requiere aprobación. Hasta entonces:

- conservar datos de eventos como contenido visible normal;
- no prometer resultados enriquecidos de eventos;
- evaluar en una versión futura si el valor SEO justifica ampliar alcance;
- si se aprueba, reutilizar los contratos existentes y mapear estados a `EventScheduled`, `EventCancelled`, `EventPostponed` o `EventRescheduled` sin inventar información.

### 5.6 Validación

Antes de desplegar:

1. Validar JSON con Schema Markup Validator.
2. Validar `BlogPosting` y breadcrumbs con Rich Results Test.
3. Comprobar que los valores coincidan con contenido visible.
4. Tras desplegar, usar Inspección de URLs para ver el HTML que procesa Google.
5. No considerar el test correcto como promesa de rich result; Google decide su presentación.

---

## 6. Optimización de imágenes y rendimiento

### 6.1 Inventario real

| Grupo / archivo | Dimensiones | Peso | Estado actual | Recomendación |
|---|---:|---:|---|---|
| Hero / foto grupal `tresRaices1.webp` | 1535 × 1024 | 175.258 B | WebP; se descarga completa; sin `srcset`, `sizes` ni `fetchpriority` | Variantes 640/960/1280/1535; `fetchpriority="high"`; dimensiones estables |
| Fotos de integrantes | 692–706 × 1064 | 44.890–64.130 B c/u | WebP y lazy; atributos declarados 768 × 1024 no coinciden | Corregir dimensiones; variantes 360/520/700 si la ganancia lo justifica |
| Afiche `Flyer Zalsi Nov 2026.png` | 1122 × 1402 | 2.052.676 B | PNG, usado en evento, noticia, cards y OG | Derivados AVIF/WebP por uso; conservar PNG original sin alterarlo |
| Candidato `ZalsiPuedesTresRaices.webp` | 878 × 1116 | 95.054 B | Archivo no versionado y no referenciado por contenido | Confirmar calidad/autoría; puede servir como derivado web si se aprueba |
| `iceBar.webp` | 940 × 1236 | 91.084 B | WebP; dimensiones HTML genéricas incorrectas | Dimensiones reales y `srcset` para card |
| `kutralKo1.webp` | 1014 × 1350 | 97.228 B | WebP; dimensiones HTML genéricas incorrectas | Dimensiones reales y `srcset` para card |
| Galería | ~1090 × 1422–1443 | 159.980–168.616 B c/u | WebP, lazy, sin variantes | Variantes 360/720/1080 y `sizes`; mantener rostros y encuadre aprobados |
| Miniatura Media | 480 × 360 remota | No medido | `i.ytimg.com`, lazy; iframe solo al interactuar | Mantener carga diferida; evaluar derivado local solo con autorización y proceso editorial |
| Logo horizontal | 1620 × 971 | 57.876 B | WebP; se muestra a 112–128 px | Baja prioridad; generar versión menor solo si la medición prueba beneficio |
| Logo redondo | 251 × 251 | 16.384 B | Favicon y OG global | Adecuado como favicon; insuficiente como `summary_large_image` |
| Logo Network `misterO.avif` | Dimensión no extraída por el lector nativo | 22.679 B | AVIF | Confirmar dimensiones y contenido; mantener si es oficial |

### 6.2 Estrategia mínima

- No modificar ni borrar `assets/originales/`.
- Generar derivados web nuevos y trazables; no sobrescribir originales.
- Mantener WebP como fallback y usar AVIF cuando reduzca peso sin degradación visible.
- Usar `<picture>`/`srcset`/`sizes` con anchos ajustados a los contenedores reales.
- Priorizar primero Hero, portada de News y afiche de En Vivo; son los candidatos con mayor impacto.
- Declarar ancho y alto reales o una relación de aspecto estable para toda imagen.
- Mantener `loading="lazy"` fuera del primer pantallazo.
- No usar lazy en el candidato LCP. En Inicio, marcar la foto Hero como prioritaria; en detalle de noticia, hacer lo mismo con la portada si la medición confirma que es el LCP.
- Crear imágenes sociales independientes de las variantes de visualización. Una imagen OG no debe depender del recorte CSS de la página.

Como las imágenes viven en `public/`, Astro las copia sin transformarlas. La opción más sencilla para V1 es generar derivados de forma controlada y referenciarlos explícitamente, sin añadir una capa o servicio de imágenes.

### 6.3 LCP, CLS e INP

No se reportan valores numéricos: Lighthouse no está instalado, el navegador integrado no estuvo disponible, PageSpeed Insights no pudo ejecutarse por conectividad del entorno y no hubo acceso a datos CrUX/Search Console.

Riesgos observables, no métricas:

| Métrica | Riesgo observado | Hipótesis a validar |
|---|---|---|
| LCP | Hero sin prioridad ni variantes; portada/afiche de 2,05 MB | El Hero puede ser el LCP de Inicio y el afiche el LCP de News/detalle |
| CLS | Dimensiones declaradas no coinciden con algunos archivos; imágenes adicionales y logos no siempre reservan espacio | Puede haber desplazamiento en detalle, cards y colaboradores |
| INP | JavaScript pequeño; iframes de YouTube se crean bajo demanda | Riesgo bajo por código, pero no puede calificarse sin interacción real |

Medición requerida después de P0:

1. PageSpeed Insights móvil y escritorio para Inicio, En Vivo y el detalle de noticia.
2. Registrar fecha, URL, modo, LCP, CLS, INP de campo si existe y métricas Lighthouse de laboratorio por separado.
3. Si CrUX muestra “sin datos”, no sustituirlo por una estimación; usar Lighthouse como laboratorio y esperar volumen real.
4. Revisar el informe Core Web Vitals de Search Console por móvil y escritorio. Google explica que puede no haber datos en sitios nuevos o con tráfico insuficiente: [Search Console — Core Web Vitals](https://support.google.com/webmasters/answer/9205520).

---

## 7. Procedimiento de Google Search Console

### 7.1 Registrar y verificar la propiedad

1. Entrar a <https://search.google.com/search-console/> con la cuenta que quedará como propietaria.
2. En el selector, elegir **Añadir propiedad**.
3. Seleccionar **Dominio** e ingresar solo `tresraicesbanda.cl`, sin `https://`, `www` ni ruta. La propiedad de dominio cubre protocolos y subdominios: [Google — añadir una propiedad](https://support.google.com/webmasters/answer/34592).
4. Elegir verificación DNS/TXT y copiar exactamente el valor `google-site-verification=...` generado por Google.
5. En Cloudflare: zona `tresraicesbanda.cl` → **DNS → Records → Add record**.
6. Crear:
   - Type: `TXT`.
   - Name: `@` o el valor que Cloudflare represente como apex.
   - Content: token exacto de Search Console.
   - TTL: Auto.
7. Guardar sin modificar registros A, CNAME, MX o TXT existentes. Cloudflare documenta la creación de registros en [Manage DNS records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/).
8. Volver a Search Console y pulsar **Verificar**. Si no aparece, esperar propagación y reintentar; no duplicar tokens ni borrar el registro.
9. Mantener el TXT después de verificar para conservar la propiedad.

Esta auditoría no creó ni modificó registros DNS.

### 7.2 Enviar el sitemap

1. Abrir la propiedad de dominio.
2. Ir a **Sitemaps**.
3. Enviar `https://tresraicesbanda.cl/sitemap-index.xml`.
4. Confirmar estado **Correcto/Success** y que Google descubra el sitemap hijo.
5. No subir el archivo: Search Console solo necesita su URL. Referencia: [Google — Sitemaps report](https://support.google.com/webmasters/answer/7451001).

### 7.3 Inspeccionar URLs prioritarias

En este orden:

1. `https://tresraicesbanda.cl/`
2. `/banda/`
3. `/en-vivo/`
4. `/media/`
5. `/news/`
6. La noticia individual.
7. `/galeria/`
8. `/network/`

Para cada URL:

- comprobar que la URL live responde y puede indexarse;
- revisar `Crawl allowed`, `Indexing allowed` y canonical declarada;
- una vez indexada, comparar con la canonical elegida por Google;
- solicitar indexación solo para URLs nuevas o cambios importantes;
- usar el sitemap para el conjunto, no enviar solicitudes repetidas.

La herramienta no garantiza indexación y el live test no predice la canonical que Google elegirá: [Google — URL Inspection](https://support.google.com/webmasters/answer/9012289).

### 7.4 Cobertura e indexación

En **Indexación → Páginas**:

- filtrar por **Todas las páginas enviadas** y por el sitemap;
- esperar que las 8 URLs canónicas actuales sean las importantes;
- investigar `Error de servidor`, `Bloqueada por robots.txt`, `Excluida por noindex`, `Duplicada sin canonical seleccionada por el usuario` y `Rastreada/Descubierta: actualmente sin indexar`;
- considerar normales las URLs redirigidas de HTTP/`www` y la 404 si Google las descubre;
- inspeccionar cualquier `pages.dev` o host alternativo;
- no buscar 100 % de cobertura de toda URL descubierta: el objetivo es indexar las canónicas importantes.

Referencia: [Google — Page indexing report](https://support.google.com/webmasters/answer/7440203).

### 7.5 Rendimiento de búsqueda

Cuando exista volumen suficiente, revisar cada 28 días y comparar con el periodo anterior:

- clics;
- impresiones;
- CTR;
- posición media;
- consultas;
- páginas;
- país, especialmente Chile;
- dispositivo;
- apariencia en búsqueda si comienza a reportar datos estructurados.

Crear filtros de seguimiento, sin esperar que todas las variantes aparezcan desde el inicio:

- `tres raíces` y variantes de marca;
- `tres raíces banda`;
- consultas con `Talcahuano`;
- consultas relacionadas con presentaciones y rock chileno;
- páginas de destino `/`, `/banda/`, `/en-vivo/` y noticias.

Interpretar impresiones, CTR y posición conjuntamente; una posición promedio aislada no describe el rendimiento. Referencia: [Google — Performance report](https://support.google.com/webmasters/answer/7576553).

---

## 8. Plan priorizado P0 / P1 / P2

### P0 — Consolidación y correcciones de mayor impacto

| Orden | Tarea | Tipo | Dependencia |
|---:|---|---|---|
| 1 | Identificar `pages.dev` y aplicar `301` al dominio raíz preservando ruta/query | Manual Cloudflare | Acceso a la cuenta |
| 2 | Confirmar `www` y HTTP en portada y rutas profundas | Manual QA | Ninguna |
| 3 | Implementar titles y descriptions específicos reutilizando `BaseLayout` | Técnica | Aprobación de copy |
| 4 | Crear imagen social horizontal auténtica y variantes por noticia | Mixta | Selección/aprobación de foto |
| 5 | Optimizar el PNG de 2,05 MB y corregir dimensiones de portadas/posters | Técnica | Sin alterar original |
| 6 | Implementar variantes responsive y prioridad del Hero | Técnica | Derivados de imagen |
| 7 | Retirar `.DS_Store` de la salida pública | Técnica | Ninguna |
| 8 | Confirmar u ocultar registros externos dudosos | Manual editorial | Responsable de la banda |
| 9 | Crear y verificar propiedad de dominio en Search Console | Manual | Acceso Google + Cloudflare DNS |
| 10 | Enviar sitemap e inspeccionar URLs prioritarias | Manual | Propiedad verificada |

### P1 — Entidad, artículos y calidad social

| Orden | Tarea | Tipo |
|---:|---|---|
| 1 | Añadir `MusicGroup` con `@id` estable y redes confirmadas | Técnica |
| 2 | Añadir `BlogPosting` en noticias | Técnica |
| 3 | Añadir `BreadcrumbList` en detalle de noticia | Técnica |
| 4 | Añadir `og:locale`, dimensiones/tipo/alt de imagen y fecha de artículo | Técnica |
| 5 | Completar `srcset/sizes` de integrantes, galería y cards | Técnica |
| 6 | Corregir reserva de espacio de imágenes adicionales y logos | Técnica |
| 7 | Validar Schema, Rich Results, previews sociales y HTML remoto | Mixta |
| 8 | Medir PSI/Lighthouse móvil y desktop y registrar baseline | Manual QA |

### P2 — Crecimiento editorial y seguimiento

| Orden | Tarea | Tipo |
|---:|---|---|
| 1 | Mejorar H1 visibles si se aprueban los textos propuestos | Editorial/técnica |
| 2 | Añadir enlaces internos contextuales entre News, En Vivo y Media | Editorial |
| 3 | Mantener noticias y registros reales con cadencia sostenible | Editorial |
| 4 | Revisar Search Console y Core Web Vitals cada 28 días | Manual |
| 5 | Evaluar `lastmod` solo si existe una fuente editorial fiable | Técnica |
| 6 | Reconsiderar páginas de evento y `Event` únicamente mediante nueva decisión aprobada | Decisión futura |

---

## 9. Criterios de aceptación

### Indexación y hosts

- [ ] HTTP, `www` y `pages.dev` no entregan copias indexables: redirigen `301` a la URL HTTPS raíz equivalente.
- [ ] La ruta y query string se preservan en las redirecciones de host.
- [ ] Cada página pública responde `200`; una URL inexistente responde `404` real.
- [ ] Todas las páginas públicas tienen un solo canonical absoluto, autorreferente y coherente con sitemap/enlaces.
- [ ] Solo la 404 tiene `noindex`; ninguna página pública importante queda bloqueada.
- [ ] Editor, fixtures, temporales y `.DS_Store` no aparecen en `dist`.

### Sitemap y robots

- [ ] `robots.txt`, `sitemap-index.xml` y sitemap hijo responden `200` en producción.
- [ ] El sitemap contiene todas y solo las páginas públicas canónicas, incluidas noticias individuales.
- [ ] No se añade sitemap de Google News.

### Metadata

- [ ] Cada ruta tiene title y description únicos, revisados editorialmente.
- [ ] Cada ruta conserva un solo H1 descriptivo.
- [ ] OG/Twitter usan URLs absolutas e imágenes accesibles.
- [ ] La imagen social predeterminada tiene un formato horizontal apropiado y deriva de material auténtico.
- [ ] La noticia usa `og:type=article` y metadata específica.

### Datos estructurados

- [ ] `MusicGroup`, `BlogPosting` y `BreadcrumbList` reflejan contenido visible y datos confirmados.
- [ ] No aparecen Spotify, fechas de fundación, autores, fechas de modificación o atributos inventados.
- [ ] Schema Markup Validator y Rich Results Test no reportan errores críticos.
- [ ] No se implementa `Event` sin páginas individuales y aprobación de alcance.
- [ ] No se promete rich result.

### Imágenes y rendimiento

- [ ] El PNG de 2,05 MB no se entrega como recurso principal cuando existe un derivado optimizado.
- [ ] Hero, noticias, posters y galería usan dimensiones estables y variantes adecuadas al viewport.
- [ ] Ningún rostro, logo o asset original se altera de forma incompatible con el manual.
- [ ] Se registra una medición PSI/Lighthouse móvil y desktop sin inventar valores.
- [ ] Si no existe CrUX, se documenta “sin datos” y se revisa nuevamente más adelante.

### Search Console

- [ ] Propiedad de dominio verificada mediante TXT y token conservado.
- [ ] Sitemap enviado con estado correcto.
- [ ] URLs prioritarias inspeccionadas.
- [ ] Canonical seleccionada por Google coincide con la declarada o existe una investigación abierta.
- [ ] Existe una rutina de revisión de indexación, rendimiento y CWV.

---

## 10. Tareas técnicas y manuales separadas

### 10.1 Tareas técnicas en el repositorio

1. Extender props de `BaseLayout` y las páginas para metadata única.
2. Mantener canonical, sitemap, robots y 404 existentes.
3. Incorporar imagen social predeterminada y por noticia.
4. Añadir JSON-LD tipado y serializado de forma segura.
5. Generar y referenciar derivados WebP/AVIF.
6. Implementar `srcset`, `sizes`, dimensiones y prioridad de carga.
7. Retirar `.DS_Store` de `public` y prevenir su inclusión futura.
8. Añadir pruebas de salida para title, description, canonical, robots, OG, JSON-LD y ausencia de archivos administrativos/temporales.
9. Ejecutar pruebas, check, build y rastreo interno después de cada lote.

### 10.2 Tareas manuales fuera del repositorio

1. Aprobar titles, descriptions, H1 e imagen social.
2. Confirmar los registros de Network y Colaboradores.
3. Identificar y redirigir el hostname `pages.dev` en Cloudflare.
4. Verificar redirecciones profundas de HTTP/`www`/`pages.dev`.
5. Crear la propiedad de dominio en Search Console.
6. Copiar el TXT a Cloudflare DNS y verificar; no delegarlo automáticamente.
7. Enviar sitemap e inspeccionar URLs.
8. Ejecutar PageSpeed Insights y pruebas de previews sociales.
9. Revisar Search Console cada 28 días y registrar decisiones basadas en datos.

### 10.3 Fuera de alcance

- Modificar DNS o cuentas automáticamente.
- Crear backend, SSR, APIs, CMS, analítica avanzada o servicios de pago.
- Crear páginas por keyword.
- Crear páginas individuales de eventos sin aprobación.
- Modificar assets originales o rostros.
- Añadir sitemap de Google News.
- Hacer commit, push o desplegar desde esta auditoría.

---

## 11. Fuentes externas principales

- [Astro — Sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Google — Canonicalización](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Cloudflare — Redirect `pages.dev` to a custom domain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)
- [Google — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google — Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google — Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event)
- [Schema.org — MusicGroup](https://schema.org/MusicGroup)
- [Search Console — Add property](https://support.google.com/webmasters/answer/34592)
- [Search Console — Verify ownership](https://support.google.com/webmasters/answer/9008080)
- [Search Console — Sitemaps](https://support.google.com/webmasters/answer/7451001)
- [Search Console — URL Inspection](https://support.google.com/webmasters/answer/9012289)
- [Search Console — Page indexing](https://support.google.com/webmasters/answer/7440203)
- [Search Console — Performance](https://support.google.com/webmasters/answer/7576553)
- [Search Console — Core Web Vitals](https://support.google.com/webmasters/answer/9205520)

---

## Dictamen

La implementación actual ya resuelve correctamente los fundamentos de rastreo y canonical del sitio estático. No necesita un rediseño técnico ni nuevas capas. El cierre SEO V1 requiere mejorar la especificidad por página, consolidar todos los hosts en Cloudflare, optimizar las imágenes críticas, describir la entidad y las noticias con datos estructurados mínimos y establecer Search Console como fuente de evidencia.

El orden recomendado es P0 completo, revisión del informe y del copy, P1 en un lote técnico pequeño y verificable, y P2 guiado por datos reales de búsqueda. No se debe ampliar el alcance a páginas de eventos, servicios de pago o infraestructura adicional sin una decisión explícita.
