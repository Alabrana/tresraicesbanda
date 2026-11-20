# Contratos de contenido — V1

**Estado:** resumen técnico de los contratos aprobados. La referencia completa es `BASE_PROPUESTA_V1.md`, sección 5. Los ejemplos de estructura son orientativos, **no son datos oficiales que deban publicarse**.

## Mapa de archivos

| Fuente | Ubicación | Forma |
|---|---|---|
| Tocatas | `src/content/shows/<id>.json` | 1 JSON por tocata |
| Noticias | `src/content/news/<slug>.md` | 1 Markdown por noticia |
| Banda | `src/data/band.json` | Objeto de historia + 3 integrantes |
| Media | `src/data/media.json` | `videos[]` + `platforms[]` |
| Galería | `src/data/gallery.json` | `photos[]` |
| Network | `src/data/network.json` | `bands[]` |
| Colaboradores | `src/data/collaborators.json` | `collaborators[]` |
| Configuración | `src/data/site.json` | `contactEmail`, `contactPhone` y `socialLinks[]` oficiales |

## En Vivo

Campos: `id`, `title`, `date` (YYYY-MM-DD), `time` (HH:mm), `venue`, `city`, `address?`, `description?`, `poster`, `guestBands?`, `ticketUrl?`, `status`, `visible`.

`status`: `scheduled | cancelled | rescheduled`. Una fecha pasada `scheduled` se considera realizada automáticamente, sin persistir `completed`. **Reprogramada sin nueva fecha** conserva la fecha anterior, pero no se promociona como próxima; una vez confirmada la fecha, se edita `date` y vuelve a `scheduled`.

Listado público: próximas confirmadas primero en orden ascendente; historial después en descendente. Estado cancelado/reprogramado siempre señalado en diagonal. Las fechas deben interpretarse en `America/Santiago` y mantenerse correctas sin compilar cada día. Como V1 no incorpora una hora de término, una presentación `scheduled` permanece vigente durante todo su día civil chileno y pasa al historial en la medianoche siguiente. El navegador programa esa transición y también reevalúa al recuperar visibilidad o foco, sin consultas periódicas. Sin JavaScript se conserva el HTML útil generado con la clasificación vigente durante el último build.

## News

Nombre de archivo define slug permanente. Frontmatter obligatorio: `title`, `date`, `summary`, `cover`; opcional `images` (rutas). Cuerpo Markdown obligatorio. La portada va arriba; fotos adicionales **juntas al final**. Orden descendente por fecha. **No hay `published` ni drafts**: archivo existente y válido forma parte del sitio.

## La Banda

`intro`, `history`, `groupPhoto`, `members[]`. Cada miembro: `id`, `name`, `instrument`, `photo`, `bio`. IDs fijos `victor`, `alex`, `pato`; exactamente 3. No crear/eliminar integrantes desde editor local.

## Media

`platforms[]`: `id`, `name`, `url`, `visible`. `videos[]`: `id`, `title`, `youtubeUrl`, `date?`, `description?`, `visible`. `date` es opcional; si existe debe ser `YYYY-MM-DD` real. Los videos fechados se ordenan en forma descendente y los que no tienen fecha quedan después en su orden editorial. Reproducir en modal superpuesto sin cargar videos hasta interacción.

## Galería

`photos[]`: `id`, `image`, `description`, `visible`. Orden del **arreglo**, sin `position`; Inicio usa las primeras 3 visibles. No hay límite rígido.

## Network / Colaboradores

`bands[]` y `collaborators[]`: `id`, `name`, `logo`, `url?`, `visible`. Orden del arreglo. Logos originales a color; Network solo en `/network`, colaboradores solo en Inicio.

## Configuración global

`site.json` contiene `contactEmail`, `contactPhone` y `socialLinks[]`. El teléfono usa el formato chileno `+56 9XXXXXXXX`. Cada red incluye `id` (`instagram`, `facebook`, `youtube` o `tiktok`), `name` y `url` HTTP/HTTPS. Es la única fuente para los datos de contacto y enlaces mostrados en el footer; el correo se convierte en `mailto:` y el teléfono en `tel:` dentro del componente.

## Convenciones globales

- No introducir `createdAt`, `updatedAt`, `createdBy`, `deletedAt`, `published`, `draft` ni campos innecesarios.
- Rutas de imágenes apuntan a recursos existentes bajo `public/images/`.
- Crear un selector de imágenes local que liste las carpetas; **no** servicio de subida remoto.
- Todos los campos y sus dependencias se validan antes del guardado general, y después se verifican durante el build.
- Las rutas, correos y fotos reales se incorporan únicamente desde material confirmado.

## Validaciones técnicas compartidas

- Las fechas editoriales permanecen como cadenas civiles `YYYY-MM-DD`; no se convierten implícitamente en instantes UTC.
- Fecha y hora se validan semánticamente, incluyendo años bisiestos y rangos `00:00`–`23:59`.
- IDs y slugs usan minúsculas ASCII, números y guiones simples.
- Enlaces públicos admiten únicamente HTTP/HTTPS; los videos deben apuntar a un ID válido en YouTube.
- Los IDs son únicos dentro de cada colección editorial.
- Una imagen debe ser un archivo existente con extensión permitida y permanecer dentro de `public/images` después de normalizar y resolver la ruta real.
- Inicio y `/en-vivo` consumen la misma clasificación de eventos. El navegador vuelve a evaluarla con `America/Santiago` cuando cambia el día, sin backend ni recompilación diaria.
