# Auditoría técnica V1 — Tres Raíces

**Fecha:** 15 de noviembre de 2026  
**Commit auditado:** `323dbc3` (`main`)  
**Alcance:** fundamentos técnicos del sitio público Astro; no incluye implementación del editor local ni cambios visuales.  
**Resultado general:** la base estática compila y respeta la arquitectura aprobada, pero todavía no está lista para implementar o publicar la lógica de eventos y noticias sin corregir primero el tratamiento de fechas y consolidar las validaciones compartidas.

## 1. Estado actual

El repositorio contiene una aplicación Astro 7.4.12 con `output: 'static'`, Tailwind CSS 4, Node.js 22.23.4 y pnpm 12.21.0. Existen las siete rutas estructurales previstas para la Fase 1, contratos Zod para colecciones y archivos JSON, navegación Mobile First, fuentes locales y recursos oficiales optimizados.

No existen backend, base de datos, SSR, CMS remoto, funciones de producción, autenticación, borradores ni papelera. Tampoco existe aún el editor local. Esta situación coincide con la arquitectura y el orden de trabajo aprobados.

La implementación funcional permanece en una etapa estructural:

- `news` y `shows` están vacíos.
- `/en-vivo/` solo filtra por `visible`; todavía no renderiza ni clasifica eventos.
- `/news/[slug]/` tiene generación estática implementada, pero no se ejercita durante el build porque no existen noticias.
- Media, Galería, Network y las secciones dinámicas del Inicio todavía muestran estados vacíos o placeholders explícitos.
- No existe configuración de dominio, sitemap, robots, Open Graph, página 404 ni configuración verificable de Cloudflare Pages.

## 2. Requisitos cumplidos

### Arquitectura

- Astro genera salida completamente estática en `dist/`.
- El contenido se almacena en Markdown/JSON local.
- No se detectaron servicios o capas excluidos por la V1.
- `dist/`, `node_modules/` y `.astro/` no están versionados.
- `.nvmrc` fija Node.js 22.23.4 y `packageManager` fija pnpm 12.21.0.
- El repositorio remoto apunta a GitHub y la rama local activa es `main`.

### Contratos y rutas

- Las colecciones `news` y `shows` poseen esquemas Zod de compilación.
- Los JSON globales se validan al importarse desde `src/data/content.ts`.
- La Banda exige exactamente tres integrantes y restringe sus IDs a `victor`, `alex` y `pato`.
- Los estados de eventos se restringen a `scheduled`, `cancelled` y `rescheduled`.
- Las referencias de imágenes actuales existen y las siete páginas generadas no contienen enlaces internos inexistentes.
- La ruta de noticia usa `getStaticPaths()` y el ID estable del archivo como slug.
- Las imágenes adicionales de una noticia están ubicadas después del cuerpo, conforme al contrato.

Astro recomienda esquemas Zod en las colecciones para validar cada entrada y generar tipos, enfoque que el proyecto ya utiliza: [documentación oficial de Content Collections](https://docs.astro.build/en/guides/content-collections/).

### Mobile First, accesibilidad y rendimiento ya presentes

- Navegación móvil oculta inicialmente, botón de 44 px, `aria-label`, `aria-expanded`, `aria-controls`, cierre por enlace y tecla Escape.
- Navegación horizontal desde 768 px.
- Foco visible, idioma `es`, jerarquía básica de encabezados y dimensiones declaradas en logos y fotos de integrantes.
- Fuentes WOFF2 locales precargadas; no se consultan servicios de fuentes externos.
- El CSS compilado pesa aproximadamente 19 KB y el JavaScript del header se entrega inline, sin framework cliente.
- No se observó overflow estructural en el código Mobile First revisado.

## 3. Hallazgos críticos

### C-01 — La clasificación temporal de eventos no está implementada

**Evidencia:** `/en-vivo/` únicamente ejecuta `filter((show) => show.data.visible)`. No existe utilidad compartida para obtener la fecha actual de Chile, separar próximas/pasadas, ordenar, excluir canceladas/reprogramadas de promociones ni mantener correcta la portada después de medianoche sin recompilar.

**Riesgo:** una fecha vencida puede seguir anunciándose como próxima; un evento cancelado o reprogramado puede promocionarse incorrectamente cuando se implemente la vista. Es una regla de negocio central aprobada y no debe resolverse de forma distinta en Inicio y `/en-vivo/`.

**Solución simple recomendada:** crear una utilidad pura y compartida para eventos que:

1. Obtenga el día civil actual en `America/Santiago` como `YYYY-MM-DD`.
2. Compare fechas civiles, considerando pasado solo un día anterior al día chileno actual.
3. Devuelva grupos explícitos: próximas `scheduled`, historial y estados especiales.
4. Ordene próximas ascendente e historial descendente.
5. Excluya siempre `cancelled` y `rescheduled` de la próxima fecha del Inicio.
6. Se ejecute también en JavaScript ligero del navegador para que la clasificación cambie sin un despliegue diario.
7. Tenga pruebas alrededor de medianoche chilena y cambios de horario de verano.

### C-02 — Las fechas de noticias cambian de día en Chile

**Evidencia ejecutada:** con la zona local `America/Santiago`, `new Date('2026-11-15')` produce `2026-11-15T00:00:00.000Z`, pero `toLocaleDateString('es-CL')` muestra `14-11-2026`. El esquema actual usa `z.coerce.date()` y la página usa `toLocaleDateString()` sin una estrategia de fecha civil.

**Riesgo:** una noticia puede publicarse visualmente con el día anterior. Ordenar por instantes UTC también mezcla innecesariamente conceptos de fecha editorial y hora.

**Solución simple recomendada:** mantener las fechas editoriales como cadenas civiles `YYYY-MM-DD`, validarlas semánticamente y formatearlas desde sus componentes, o utilizar UTC de forma explícita y coherente para fechas sin hora. No convertirlas implícitamente a la zona local del proceso.

## 4. Hallazgos importantes

### I-01 — Las validaciones no están compartidas y tienen brechas

`src/content.config.ts` y `src/data/content.ts` duplican validadores de imágenes, IDs, URLs y fechas. Esto facilita que el futuro editor y el build terminen aceptando reglas distintas.

Brechas comprobadas:

- La expresión de fecha acepta `2026-99-99`.
- La expresión de hora acepta `99:99`.
- Una ruta como `/images/../../package.json` supera el prefijo `/images/` y se resuelve fuera de `public/images`; la prueba devolvió el `package.json` de la raíz.
- `existsSync()` acepta existencia, pero no comprueba que el destino sea un archivo permitido ni que permanezca dentro de `public/images` tras normalizarse.
- No se exige unicidad de IDs en Media, Galería, Network o Colaboradores.
- `z.url()` no restringe protocolos ni valida que `youtubeUrl` pertenezca a un host de YouTube autorizado.
- El cuerpo Markdown obligatorio y el formato seguro del slug no tienen una prueba específica.
- `groupPhoto` y fotos de miembros admiten cadena vacía para sostener placeholders, aunque el contrato final espera imágenes reales.

**Recomendación:** crear un único módulo de contratos compartidos con validadores de fecha civil, hora, ID, URL HTTP(S), URL YouTube y ruta de imagen segura. La ruta debe normalizarse, resolver su destino y comprobar que sigue dentro de `public/images`, que es archivo y que su extensión está permitida. Los esquemas de Astro, los JSON y el futuro editor deben importar las mismas reglas.

### I-02 — Los contratos críticos no se ejercitan con entradas reales o fixtures

El build informa que `news` y `shows` están vacíos. Por ello, el resultado exitoso no demuestra todavía que:

- un evento válido o inválido se procese como se espera;
- una noticia genere `/news/<slug>/index.html`;
- una imagen inexistente haga fallar el build;
- las fotos adicionales y el cuerpo Markdown se rendericen correctamente.

**Recomendación:** añadir pruebas automatizadas con datos técnicos aislados del contenido público. No publicar contenido ficticio. Las pruebas deben cubrir al menos una entrada válida y casos inválidos por contrato.

### I-03 — SEO técnico incompleto

Actualmente solo existen `<title>`, descripción, favicon y `lang="es"`. Faltan:

- URL base `site` y canonical por página.
- Open Graph y Twitter Cards.
- imagen social predeterminada confirmada.
- sitemap.
- `robots.txt`.
- página `404` estática.
- metadatos específicos para noticias.

La integración oficial de sitemap necesita la URL pública en `site` y genera también las rutas estáticas creadas por `getStaticPaths()`: [documentación oficial de `@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/).

**Recomendación:** esperar a confirmar el dominio y la imagen social; luego centralizar metadatos en `BaseLayout`, añadir sitemap oficial, `robots.txt` y `404.astro`. Los datos estructurados `MusicGroup`, `Event` y `Article` pueden incorporarse después de confirmar contenido real.

### I-04 — Falta un flujo reproducible de validación

Los únicos scripts son `dev`, `build` y `preview`. `build` combina correctamente `astro check` y `astro build`, pero faltan comandos explícitos para:

- validación integral de contratos y referencias;
- pruebas de utilidades temporales;
- verificación de enlaces internos/salida estática;
- auditoría de dependencias;
- ejecución equivalente en integración continua.

Además, el runtime fijado es Node.js 22, pero el proyecto declara `@types/node` 26. El código actual no usa APIs conflictivas, aunque esta diferencia permitiría que TypeScript acepte en el futuro una API inexistente en el runtime de build. Conviene alinear el major de los tipos con Node 22.

**Recomendación:** un script `validate` único, pequeño y documentado, que ejecute contratos/pruebas, `astro check` y build. Añadir una comprobación de GitHub antes de permitir merge a `main`; Cloudflare debe publicar únicamente después de ese resultado.

### I-05 — Publicación a Cloudflare Pages aún no está cerrada

La salida `dist` y el build de Astro son compatibles con Pages. Cloudflare documenta para Astro el comando `npm run build` y directorio `dist`; usando el gestor aprobado, se recomienda configurar `pnpm run build`: [configuración oficial de builds](https://developers.cloudflare.com/pages/configuration/build-configuration/).

No se pudo verificar desde el repositorio:

- que el proyecto Pages exista y esté conectado;
- que `main` sea la rama de producción;
- que previews estén limitados a las ramas deseadas;
- que existan checks requeridos o protección de rama;
- que las versiones del entorno estén fijadas en el panel.

`.nvmrc` fija Node correctamente. En el sistema v3 de builds, Cloudflare indica que no detecta pnpm desde el lockfile y permite fijarlo con `PNPM_VERSION`; conviene configurar `PNPM_VERSION=12.21.0`: [imagen oficial de build](https://developers.cloudflare.com/pages/configuration/build-image/). La integración Git ofrece previews y checks por commit: [integración Git oficial](https://developers.cloudflare.com/pages/configuration/git-integration/).

No existe `public/_headers`. Pages ya aporta algunos encabezados, pero antes de producción conviene evaluar una política mínima para clickjacking, permisos y CSP compatible con YouTube: [encabezados personalizados de Pages](https://developers.cloudflare.com/pages/configuration/headers/).

### I-06 — Accesibilidad y rendimiento requieren una segunda pasada

Brechas observadas por revisión de código:

- No hay enlace para saltar directamente al contenido principal.
- La navegación no identifica la página actual mediante `aria-current`.
- No existe adaptación a `prefers-reduced-motion` para las transiciones del header.
- La portada y las imágenes adicionales de noticias usan `alt=""`; el contrato no dispone de texto alternativo específico.
- Las tres fotos de integrantes cargan inmediatamente aunque parte de la cuadrícula pueda estar fuera de pantalla.
- No existen `srcset`/`sizes` ni formatos modernos para fotografías.
- El logo principal pesa aproximadamente 544 KB; las fotos de integrantes suman aproximadamente 456 KB.

No se ejecutaron Lighthouse, axe ni una auditoría visual automatizada; por tanto, no se atribuyen métricas de rendimiento o conformidad WCAG.

## 5. Mejoras futuras

- Añadir datos estructurados cuando exista contenido real confirmado.
- Automatizar Lighthouse/axe en una etapa posterior, sin convertirlos en dependencia del sitio público.
- Definir una política de optimización de imágenes y generación responsive durante el build.
- Endurecer CSP cuando se implemente el modal de YouTube, evitando permisos amplios anticipados.
- Diseñar las garantías de escritura, confinamiento de rutas y rollback del editor local únicamente en la Fase 3.
- Reevaluar periódicamente las condiciones de Cloudflare Pages; no hay necesidad técnica actual de introducir SSR, Workers o funciones para este sitio estático.

## 6. Riesgos técnicos resumidos

| Riesgo | Probabilidad actual | Impacto | Prioridad |
|---|---:|---:|---|
| Mostrar fechas editoriales con un día incorrecto | Alta al añadir noticias | Alto | Crítico |
| Promocionar una tocata vencida/cancelada/reprogramada | Alta al implementar eventos | Alto | Crítico |
| Aceptar fechas y horas imposibles | Alta si hay edición manual | Medio/alto | Importante |
| Aceptar una ruta que escapa de `public/images` | Media | Medio/alto | Importante |
| Divergencia entre validación del build y futuro editor | Media | Alto | Importante |
| Publicar sin canonical, sitemap, OG o 404 | Alta si se despliega hoy | Medio | Importante |
| Build remoto distinto al local por versión de pnpm | Media | Alto | Importante |
| Regresiones de accesibilidad o carga de imágenes | Media | Medio | Importante |

## 7. Plan de correcciones priorizado

### P0 — Antes de implementar eventos o cargar noticias

1. Extraer contratos compartidos y cerrar validación semántica de fechas, horas, IDs, URLs y rutas de imágenes.
2. Corregir el modelo/formato de fechas editoriales sin conversión implícita de zona horaria.
3. Implementar la política pura de eventos para `America/Santiago` y sus pruebas.
4. Añadir pruebas aisladas que ejerzan noticias, eventos, slugs y referencias inválidas sin publicar datos ficticios.

### P1 — Antes del primer despliegue público

5. Incorporar SEO base, dominio, canonical, sitemap, robots y 404.
6. Completar accesibilidad del layout y definir textos alternativos en contratos.
7. Optimizar carga de imágenes manteniendo intactos los originales.
8. Añadir `pnpm run validate` y un check de GitHub reproducible.
9. Configurar Cloudflare Pages con `main`, `dist`, Node 22.23.4, pnpm 12.21.0 y previews controlados.
10. Definir encabezados de seguridad compatibles con los embeds realmente utilizados.

### P2 — Después de consolidar la web pública

11. Automatizar auditorías de accesibilidad/rendimiento.
12. Implementar el editor exclusivamente local reutilizando los contratos ya estabilizados.

## 8. Criterios para considerar la base lista

El proyecto estará listo para continuar con funcionalidades públicas cuando:

- Las fechas civiles no cambien de día en Chile.
- Existan pruebas deterministas para eventos próximos, pasados, cancelados y reprogramados.
- Inicio y `/en-vivo/` consuman una sola política de clasificación.
- Fechas y horas imposibles fallen antes de compilar.
- Las rutas fuera de `public/images`, directorios y extensiones no permitidas fallen.
- Los IDs duplicados y URLs no autorizadas fallen.
- Al menos una fixture técnica de noticia y evento pruebe generación y validación sin formar parte del contenido publicado.
- Un comando único ejecute pruebas, validación, check y build.
- El build genere todas las rutas esperadas sin referencias internas rotas.
- Antes del despliegue existan canonical, sitemap, robots, Open Graph y 404.
- Cloudflare utilice versiones fijadas y solo despliegue producción desde `main` después de checks exitosos.
- Se complete una revisión manual móvil y una auditoría accesible sin problemas bloqueantes.

## 9. Comandos ejecutados y resultados reales

| Comando/prueba | Resultado |
|---|---|
| `nvm use 22.23.4` | Correcto: Node `v22.23.4`, npm `10.9.9`. |
| `pnpm install --frozen-lockfile --offline` | Falló con `ERR_PNPM_NO_OFFLINE_TARBALL` para `readdirp@5.1.1`; el caché local no era autosuficiente. No indica un error del lockfile. |
| `pnpm install --frozen-lockfile` | Correcto: lockfile al día, 281 paquetes restaurados/reutilizados, sin cambios de versiones. |
| `pnpm run build` | Correcto: Astro check sobre 16 archivos con 0 errores, 0 warnings y 0 hints; build estático de 7 páginas. |
| Colecciones durante build | Advertencias esperadas: `news` y `shows` no contienen entradas. |
| Rutas generadas | `/`, `/banda/`, `/en-vivo/`, `/galeria/`, `/media/`, `/network/`, `/news/`. No se generó detalle de noticia porque la colección está vacía. |
| Verificación propia de `href`/`src` internos | 7 HTML revisados; 0 referencias internas inexistentes en la salida actual. |
| `pnpm audit --prod` | `No known vulnerabilities found`. |
| `pnpm audit` | `No known vulnerabilities found`. |
| Prueba de fecha `2026-11-15` | En `America/Santiago`, la implementación equivalente muestra `14-11-2026`; hallazgo reproducido. |
| Prueba de regex | `2026-99-99` y `99:99` son aceptados por las expresiones actuales. |
| Prueba de ruta | `/images/../../package.json` se resolvió al `package.json` de la raíz; confirma falta de confinamiento. |
| Inspección de salida SEO/deploy | No se encontraron sitemap, robots, 404, `_headers`, canonical ni metadatos Open Graph/Twitter. |
| Lighthouse / axe / pruebas visuales | No ejecutadas; no están configuradas en el proyecto y no se inventan resultados. |
| Deploy real de Cloudflare Pages | No ejecutado ni verificable desde esta auditoría. |

## 10. Dictamen

La arquitectura elegida es adecuada y no necesita backend, base de datos, SSR ni CMS para resolver las brechas. El build actual es sano como esqueleto estático, las dependencias auditadas no presentan vulnerabilidades conocidas y la estructura Mobile First es una buena base.

Sin embargo, **no se recomienda continuar con la presentación de eventos ni incorporar noticias reales antes de completar P0**. El error reproducible de fechas y la ausencia de una política temporal compartida pueden publicar información incorrecta. Tras aprobar y completar P0, el proyecto tendrá una base suficientemente estable para continuar la Fase 2; P1 será obligatorio antes del primer despliegue público.
