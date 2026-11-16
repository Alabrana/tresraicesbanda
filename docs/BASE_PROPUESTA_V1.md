# TRES RAÍCES — WEB OFICIAL
## Documento base de propuesta y alcance V1

**Versión del documento:** 1.0  
**Consolidación de decisiones:** 15 de noviembre de 2026  
**Estado:** base de trabajo aprobada a nivel conceptual; pendiente de implementación  
**Propósito:** preservar el rumbo funcional, visual y técnico antes de escribir código.

> **Principio rector:** construir una web oficial rápida, auténtica y completamente estática para Tres Raíces, administrable mediante archivos del proyecto y, por comodidad, un editor visual **local**. No agregar servicios, procesos ni estados que no aporten valor real a la V1.

---

## 1. Identidad y referencias obligatorias

Tres Raíces es una banda de rock de **Talcahuano, Chile**. La web debe representar su identidad **chorera, portuaria, de mar, barrio, industria, acero y trabajo**; no puede sentirse como un sitio corporativo ni como el de una banda genérica.

**Dirección visual:** grunge, rockera, industrial, auténtica, gastada; fondos negros y gris oscuro, textos blanco envejecido, acentos azul acero / azul petróleo, fotografías reales, textura de hormigón, metal o desgaste con moderación para no sacrificar legibilidad. Los valores hexadecimales son ajustables en implementación; no se inventa una paleta que reemplace el manual.

**Logo:** utilizar archivos oficiales, preservar tipografía, diseño, proporción y contorno; no redibujarlo, distorsionarlo ni sustituirlo por árboles genéricos. Evitar anclas, olas u otros símbolos decorativos sin propósito o no representativos de la banda.

**Fotografías:** usar material auténtico de la banda, sin reemplazar ni alterar rostros, facciones, edad o contextura de Víctor, Alex o Pato. Se permiten retoques de luz, color y contraste.

**Voz editorial:** humana, cercana, sincera, agradecida, rockera, sin clichés publicitarios ni tono corporativo. Para publicaciones sociales que se redacten desde el proyecto, considerar los hashtags oficiales del manual; **no añadirlos automáticamente a todas las páginas web**.

**Fuentes principales entregadas por la banda:** `MANUAL CREATIVO OFICIAL.md`, `PROMPTS_OFICIALES_TRES_RAICES.md`; logos oficiales y fotografías aportadas al proyecto. El manual creativo prevalece sobre sugerencias estéticas posteriores incompatibles.

---

## 2. Objetivo y límites de la V1

La V1 será una **web pública de contenido estático**, orientada a presentar la banda, su música, actuaciones, noticias, fotografías y vínculos con bandas amigas y colaboradores. El sitio debe ser rápido, accesible, responsive, fácil de mantener y económico.

**No habrá en producción:** base de datos, NestJS, API propia, Supabase, CMS online, login de administradores, gestión multiusuario, backend persistente, cron para el contenido editorial, borradores administrativos, papelera ni recuperación automática a 30 días.

**Un único responsable edita localmente.** La vía primaria siempre puede ser modificar Markdown/JSON a mano en el repositorio. El editor visual local será una comodidad, no una dependencia para que el sitio funcione.

**Fuera de V1:** venta de entradas en el sitio, pagos, comentarios, cuentas de seguidores, newsletter, e-commerce de merch, discografía compleja, álbumes fotográficos, páginas individuales para eventos/músicos/bandas amigas, integraciones automáticas con redes sociales y analítica avanzada. `/merch` queda reservado como posibilidad futura, no se publica al lanzar la V1.

---

## 3. Mapa de navegación pública

| Ruta | Contenido | Notas |
|---|---|---|
| `/` | Inicio One Page | Secciones resumidas, CTA y enlaces a páginas completas |
| `/banda` | Historia, foto grupal, integrantes | Tres integrantes fijos y editables; sin ficha individual |
| `/media` | Enlaces musicales y videos YouTube | Reproductor superpuesto al seleccionar miniatura |
| `/en-vivo` | Actuaciones próximas y anteriores | Tarjetas con estado, afiche, datos y entradas opcionales |
| `/news` | Noticias | Más reciente destacada y anteriores ordenadas |
| `/news/[slug]` | Detalle de noticia | URL estable, imagen de portada, cuerpo, fotos al final |
| `/galeria` | Fotos seleccionadas | Cuadrícula con lightbox y descripción |
| `/network` | Bandas Amigas | Tarjetas con logos originales y enlaces opcionales |

**No hay página Contacto independiente:** los datos de contacto, redes y navegación estarán en el footer. **No hay página Colaboradores independiente:** se muestran en una franja discreta del Inicio. Material de prensa/EPK podrá añadirse en el footer más adelante cuando exista.

### 3.1. Secciones de Inicio, en orden

1. **Hero:** logo original grande, ambiente auténtico portuario/industrial de Talcahuano, frase «ROCK DESDE TALCAHUANO», texto breve sobre puerto/barrio/raíces; CTA a En Vivo y Media.
2. **En Vivo:** una próxima tocata válida, con fecha, lugar, afiche y entradas si corresponde; ocultar el bloque si no existe próximo evento válido.
3. **Media:** video más reciente visible y enlace a `/media`; ocultar si no hay videos.
4. **La Banda:** presentación corta y fotografía grupal; enlace a `/banda`.
5. **News:** noticia publicada más reciente y enlace al listado; ocultar si no hay noticias.
6. **Galería:** primeras tres fotografías visibles según orden manual; ocultar si no hay fotos.
7. **Colaboradores:** franja de logos originales con enlaces opcionales; ocultar si no hay colaboradores visibles.
8. **Footer:** contacto, redes, navegación y créditos apropiados.

La ausencia de contenido no debe generar bloques vacíos.

---

## 4. Experiencia visual y UX

- Cabecera transparente sobre el Hero, fija y compacta con fondo oscuro translúcido al desplazarse.
- Navegación en escritorio: La Banda, Media, En Vivo, News, Galería, Network; logo oficial vuelve a Inicio.
- Menú adaptable en móvil, con control desplegable.
- Fondo predominantemente oscuro **continuo**, con destacados sutiles y fotografías auténticas; no alternar grandes bloques de colores sin necesidad.
- Títulos de páginas interiores sobre pequeñas franjas industriales/texturizadas; Hero grande solo en Inicio.
- Página `/banda`: historia recomendada de 150–250 palabras y tres módulos horizontales alternados; biografías personales sugeridas de 40–70 palabras.
- Videos de `/media`: miniaturas, carga del reproductor al hacer clic, ventana superpuesta y cierre accesible.
- Fotos `/galeria`: lightbox con anterior/siguiente y descripciones, también funcional en móviles.
- Links externos claramente identificables y accesibles; evitar desplazamientos involuntarios y contenido bloqueante.
- Estados de error, páginas no encontradas y contenido vacío tratados con mensajes sobrios.
- Priorizar desempeño, accesibilidad, textos alternativos, tamaño optimizado de fotografías y SEO básico.

---

## 5. Contratos de datos — decisiones aprobadas

Los archivos de contenido son la fuente de verdad. Astro los utiliza **durante la compilación**. El panel local no escribe en ellos hasta ejecutar el **guardado general**.

### 5.1. En Vivo — un JSON por evento

Ubicación conceptual: `src/content/shows/<id>.json`.

Campos: `id`, `title`, `date`, `time`, `venue`, `city`, `address?`, `description?`, `poster`, `guestBands?`, `ticketUrl?`, `status`, `visible`.

Estados:
- `scheduled`: programada; si la fecha ya pasó, se presenta como evento pasado/realizado, sin requerir un estado `completed` persistido.
- `cancelled`: mantiene información y se marca visualmente **CANCELADA** en diagonal sobre el afiche; nunca se usa como «próxima tocata» en Inicio.
- `rescheduled`: mantiene la **fecha original** mientras no exista una nueva fecha confirmada, se marca **REPROGRAMADA** diagonalmente y queda fuera de las próximas fechas confirmadas; cuando se confirme una nueva fecha, actualizar `date` y devolver a `scheduled`.

Las próximas actuaciones confirmadas se muestran antes que el historial, ascendiendo por fecha; las pasadas, de la más reciente a la más antigua. Las canceladas/reprogramadas visibles permanecen en `/en-vivo` claramente identificadas, pero no se anuncian como próximas fechas válidas. **La ubicación exacta de estas tarjetas especiales dentro del listado se ajustará en implementación**, sin volver a introducir reglas complejas de estados.

La clasificación por fecha debe funcionar sin reconstruir la web cada medianoche: resolverla con JavaScript ligero del lado del navegador sobre los eventos estáticos, utilizando el calendario de Chile (`America/Santiago`) y contemplando el día completo de la actuación. Evitar que la portada anuncie erróneamente un evento vencido durante la carga inicial.

### 5.2. News — un Markdown por noticia

Ubicación: `src/content/news/<slug>.md`.

Frontmatter: `title`, `date`, `summary`, `cover`, `images?`; cuerpo en Markdown. Identificador de URL derivado del nombre estable del archivo. Cambiar el título no cambia automáticamente su URL.

- Imagen principal al comienzo.
- Contenido con texto, formato básico y enlaces.
- Fotos adicionales **agrupadas al final**, nunca intercaladas en el artículo.
- Noticias ordenadas por fecha de publicación descendente; más reciente destacada en `/news` e Inicio.
- **Sin borradores y sin campo `published`:** un archivo existente y válido participa en la web; eliminarlo significa quitar la noticia del proyecto.
- La visualización local y la revisión previa al `git push` sustituyen una función de «preview de borrador» del CMS.

### 5.3. La Banda — `src/data/band.json`

Campos: `intro`, `history`, `groupPhoto`, `members[]` con `id`, `name`, `instrument`, `photo`, `bio`.

**Tres miembros fijos:** Víctor (bajo y voz), Alex (guitarra) y Pato/Patricio (batería). El editor permite modificar contenido de esos miembros, **no** crear ni eliminar integrantes. Mantener sus IDs estables.

### 5.4. Media — `src/data/media.json`

`platforms[]`: `id`, `name`, `url`, `visible`.  
`videos[]`: `id`, `title`, `youtubeUrl`, `date`, `description?`, `visible`.

La información del video se ingresa **manualmente**. Miniaturas YouTube cuando estén disponibles; videos visibles ordenados por fecha descendente; reproducir en **ventana superpuesta**. Inicio muestra el más reciente visible. Plataformas musicales opcionales, mostrar solo enlaces válidos y visibles.

### 5.5. Galería — `src/data/gallery.json`

`photos[]`: `id`, `image`, `description`, `visible`. **El orden del arreglo es el orden editorial**; no hay campo `position` adicional. Editor con arrastrar y soltar (alternativa accesible subir/bajar). Sin límite rígido de fotos; mantener curaduría pequeña. Inicio toma las primeras tres visibles.

### 5.6. Network — `src/data/network.json`

`bands[]`: `id`, `name`, `logo`, `url?`, `visible`. Logos originales, colores originales, orden del arreglo, enlace opcional. Solo página `/network`.

### 5.7. Colaboradores — `src/data/collaborators.json`

`collaborators[]`: `id`, `name`, `logo`, `url?`, `visible`. Orden manual del arreglo. Logos en colores originales. Solo franja de Inicio.

### 5.8. Datos globales — `src/data/site.json`

Configuración mínima compartida: email de contacto, enlaces sociales y textos globales si se necesitan. **Estructura exacta pendiente**, sin anticipar campos superfluos.

### 5.9. Convenciones

- `id` estable y único por elemento.
- `visible` permite retirar temporalmente contenidos donde ya está aprobado; **no equivale a borrador ni papelera**.
- Rutas de imágenes locales que apunten a recursos existentes en `public/images`.
- No incorporar automáticamente `createdAt`, `updatedAt`, `createdBy`, `deletedAt`, historiales editoriales ni metadatos que no aporten a V1.
- Los ejemplos reales de eventos deberán revisarse antes de publicarse; no insertar URLs ficticias como si fueran oficiales.

---

## 6. Imágenes y archivos estáticos

- Imágenes físicas organizadas manualmente en carpetas bajo `public/images/` (banda, shows, news, gallery, network, collaborators, logos).
- **Selector visual aprobado:** el responsable copia manualmente las imágenes a la carpeta adecuada; el editor local las lista como miniaturas y selecciona la ruta, evitando escribirla a mano.
- No hacer upload directo a cloud ni a una API; no exigir generación de formatos nuevos para guardar un registro.
- Optimizar tamaño y formato de las imágenes destinadas a producción; conservar proporciones del logo, sin alterar la identidad de la banda.
- Validar que rutas referenciadas existan antes de guardar/compilar.
- No incluir originales innecesariamente pesados en el repositorio de despliegue.

---

## 7. Arquitectura aprobada

| Aspecto | Decisión |
|---|---|
| Proyecto | **Un solo repositorio Git** para sitio, contenido y editor local |
| Web pública | **Astro**, salida completamente estática |
| Hosting | **Cloudflare Pages** |
| Dominio | `tresraicesbanda.cl`, dominio oficial aprobado; configurar DNS y HTTPS al desplegar |
| Almacenamiento editorial | Archivos **Markdown y JSON** versionados con Git |
| Imágenes | Archivos del proyecto, optimizados para la web |
| Panel | **Herramienta local** dentro del repositorio; no desplegada públicamente |
| Acceso | Un solo responsable local; sin usuarios, invitaciones ni login de producción |
| API backend en producción | **Ninguna** |
| Bases de datos | **Ninguna** |
| NestJS / Supabase | **Excluidos en V1** |
| Publicación | `git commit` + `git push` manual; Cloudflare Pages compila la rama de producción |
| Costo objetivo de infraestructura | **US$0/mes** dentro de cuotas/condiciones de hosting; no incluye renovación de dominio |

**Restricción de diseño importante:** la web pública no debe requerir consultar GitHub, Cloudflare APIs, almacenamiento externo de contenido ni sistemas de administración en cada visita. YouTube y links externos son funciones opcionales de los visitantes, no dependencias para renderizar las páginas del sitio.

### 7.1. Delimitación del editor local

El panel **no es** una ruta accesible de la web desplegada. Se ejecuta en localhost por comando de desarrollo e incluye un proceso **Node.js exclusivamente local** con permisos restringidos para leer y escribir contenido del repositorio. Puede usar React para formularios si aporta valor. **No se necesita NestJS**.

El diseño de rutas/comandos locales exactos (`npm run editor`, Vite, servidor local) está pendiente de implementación. No se debe publicar inadvertidamente el editor dentro de `dist` ni incluir credenciales en el frontend.

### 7.2. Estructura guía del repositorio

```text
tres-raices/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── banda.astro
│   │   ├── media.astro
│   │   ├── en-vivo.astro
│   │   ├── galeria.astro
│   │   ├── network.astro
│   │   └── news/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── layouts/
│   ├── components/
│   ├── content/
│   │   ├── news/        # Markdown individual
│   │   └── shows/       # JSON individual
│   ├── data/
│   │   ├── band.json
│   │   ├── media.json
│   │   ├── gallery.json
│   │   ├── network.json
│   │   ├── collaborators.json
│   │   └── site.json
│   ├── styles/
│   └── content.config.ts
├── public/images/
│   ├── band/
│   ├── shows/
│   ├── news/
│   ├── gallery/
│   ├── network/
│   ├── collaborators/
│   └── logos/
├── editor/                # herramienta local, no pública
├── astro.config.mjs
├── package.json
└── README.md
```

Es una **estructura propuesta**, no una obligación de carpetas o nombres de componentes inmutables.

---

## 8. Comportamiento del editor local

1. Cargar archivos de contenido actuales del proyecto.
2. Construir una copia de trabajo editable en el navegador.
3. Mostrar formularios por módulo, **en página completa**.
4. Detectar modificaciones con comparación real contra el contenido cargado; deshacer cambios puede limpiar el estado «modificado».
5. Mantener cambios pendientes al navegar entre formularios. Se admite almacenamiento local del navegador (por ejemplo IndexedDB) para mejorar la continuidad **sin convertirlo en persistencia editorial garantizada**.
6. Selector visual de imágenes existentes por carpeta; sin obligación de cargar imágenes desde el panel.
7. Permitir crear, editar, ocultar cuando aplique y eliminar registros; **sin borradores ni papelera**.
8. Mostrar resumen global de cambios pendientes (creaciones, ediciones, eliminaciones, ordenamientos).
9. **Botón único «Guardar todos los cambios»:** validar el conjunto y escribir los archivos locales modificados coordinadamente; no escribir cada vez que se cambia un formulario.
10. Conservar cambios locales si la validación o escritura falla; proteger contra sobrescritura de archivos editados externamente y evitar resultados parciales, mediante respaldos/rollback de los archivos afectados.
11. Después del guardado, revisar cambios con Git y previsualizar Astro localmente.
12. **Publicación separada, manual:** commit + push del responsable; Cloudflare Pages genera nueva versión. El guardado local **no** despliega la web.

**Sin roles, panel remoto, correo de invitación, CMS, workflow de aprobación, borradores persistentes, papelera ni tareas automáticas de purga.** El historial Git es una herramienta técnica de reversión manual, no una papelera de la aplicación.

---

## 9. Despliegue previsto

- Repositorio GitHub como origen de Cloudflare Pages.
- Rama de producción: `main`.
- Build: `pnpm run build`.
- Directorio de salida: `dist`.
- Dominio oficial: `tresraicesbanda.cl`; `www.tresraicesbanda.cl` redirige de forma permanente al dominio principal mediante Cloudflare. Conectar ambos manualmente al configurar Pages y conservar acceso al registrador.
- Mantener el editor local excluido del build público.
- Verificar cuota y condiciones actuales de Cloudflare Pages al configurar el servicio; no se establece aquí garantía permanente de costo o disponibilidad.

La edición local no exige que GitHub o Cloudflare estén disponibles. La publicación remota sí depende de conexión y de esos servicios.

---

## 10. Reglas de calidad / aceptación de V1

Una entrega podrá considerarse alineada con esta propuesta si:

- [ ] `pnpm run build` produce un sitio público estático que funciona sin API propia ni base de datos.
- [ ] Los archivos Markdown y JSON bastan para actualizar contenidos manualmente.
- [ ] El logo original y las fotografías respetan las reglas del manual creativo.
- [ ] El inicio respeta el orden de bloques y oculta los que no tienen contenido.
- [ ] La próxima tocata y el historial no quedan mal clasificados cuando cambia la fecha en Chile, sin requerir nuevos despliegues diarios.
- [ ] Canceladas y reprogramadas llevan sello diagonal y no se anuncian como próximas fechas válidas.
- [ ] News utiliza URLs estables y presenta las fotos adicionales al final.
- [ ] Media reproduce YouTube en ventana superpuesta sin precargar todos los reproductores.
- [ ] Galería respeta el orden manual y presenta las primeras tres fotos visibles en Inicio.
- [ ] Network y colaboradores conservan logos en colores originales.
- [ ] Todo el sitio funciona bien en móvil y tiene mínimos de accesibilidad, SEO y rendimiento.
- [ ] El editor solo funciona localmente y no aparece en el sitio desplegado.
- [ ] El selector de imágenes utiliza archivos existentes.
- [ ] Los cambios de varios formularios se guardan mediante **una operación general**; guardar no equivale a publicar.
- [ ] Se pueden revisar los cambios antes del commit y del despliegue.
- [ ] No se incorporaron BD, backend público, papeleras, borradores ni usuarios adicionales por iniciativa técnica.

---

## 11. Temas pendientes (no son permisos para ampliar alcance)

1. **Implementación concreta del editor local:** Vite/React u otra interfaz ligera, cómo se inicia el proceso Node en localhost y cómo se comprueba que solo escribe rutas autorizadas.
2. **Esquemas definitivos de validación:** restricciones de campos, URLs, identificadores y referencias entre archivos.
3. **Datos iniciales reales:** biografías, textos de sección, URLs musicales y sociales, correo de contacto, afiches y fotografías efectivamente seleccionadas. No inventar contenido oficial.
4. **Ubicación de canceladas/reprogramadas en `/en-vivo`:** presentación clara sin interferir con el orden de próximas fechas confirmadas.
5. **Criterios de imágenes:** tamaños máximos, optimización y textos alternativos.
6. **Caso de JavaScript deshabilitado:** decidir presentación conservadora de próximo evento para evitar fechas incorrectas.
7. **Flujo local de respaldo/rollback:** procedimiento concreto para fallos de escritura multiarchivo.
8. **Detalles de dominio y DNS:** completar cuando se conozca el nombre real del dominio registrado.

Estas decisiones de implementación pueden resolverse **sin modificar el alcance conceptual**.

---

## 12. Orden de trabajo a partir de este documento

1. Confirmar este documento como referencia base del repositorio (por ejemplo `docs/BASE_PROPUESTA_V1.md`).
2. Inicializar Astro estático, layouts y rutas públicas.
3. Incorporar esquemas de datos y archivos iniciales sin inventar información.
4. Construir la web pública con la identidad oficial y las reglas de visualización.
5. Implementar el editor **local** sobre los mismos contratos.
6. Probar guardado general, validaciones y `pnpm run build`.
7. Conectar GitHub → Cloudflare Pages → dominio propio.

**Regla de control de cambios:** cualquier nueva propuesta técnica se contrasta primero con este documento. Si aumenta servicios, costos, complejidad o estados editoriales, debe justificarse con una necesidad concreta de la banda y aprobarse antes de implementarse.

---

**Referencias internas:** Manual Creativo Oficial Tres Raíces (junio de 2026); Prompts Oficiales Tres Raíces (junio de 2026); decisiones consolidadas de planificación web V1.26–V1.46.
