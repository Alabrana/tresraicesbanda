# Registro de decisiones — Tres Raíces V1

**Fecha base:** 2026-11-15. **Estado:** arquitectura y alcance de planificación aprobados; implementación pendiente.

| ID | Decisión | Estado |
|---|---|---|
| D-001 | Astro estático para toda la web pública | Aprobada |
| D-002 | Cloudflare Pages con dominio propio como hosting | Aprobada |
| D-003 | Un repositorio GitHub | Aprobada |
| D-004 | Markdown/JSON como persistencia editorial; imágenes en el proyecto | Aprobada |
| D-005 | Un solo administrador mediante editor local; sin login en producción | Aprobada |
| D-006 | Cambios en navegador y **un guardado general** hacia archivos locales | Aprobada |
| D-007 | Git commit/push manual separado del guardado; Cloudflare hace deploy | Aprobada |
| D-008 | Sin base de datos, NestJS, CMS remoto ni API de producción | Aprobada |
| D-009 | Sin borradores, papelera ni purga a 30 días | Aprobada |
| D-010 | Visibilidad simple cuando aplica; estados especiales En Vivo | Aprobada |
| D-011 | Reprogramada conserva fecha original y no es próxima hasta confirmar otra fecha | Aprobada |
| D-012 | News Markdown, portada, texto, fotos extras juntas al final | Aprobada |
| D-013 | Media: URLs YouTube manuales, reproducción en ventana superpuesta | Aprobada |
| D-014 | Galería/Network/Colaboradores con orden manual; logos a color | Aprobada |
| D-015 | Integrantes fijos Víctor, Alex y Pato, pero sus datos son editables | Aprobada |
| D-016 | Selector visual de imágenes copiadas previamente a carpetas locales | Aprobada |
| D-017 | El editor local NO es una ruta disponible en el sitio público | Aprobada |
| D-018 | Node.js 22.23.4 mínimo y Astro 7.4.12 como base técnica segura de la implementación | Aprobada |
| D-019 | pnpm 12 como gestor único de paquetes y Tailwind CSS 4 como núcleo de estilos; CSS manual reservado para tokens, base y efectos específicos | Aprobada |
| D-020 | La experiencia pública se implementa Mobile First; navegación compacta con menú accesible en móvil y enlaces horizontales desde tableta/escritorio | Aprobada |
| D-021 | Sistema tipográfico «Rock Industrial»: Oswald 700 para títulos, navegación y botones; IBM Plex Sans 400 para textos | Aprobada |
| D-022 | Fechas editoriales como días civiles `YYYY-MM-DD`, validadores compartidos y una política única de eventos recalculada en navegador según `America/Santiago` | Aprobada |
| D-023 | `tresraicesbanda.cl` es el dominio oficial; se usa como `site` de Astro, canonical, sitemap y Open Graph. `www.tresraicesbanda.cl` redirige permanentemente al dominio principal desde Cloudflare. | Aprobada |
| D-024 | `site.json` centraliza correo de contacto y redes oficiales. Footer y enlace al canal de Media consumen esa fuente; las plataformas musicales permanecen en `media.json`. | Aprobada |
| D-025 | La fecha de un video en `media.json` es opcional. Si se informa, se valida como fecha civil y determina el orden; los videos sin fecha permanecen publicables después de los fechados. | Aprobada |
| D-026 | El editor local usa Node.js nativo y JavaScript sin dependencias adicionales; se inicia con `pnpm editor`, escucha únicamente en `127.0.0.1:4322` y queda fuera de Astro y de `dist`. | Aprobada |
| D-027 | El rendimiento se audita con PageSpeed Insights API en producción y Lighthouse CLI sobre `dist` local. Los JSON voluminosos se ignoran en Git, se conservan resúmenes puntuales y las imágenes web pueden tener derivados responsivos sin modificar los originales. | Aprobada |
| D-028 | `site.json` incorpora el teléfono oficial `contactPhone`, validado en formato chileno y mostrado como enlace `tel:` debajo del correo en el footer. | Aprobada |

## Por definir antes o durante implementación

- Nombres finales de scripts de desarrollo y estructura interna del editor.
- Esquemas de validación y datos reales aún no facilitados.
- Gestión visible de eventos cancelados/reprogramados en el listado general.
- Tratamiento SEO y fechas cuando el visitante deshabilita JS.
- Conexión manual del dominio y DNS en Cloudflare Pages; dominio oficial ya definido en D-023.

## Control de cambios

Agregar aquí toda decisión que modifique el alcance, indicando motivo y fecha. **No declarar un detalle como aprobado si no fue elegido explícitamente por el usuario**.
