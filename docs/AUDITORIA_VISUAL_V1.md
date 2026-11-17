# Auditoría visual V1 — Tres Raíces

**Fecha:** 16 de noviembre de 2026  
**Estado:** Lotes A, B y C implementados y aprobados visualmente por el responsable  
**Alcance revisado:** web pública Astro, componentes compartidos, estilos globales, contratos y contenido actualmente presente en el repositorio.

## 0. Método, fuentes y límites

Esta auditoría cruza tres tipos de evidencia:

1. **Evidencia de código:** clases Tailwind, CSS global, estructura Astro, dimensiones de assets y contenido local real.
2. **Evidencia documental:** `BASE_PROPUESTA_V1.md`, `MANUAL_CREATIVO_OFICIAL.md`, `ARQUITECTURA_Y_EDITOR_LOCAL.md`, `HOJA_DE_RUTA.md`, `CONTRATOS_CONTENIDO_V1.md` y `DECISIONES.md`.
3. **Estudio de referencias públicas:** contenido accesible de QOTSA, Royal Blood y Bandweb. Se extraen principios, no layouts ni recursos.

No fue posible conectar un navegador visual ni obtener capturas en las sesiones de auditoría e implementación. La URL de Cloudflare Pages tampoco estuvo accesible mediante la herramienta web disponible. Por tanto:

- las medidas y relaciones descritas como **confirmadas** provienen del código y los assets locales;
- las consecuencias marcadas como **hipótesis visual** deben validarse en una ronda de capturas antes de implementar;
- no se afirma haber inspeccionado visualmente la versión pública o local;
- no se incluyen métricas de Lighthouse inventadas.

La revisión visual pendiente debe cubrir 375, 393, 768, 1280, 1440 y 1920 px, con contenido real y estados de interacción.

---

## 1. Diagnóstico global

La base es coherente y sobria: paleta oscura, tipografía con carácter, navegación clara, bordes rectos, ausencia de radios genéricos y uso contenido de efectos. La arquitectura visual ya apunta en la dirección correcta y no requiere un rediseño desde cero.

El problema principal de desktop no está en una sola regla, sino en cuatro decisiones acumuladas:

1. **Las imágenes determinan demasiado la altura de los módulos.** Retratos, afiches y portadas usan `object-contain` y relaciones 4:5 sin un límite de altura editorial consistente. En `/banda`, la foto vertical puede fijar una fila cercana a 790 px en un contenedor interior de aproximadamente 1056 px; tres módulos consecutivos producen un recorrido excesivamente largo.
2. **Casi todos los bloques importantes ocupan el ancho completo disponible.** El contenedor de 70rem (1120 px) es correcto, pero falta una segunda escala de lectura (aprox. 720–800 px) y una escala editorial media (aprox. 920–1040 px). Esto hace que textos breves y tarjetas con poco contenido se sientan extendidos.
3. **La jerarquía se repite con poca variación.** Muchos bloques usan el mismo patrón de eyebrow + H2 de 36 px + tarjeta con borde. Inicio respeta el orden funcional, pero En Vivo, Media, Banda, News y Galería reciben un tratamiento demasiado equivalente.
4. **El sistema existe de hecho, pero no está formalizado.** Colores, tamaños, espaciados, botones y tarjetas se repiten como utilidades largas. Esto facilita pequeñas divergencias y dificulta ajustar el ritmo global de forma coordinada.

### Fortalezas a preservar

- `max-w-[70rem]` equivale a 1120 px: está dentro del rango recomendado y evita expansión sin límite en 1440/1920.
- Oswald 700 para display e IBM Plex Sans 400 para cuerpo responde a la decisión D-021 y separa identidad de legibilidad.
- El blanco envejecido `#e5e1d8` evita el blanco puro y alcanza contraste holgado sobre los fondos oscuros.
- La navegación desktop es compacta; el header pasa de 80 a 64 px al hacer scroll.
- Los controles táctiles principales tienen al menos 44 px de alto.
- Bordes rectos y ausencia de gradientes/neón mantienen la identidad industrial.
- Los modales cargan video bajo demanda y las galerías conservan navegación por teclado.

### Riesgos transversales

- El azul petróleo actual `#386779` ofrece solo **3.03:1** sobre carbón `#101213` y **2.77:1** sobre hierro `#181c1e`. No debe usarse como color único de texto pequeño, fechas o enlaces sobre esos fondos. Sí puede mantenerse como superficie, borde, detalle o texto grande/negrita cuando corresponda.
- Carbón, hierro y bordes tienen diferencias de luminancia pequeñas. El fondo continuo es correcto para la marca, pero algunas secciones dependen casi exclusivamente de un borde de 1 px para separarse.
- `min-h-[48vh]` aparece en todas las páginas interiores. Aunque no llega a 100vh, estira estados vacíos y páginas con poco contenido por una razón estructural, no editorial.
- Los placeholders visibles de Network y Colaboradores usan nombres genéricos y `ejemplo.cl`. Esto contradice la regla de no presentar datos ficticios como reales y debilita la percepción profesional. Es un problema editorial ya presente, no una propuesta de cambiar contratos.

---

## 2. Evidencia por página y breakpoint

### 2.1 Inicio

**Confirmado en código**

- El hero usa padding vertical de 32/40/56/64 px, no una altura editorial ni una imagen atmosférica. En desktop su contenido cabe en una franja relativamente baja; no cumple aún la intención aprobada de “Hero grande” ni el rango orientativo 70–85vh.
- El H1 llega a 6rem (96 px) por `clamp()` en desktop. Tiene límite y máximo de 12 caracteres por línea, pero puede dominar frente a un hero sin fotografía.
- Las secciones principales usan 80 px verticales en `lg`; la cadencia es coherente, aunque igual para En Vivo, Media, Banda, News y Galería.
- En Vivo y News presentan tarjetas 4:5 a ancho considerable; Media usa una retícula de tres columnas incluso cuando solo existe un video, dejándolo en aproximadamente un tercio del ancho.
- Galería usa tres imágenes verticales 4:5 en una fila; es más contenida que una sección a pantalla completa, pero suma unos 440 px de imagen a 1280/1440.

**Hipótesis visual por ancho**

- **375/393:** el hero será legible y compacto, pero el logo + H1 + dos CTA apilados pueden sentirse como piezas independientes más que como una sola composición. Las cabeceras con título a la izquierda y enlace a la derecha pueden quedar tensas si el texto crece.
- **768:** comienza abruptamente la composición de dos columnas y la navegación completa; conviene validar que seis enlaces más el logo no se perciban apretados.
- **1280/1440:** el hero probablemente se verá menos protagonista que las tarjetas siguientes. El H1 puede ser muy grande respecto de la altura total del bloque.
- **1920:** el límite de 1120 px es sano, pero el hero queda como una isla centrada con grandes márgenes laterales y poca profundidad visual. No se debe agrandar todo; se debe mejorar composición, fondo y encuadre.

**Dirección propuesta**

- Convertir el hero en el único bloque de gran escala: altura editorial de 32–40rem según breakpoint, sin forzar 100vh ni crear espacio vacío artificial.
- Mantener el logo oficial y sumar profundidad mediante fotografía auténtica o textura permitida, con overlay oscuro estable; no crear símbolos nuevos.
- Limitar el H1 a 64–80 px en desktop según la foto y la longitud real; el impacto debe venir de la composición, no solo del tamaño.
- Dar En Vivo y Media una escala media; reducir Banda, News y Galería a bloques editoriales más compactos. Colaboradores debe seguir siendo una franja discreta.
- Si Media tiene un solo video, usar un módulo destacado de ancho medio/grande, no una celda solitaria de una retícula de tres.

### 2.2 Banda

**Confirmado en código**

- Historia usa dos columnas equilibradas y una foto grupal 4:3: proporción razonable.
- Cada integrante usa dos columnas 50/50. Las fotos fuente son verticales, 1366×2048 (2:3), y en desktop pasan a `aspect-auto` con ancho cercano a la mitad del contenedor. Sin `max-height`, una foto puede elevar la fila a aproximadamente 790 px.
- Las biografías están vacías y se muestra “Biografía en preparación”. Hay muy poco texto frente a una imagen de gran tamaño.
- Los tres módulos repiten borde, fondo, composición y escala, por lo que la longitud total puede superar ampliamente la densidad real del contenido.

**Hipótesis visual**

- **375/393:** las fotos 4:3 con `object-contain` dejarán espacio vacío porque los originales son 2:3; el módulo será tolerable, aunque la imagen no aprovecha bien el marco.
- **768–1440:** es el punto crítico. La imagen vertical gobierna la altura y el texto queda flotando en una superficie grande.
- **1920:** el contenedor impide crecimiento adicional, pero no corrige la desproporción interna.

**Dirección propuesta**

- Mantener módulos alternados, pero usar una columna de imagen de 38–44% y una altura desktop controlada de 420–520 px.
- Elegir `object-cover` solo después de aprobar encuadres que no corten rostros ni identidad; si se mantiene `contain`, usar un fondo/textura discreta y un ancho visual menor.
- Para bios vacías, reducir aún más la altura o tratar la ficha como retrato editorial compacto; no compensar contenido ausente con tamaño.
- Limitar historia y bios a 60–68 caracteres por línea.

### 2.3 En Vivo

**Confirmado en código**

- PageHeader + sección principal suman 40 px de cabecera y hasta 48/80 px de contenido antes/después.
- Las tarjetas son horizontales desde 640 px, con afiche `object-contain`, buen patrón para preservar arte original.
- Todas las listas usan tarjetas a ancho completo y espacios verticales de 16–20 px.
- Los estados cancelada/reprogramada tienen cinta diagonal; la jerarquía semántica es clara.

**Hipótesis visual**

- **Móvil:** afiche 4:5 a ancho completo ocupa buena parte de la pantalla antes de los datos. Es aceptable para una fecha destacada, pesado para un historial largo.
- **Desktop:** una tarjeta única a 1120 px es más ancha de lo que necesita el texto; el afiche puede percibirse grande frente a pocos datos.

**Dirección propuesta**

- Próxima fecha: ancho editorial 920–1040 px y afiche protagonista, con altura máxima de 480–560 px.
- Historial: versión más compacta, afiche menor o filas densas, sin alterar información ni estados.
- Reservar el botón lleno para la acción principal de entradas; los enlaces secundarios deben ser sobrios.

### 2.4 Media

**Confirmado en código**

- Canal, plataformas y videos se separan con `space-y-12/16`.
- El video usa miniatura 16:9, título de 24 px y tarjeta de tres columnas desde `lg`.
- El título real del único video es largo; a un tercio del contenedor puede ocupar muchas líneas.
- El azul se usa en fechas pequeñas, caso donde el contraste actual es insuficiente.

**Dirección propuesta**

- Un video: ancho máximo 760–900 px. Dos: dos columnas. Tres o más: retícula de tres solo desde un ancho que mantenga títulos legibles.
- Acotar títulos a una jerarquía de 20–24 px y `line-height` 1.1–1.2.
- Canal oficial y plataformas deben formar una franja de utilidades compacta, no dos secciones visualmente equivalentes a Videos.

### 2.5 News

**Confirmado en código**

- La noticia destacada usa una cuadrícula con imagen 4:5 y mínimo 224 px. En desktop el ancho de la imagen puede producir una altura cercana a 550–600 px.
- La portada real es un afiche 1122×1402, por lo que `contain` evita recortes y es coherente.
- Las noticias anteriores usan tarjetas verticales 4:5 en tres columnas.
- Solo hay una noticia actual, así que la página muestra un bloque destacado grande y ningún archivo.

**Dirección propuesta**

- Destacada: limitar el bloque a 920–1040 px y la imagen a 420–520 px; permitir que el afiche respire sin que gobierne toda la pantalla.
- Archivo: tarjetas más editoriales, con relación de imagen adaptable al arte y títulos de 20–24 px.
- Evitar que portada de afiche y tarjeta de evento se sientan idénticas: News necesita más peso de titular/resumen; En Vivo, más peso de fecha/lugar.

### 2.6 Detalle de noticia

**Confirmado en código**

- El artículo usa 52rem (832 px), adecuado como límite externo, pero el cuerpo no tiene un `max-width` de lectura más estrecho dentro de ese espacio.
- H1 llega a 72 px; para títulos largos puede producir un bloque alto.
- Cuerpo 14/16 px, algo pequeño para lectura editorial prolongada en desktop.
- La imagen de portada admite hasta 75dvh y conserva proporción.

**Dirección propuesta**

- Ancho de lectura: 42–46rem; cuerpo 17–18 px, interlineado 1.65–1.75.
- H1: 40–64 px según viewport, con ancho máximo en caracteres.
- Metadatos discretos pero con color accesible. Mantener imágenes adicionales agrupadas al final.

### 2.7 Galería

**Confirmado en código**

- Las fotos son 1152×1536 (3:4), pero las celdas son 4:5 y usan `contain`; habrá bandas internas leves.
- En desktop hay tres columnas; cada celda ronda 420–440 px de alto.
- La descripción está siempre visible en móvil y solo en hover desde `sm`.
- El lightbox conserva imagen completa y navegación accesible.

**Dirección propuesta**

- Usar una relación 3:4 compatible con el material real o permitir un mosaico editorial con alturas acotadas.
- Mantener tres columnas en desktop; evitar aumentar a cuatro solo por existir espacio en 1920.
- Añadir un indicador visual de ampliación que no dependa exclusivamente del hover; conservar `focus-visible` equivalente.

### 2.8 Network

**Confirmado en código**

- Tres tarjetas por fila, altura mínima 208 px, borde y fondo idénticos a otras tarjetas.
- La tarjeta completa es clicable cuando existe URL, una buena decisión de interacción.
- El primer “logo” actual es una foto grupal y los nombres/URLs son placeholders visibles.

**Dirección propuesta**

- No publicar elementos hasta contar con nombres, logos y enlaces confirmados.
- Cuando exista contenido real, presentar logos en una retícula neutral y más compacta (160–200 px de alto), sin transformar Network en un dashboard.
- Respetar colores originales de logos y darles área de seguridad consistente.

### 2.9 Header y navegación

**Confirmado en código**

- Sticky, 80 px desktop y 64 px al hacer scroll; en móvil 64/56 px.
- El header de Inicio es translúcido, pero al ser `sticky` ocupa flujo y no se superpone realmente al hero como plantea el documento base.
- Seis enlaces aparecen desde 768 px, con 12–20 px de separación.
- Estado activo se diferencia principalmente por color; el cambio entre `#a9afb0` y `#e5e1d8` es perceptible, pero puede reforzarse sin decoración excesiva.

**Dirección propuesta**

- Mantener alturas actuales; son compactas y correctas.
- Validar 768–900 px: si la navegación queda comprimida, mover el breakpoint de menú completo sin reducir legibilidad.
- En Inicio, evaluar header realmente superpuesto al hero solo si el contraste sobre la fotografía queda garantizado.
- Añadir marca activa discreta (borde inferior o pequeña línea industrial), además del color.

### 2.10 Footer

**Confirmado en código**

- 32/40 px verticales, dos columnas desde 768 px, contacto y redes con objetivos táctiles de 44 px.
- Tiene presencia contenida y cumple el nivel de protagonismo solicitado.

**Dirección propuesta**

- Mantener escala y estructura.
- Reforzar agrupación de contacto, redes y navegación mediante espaciado/divisores, no con nuevas tarjetas.
- Verificar estados focus/hover de iconos y enlaces con el nuevo azul interactivo.

### 2.11 PageHeader y páginas interiores

**Confirmado en código**

- PageHeader usa 28–40 px verticales y H1 de 32–64 px. Es compacto frente al hero y sigue la arquitectura aprobada.
- Todas las páginas interiores agregan `min-h-[48vh]`, aunque su contenido no lo requiera.

**Dirección propuesta**

- Mantener PageHeader como franja industrial contenida.
- H1 interior: 40–56 px en desktop; reservar 64 px para títulos cortos.
- Retirar la altura mínima como regla general; usarla solo en estados vacíos/404 donde ayuda a sostener el footer.

---

## 3. Referencias y aprendizajes aplicables

### QOTSA

La portada pública prioriza una idea visual dominante y muy pocas acciones (“Listen”, lanzamiento actual). El aprendizaje no es copiar su interacción ni su gráfica, sino **reducir competencia en el primer pantallazo**: una atmósfera, una frase, dos acciones como máximo.

Aplicable a Tres Raíces:

- Hero con una sola composición fuerte, logo oficial y “Rock desde Talcahuano”.
- Evitar que todas las secciones intenten igualar el impacto del hero.
- Movimiento, si se considera más adelante, debe ser opcional, breve y respetar `prefers-reduced-motion`; no forma parte de esta propuesta inicial.

### Royal Blood

La referencia actual usa imágenes de campaña, navegación corta y foco comercial/lanzamiento. Su estructura confirma el valor de **dar protagonismo a una campaña vigente** y usar fotografía como contenido, no como adorno.

Aplicable:

- La próxima fecha y el último video pueden funcionar como campañas temporales de impacto medio.
- Una imagen protagonista debe tener una acción clara y metadatos concisos.

No aplicable:

- Tienda, carrito, newsletter y densidad comercial están fuera del alcance V1.
- No trasladar barras promocionales, urgencia de venta o componentes de e-commerce.

### Bandweb Design

Bandweb formula tres principios pertinentes: una web musical debe sentirse como la música; los estilos “Bold/Editorial” se apoyan en contraste y tipografía; los estilos “Dark/Atmospheric” usan grano, profundidad y sombra. También enfatiza consistencia de tokens y revisar diseño en distintas pantallas.

Aplicable:

- Combinar “Bold/Editorial” para jerarquía con “Dark/Atmospheric” para superficie.
- Usar grano y textura como capa de ambiente, nunca detrás de párrafos sin control.
- Mantener paleta y tipografía coherentes entre páginas.
- Tratar Inicio como puerta de entrada hacia páginas completas, no como una colección infinita de bloques equivalentes.

No aplicable:

- Sus plantillas, SaaS, editor y automatizaciones no son parte de la arquitectura de Tres Raíces.

---

## 4. Sistema visual propuesto

Los siguientes tokens son una propuesta, no una decisión aprobada. Deben probarse con los assets reales antes de implementarse.

### 4.1 Colores semánticos

| Token | Valor propuesto | Uso |
|---|---:|---|
| `surface-canvas` | `#101213` | Fondo principal carbón |
| `surface-raised` | `#181c1e` | Tarjetas y franjas elevadas |
| `surface-muted` | `#22282b` | Separación sutil, overlays sólidos |
| `border-subtle` | `#31383b` | Bordes decorativos |
| `border-strong` | `#4b565b` | Focus complementario, divisores importantes |
| `text-primary` | `#e5e1d8` | Títulos y texto principal |
| `text-secondary` | `#b7bdbc` | Cuerpo secundario y metadatos; elevar levemente el gris actual |
| `accent-petrol` | `#386779` | Superficies, reglas, textura, estados decorativos |
| `accent-interactive` | `#6f9caf` | Links, fechas pequeñas, focus y texto interactivo sobre fondo oscuro |
| `on-accent` | `#101213` | Texto sobre acento claro |
| `overlay` | `rgba(16,18,19,.72)` | Legibilidad sobre fotografía |

Reglas:

- `text-primary` sobre `surface-canvas/raised` para lectura normal.
- `text-secondary` debe mantener al menos 4.5:1 en texto normal.
- `accent-petrol` no debe ser el único indicador en texto pequeño.
- Hover y focus no dependerán solo de cambiar entre dos azules cercanos: combinar color con borde, subrayado o fondo.
- Texturas al 3–8% de opacidad; nunca reducir contraste efectivo del texto.

### 4.2 Escala tipográfica

| Rol | Móvil | Desktop | Line-height | Uso |
|---|---:|---:|---:|---|
| Hero | 42–52 px | 64–80 px | 0.94–1.0 | Solo Inicio |
| H1 interior | 36–44 px | 48–56 px | 1.0–1.08 | PageHeader y artículos |
| H2 sección | 30–34 px | 36–42 px | 1.0–1.08 | Secciones principales |
| H3/tarjeta | 21–24 px | 22–26 px | 1.1–1.2 | Títulos de módulos |
| Cuerpo editorial | 16–17 px | 17–18 px | 1.65–1.75 | Historia/noticias |
| Cuerpo UI | 15–16 px | 16 px | 1.55–1.65 | Tarjetas y descripciones |
| Secundario | 13–14 px | 14–15 px | 1.45–1.6 | Metadatos |
| Eyebrow/nav | 12–13 px | 12–14 px | 1.2–1.4 | Mayúsculas, tracking 0.08–0.12em |

Reglas:

- Oswald se reserva para títulos, navegación, botones y etiquetas; no usarla en párrafos largos.
- IBM Plex Sans debe sostener la lectura. Si más adelante se suma peso 500/600, requerirá asset local y evaluación de costo; no es necesario para esta fase.
- Máximo de línea: 60–68 caracteres en cuerpo editorial; 45–60 en resúmenes; 12–18 caracteres visuales para hero/H1 cuando sea posible.
- Evitar mayúsculas sostenidas en párrafos y titulares largos de noticias.

### 4.3 Espaciado

Escala base propuesta: `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96` px.

| Contexto | Móvil | Tablet | Desktop |
|---|---:|---:|---:|
| Padding de sección compacto | 32–40 | 40–48 | 48–64 |
| Padding de sección estándar | 48 | 56–64 | 64–80 |
| Sección protagonista | 56–64 | 72 | 80–96 |
| Separación título/contenido | 16–20 | 20–24 | 24–32 |
| Gap de retícula | 16 | 20–24 | 24–32 |
| Padding de tarjeta | 16–20 | 20–24 | 24–32 |

No usar la misma profundidad en todas las secciones. Inicio debe seguir esta secuencia aproximada: Hero protagonista; En Vivo/Media estándar-amplio; Banda/News/Galería estándar o compacto; Colaboradores/Footer compacto.

### 4.4 Contenedores

| Token | Ancho | Uso |
|---|---:|---|
| `container-wide` | 1120 px | Header, hero, retículas amplias |
| `container-editorial` | 960–1040 px | Eventos, noticia destacada, Banda |
| `container-reading` | 720–768 px | Artículos e historia larga |
| `container-compact` | 640 px | Estados vacíos, mensajes, bloques breves |

Gutters: 16 px en móvil, 24 px desde 640, 32 px desde 1024. En 1920 no aumentar el contenido por encima de 1120–1200 px; usar el espacio exterior para respiración y atmósfera.

### 4.5 Alturas y proporciones

- Hero Inicio: 32–40rem (512–640 px) según breakpoint; no `100vh` ni una altura basada indiscriminadamente en viewport.
- PageHeader: contenido natural, aprox. 144–220 px según descripción.
- Retrato de integrante: 420–520 px en desktop; 320–440 px en móvil según encuadre.
- Afiche destacado: máximo 480–560 px.
- Tarjeta de video: imagen 16:9; sin altura mínima adicional.
- Galería: preferir 3:4 para el material actual; máximo visual por miniatura de 420–460 px.
- Estados vacíos: altura natural; centrar verticalmente solo si la página total quedaría visualmente rota.

### 4.6 Breakpoints y reglas responsive

Se pueden conservar los breakpoints nativos de Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536), pero no cada componente necesita cambiar exactamente en ellos.

- **375/393:** una columna, gutters 16 px, CTA apilados solo si no caben, títulos con `clamp()` limitado.
- **768:** validar header; usar dos columnas solo cuando cada una conserve al menos 280–320 px útiles.
- **1280/1440:** composición objetivo. Controlar alturas de imagen y longitudes de línea.
- **1920:** conservar los mismos máximos; no escalar tipografía ni tarjetas por el ancho de viewport.
- Los cambios de layout deben responder al contenido, no solo al dispositivo.
- Toda interacción de hover debe tener equivalente visible en focus y estado utilizable en touch.

### 4.7 Botones y enlaces

Tres variantes compartidas:

1. **Primario:** fondo `accent-interactive` o petrol ajustado con texto carbón; una sola acción dominante por bloque.
2. **Secundario:** borde fuerte, fondo transparente, texto primario.
3. **Textual:** texto + flecha, con subrayado o regla en hover/focus.

Altura mínima 44 px, padding horizontal 16–20 px, sin radios o con radio máximo de 2 px si fuera necesario técnicamente. Transiciones de 150–220 ms; evitar escalados llamativos.

### 4.8 Tarjetas

- Borde 1 px y fondo elevado; sin sombra por defecto.
- Separar tipos por jerarquía interna, no por inventar muchas superficies.
- Evento: fecha/lugar/estado primero.
- News: titular/resumen primero.
- Video: miniatura/play primero.
- Network: logo/nombre, composición neutral.
- Hover: cambio de borde o fondo de baja amplitud; nunca glow.
- Imágenes con límites explícitos de altura y reglas de recorte documentadas por componente.

---

## 5. Priorización de cambios

### P0 — Antes de pulido visual

1. Validar y retirar de publicación placeholders visibles de Network/Colaboradores hasta tener datos reales.
2. Capturar la versión local en los seis anchos acordados y confirmar las hipótesis de proporción.
3. Definir el azul interactivo accesible y revisar todas las fechas, links y focus.

### P1 — Mayor impacto en percepción

1. Formalizar tokens de color, tipografía, contenedores y espaciado.
2. Replantear hero de Inicio como único bloque protagonista, preservando logo y fotos reales.
3. Limitar alturas de imágenes en Banda, News y En Vivo.
4. Introducir contenedores editorial y de lectura; dejar de usar 1120 px para todo.
5. Diferenciar el ritmo de Inicio según los cuatro niveles de protagonismo aprobados.

### P2 — Consistencia por componente

1. Consolidar variantes de botón y enlace.
2. Ajustar tarjetas por tipo de contenido.
3. Afinar PageHeader, estados activos de navegación y footer.
4. Mejorar tipografía del detalle de noticia y textos largos.
5. Revisar Galería y Media con cantidades variables de elementos.

### P3 — Pulido y validación

1. Estados hover, focus, active y disabled.
2. Textura/grano de baja intensidad y overlays sobre fotografía.
3. Pruebas con títulos largos, bios completas, múltiples eventos y más noticias.
4. Revisión visual final 375/393/768/1280/1440/1920 y reducción de movimiento.

---

## 6. Plan incremental de implementación

### Fase 1 — Baseline visual verificable

- Generar capturas locales de todas las rutas y anchos objetivo.
- Registrar altura de cada sección y componente principal.
- Confirmar qué contenido placeholder debe ocultarse sin alterar contratos.
- Criterio de salida: matriz visual completa y decisiones de P0 aprobadas.

### Fase 2 — Fundamentos compartidos

- Implementar tokens semánticos en `global.css`/Tailwind.
- Añadir contenedores `wide`, `editorial`, `reading` y `compact`.
- Normalizar escala tipográfica, espaciado y botones.
- Criterio de salida: contraste verificable y ninguna regresión móvil.

### Fase 3 — Inicio

- Ajustar hero y jerarquía de secciones sin cambiar el orden aprobado.
- Dar tratamiento medio a En Vivo/Media y tratamiento contenido a Banda/News/Galería.
- Mantener Colaboradores/Footer discretos.
- Criterio de salida: el hero domina; ninguna otra sección parece una segunda portada.

### Fase 4 — Páginas interiores

- Banda: controlar retratos y líneas de texto.
- En Vivo: distinguir próxima fecha e historial.
- Media: adaptar retícula a cantidad real.
- News/detalle: optimizar lectura y portadas.
- Galería/Network: ajustar proporciones y densidad.
- Criterio de salida: ritmo coherente entre páginas sin homogeneizarlas.

### Fase 5 — Interacción y QA

- Revisar header, modales, lightbox, estados de controles y navegación por teclado.
- Ejecutar `pnpm run check`, `pnpm run build` y pruebas existentes.
- Capturar nuevamente todos los breakpoints y comparar con baseline.
- Criterio de salida: build estático válido, sin editor en `dist`, sin cambios de contratos ni contenido.

---

## 7. Criterios de aprobación visual

La propuesta se considera resuelta cuando:

- en 1280, 1440 y 1920 ninguna tarjeta crece por encima de lo que justifica su contenido;
- Inicio tiene un hero claramente dominante y las secciones restantes muestran jerarquías distintas;
- Banda no presenta tres módulos de retrato de altura desproporcionada;
- cuerpo y metadatos alcanzan contraste legible y los enlaces no dependen solo del color;
- los artículos mantienen líneas de lectura de 60–68 caracteres;
- móvil conserva orden, objetivos táctiles y legibilidad sin overflow;
- los assets oficiales mantienen proporciones e identidad;
- no se añaden símbolos, dependencias, frameworks ni funciones fuera de V1.

## 8. Decisiones resueltas para Lotes A y B

1. Se implementó la separación entre azul petróleo de identidad (`accent-petrol`) y azul claro de interacción (`accent-interactive`).
2. Se implementó un hero de 512–640 px con fotografía auténtica y H1 máximo de 80 px; esta regla reemplaza la propuesta preliminar basada en `svh`.
3. Se aprobaron límites de altura para los módulos de Inicio. Los encuadres específicos de páginas interiores quedan para Lote C.
4. Se implementaron cuatro anchos de contenedor.
5. Los placeholders de Colaboradores se ocultan en Inicio. Network queda pendiente porque pertenece a páginas interiores.

## 9. Registro de implementación — Lotes A y B

**Fecha:** 16 de noviembre de 2026  
**Alcance:** fundamentos visuales globales e Inicio. No se avanzó a la composición específica de páginas interiores.

### 9.1 Fundamentos implementados

- Tokens semánticos añadidos sin retirar los alias anteriores necesarios para mantener compatibilidad:
  - superficies `#101213`, `#181c1e`, `#22282b`;
  - bordes `#31383b`, `#4b565b`;
  - textos `#e5e1d8`, `#b7bdbc`;
  - azul petróleo `#386779` y azul interactivo `#6f9caf`.
- El azul interactivo alcanza **6.31:1** sobre carbón y **5.76:1** sobre hierro; ambos superan WCAG AA para texto normal.
- El gris secundario alcanza **9.86:1** sobre carbón y **9.00:1** sobre hierro.
- Contenedores reutilizables implementados: wide 1120 px, editorial 1024 px, reading 768 px y compact 640 px.
- Ritmos de sección implementados: protagonista 56–80 px, estándar 48–64 px y compacto 40–48 px según breakpoint.
- Clases compartidas para eyebrow, H2 de sección, botón primario, botón secundario y enlace textual.
- Focus global trasladado al azul interactivo. Fechas y pequeños estados interactivos de componentes compartidos usan el color accesible.
- Navegación activa desktop reforzada con una línea inferior, además del color.

### 9.2 Inicio implementado

- Hero reconstruido con la fotografía grupal auténtica existente, logo oficial sin alteración y overlay oscuro destinado a legibilidad.
- Altura editorial: 512 px móvil, 576 px tablet y 640 px desktop. H1 limitado a 42–52 px móvil y 64–80 px desktop.
- Se mantienen exactamente dos CTA y el orden funcional aprobado.
- En Vivo usa el contenedor editorial y una variante destacada que limita el afiche a 432 px y la columna visual a 304 px en desktop.
- Un único video pasa a un módulo destacado de máximo 832 px, conservando modal y carga bajo demanda.
- Banda, News y Galería usan ritmo estándar y contenedor editorial. News se limita adicionalmente a 928 px y Galería adopta la proporción 3:4 del material real con máximo de 400 px.
- Colaboradores con nombre o URL de placeholder se excluyen de Inicio. No se modificaron los datos ni los contratos.
- Footer conserva su estructura contenida.

### 9.3 Componentes compartidos ajustados

- `ShowCard`: variante opcional `featured`; comportamiento por defecto preservado para páginas interiores.
- `VideoModal`: variante opcional `featured`; modal, iframe diferido y comportamiento por defecto preservados.
- `NewsCard`, `SiteHeader`, `SiteFooter` y controles de lightbox/modal: estados interactivos con contraste reforzado.

### 9.4 Validaciones realizadas

- `pnpm run check`: 32 archivos, 0 errores, 0 advertencias y 0 hints.
- `pnpm run build`: correcto; nueve páginas estáticas generadas y sitemap creado.
- `pnpm run test`: 19 pruebas aprobadas.
- Revisión del HTML generado: nueve documentos y cero enlaces internos faltantes.
- Editor dentro de `dist`: no encontrado.
- Placeholders de Colaboradores dentro de `dist/index.html`: no encontrados.
- `git diff --check`: correcto.

Las tareas se ejecutaron con Node 22.23.4, requerido por el proyecto. La shell estaba seleccionando inicialmente Node 20.20.1 pese a existir `.nvmrc`.

### 9.5 Limitaciones de validación

- El navegador integrado no estuvo disponible.
- Playwright no está instalado y no se añadió como dependencia.
- El sandbox impidió abrir un servidor local (`listen EPERM`), por lo que no se realizaron capturas comparativas ni pruebas visuales reales en 375/393/768/1280/1440/1920.
- Menú móvil, modal y lightbox conservaron su marcado, listeners y build correcto, pero su interacción visual debe probarse manualmente en navegador antes de aprobar el lote.

### 9.6 Pendiente después de Lotes A y B

- Confirmar visualmente encuadre y contraste del hero en los seis anchos objetivo.
- Verificar que el header completo no quede comprimido entre 768 y 900 px.
- Validar foco, apertura/cierre y scroll de menú, modal y lightbox.
- Páginas interiores: abordadas posteriormente en el Lote C, registrado a continuación.

No se modificaron contratos JSON/Markdown, contenidos, assets, editor local, dominio, arquitectura Astro SSG ni dependencias.

## 10. Registro de implementación — Lote C

**Fecha:** 16 de noviembre de 2026  
**Alcance:** páginas interiores y PageHeader compartido. Se preservaron contenido, contratos y comportamientos existentes.

### 10.1 Cabeceras interiores

- PageHeader adopta los tokens semánticos y el contenedor wide.
- H1 interior limitado a 36–44 px en móvil y 48–56 px en desktop.
- Descripción a 16 px con ancho máximo de lectura de 768 px.
- Se mantiene como franja industrial compacta, sin competir con el hero de Inicio.

### 10.2 Banda

- Página trasladada al contenedor editorial de 1024 px y ritmo estándar.
- Historia con cuerpo de 16–17 px, interlineado amplio y máximo de 62 caracteres aproximados.
- Retratos limitados a 352 px en móvil, 416 px en tablet y 480 px en desktop.
- Columna de imagen limitada al 42% en desktop, manteniendo la alternancia y `object-contain` para no recortar rostros.
- Títulos de integrantes reducidos a 28–36 px.

### 10.3 En Vivo

- Listado trasladado al contenedor editorial.
- Encabezados normalizados con eyebrow accesible y H2 compartido.
- Se conservaron clasificación por fecha, estados, plantillas de actualización en navegador, cinta diagonal y enlaces de entradas.

### 10.4 Media

- Canal oficial y plataformas se agrupan en una franja compacta de una o dos columnas.
- Botones migrados a la variante secundaria compartida.
- Un solo video usa el módulo destacado de 832 px; dos o más conservan la retícula adaptable.
- Modal y carga diferida del iframe permanecen intactos.

### 10.5 News y detalle

- Listado trasladado al contenedor editorial; noticia destacada limitada a 928 px.
- Detalle trasladado al contenedor de lectura de 768 px.
- H1 de artículo limitado a 36–64 px y 18 caracteres visuales de ancho.
- Cuerpo editorial a 16–17 px, `line-height: 1.7`, enlaces accesibles y portada limitada a 608 px.
- Imágenes adicionales continúan agrupadas al final.

### 10.6 Galería

- Página trasladada al contenedor editorial.
- Miniaturas ajustadas a la relación 3:4 del material real y altura máxima de 448 px.
- Lightbox, descripciones, navegación y teclado permanecen intactos.

### 10.7 Network

- Retícula trasladada al contenedor editorial.
- Tarjetas reducidas de 208 a 192 px de altura mínima; logos limitados a 96 px.
- Nombres y URLs reconocidos como placeholders se excluyen de la salida pública sin modificar `network.json`.
- El estado vacío aprobado se muestra mientras no haya bandas confirmadas.

### 10.8 Validaciones del Lote C

- `pnpm run check`: 32 archivos, 0 errores, 0 advertencias y 0 hints.
- `pnpm run test`: 19 pruebas aprobadas.
- `pnpm run build`: correcto; nueve páginas estáticas y sitemap generados.
- Enlaces internos del HTML generado: cero faltantes.
- Editor dentro de `dist`: no encontrado.
- Placeholders dentro de `/network`: no encontrados.
- `git diff --check`: correcto.

La implementación no pudo capturarse desde las herramientas de esta sesión. El responsable revisó y aprobó el resultado en 375, 393, 768, 1280, 1440 y 1920 px. La validación técnica automatizada de menú móvil, modal y lightbox permanece limitada a su estructura, listeners, pruebas existentes y compilación correcta.

## 11. Cierre de auditoría

**Aprobación visual comunicada:** 16 de noviembre de 2026.

- Breakpoints aprobados: 375, 393, 768, 1280, 1440 y 1920 px.
- Lotes aprobados: A — fundamentos, B — Inicio y C — páginas interiores.
- No quedan cambios visuales obligatorios dentro del alcance de esta auditoría.
- Cualquier ajuste posterior se tratará como una nueva iteración pequeña y verificable, sin reabrir automáticamente el alcance V1.

## 12. Ajuste posterior — paridad entre En Vivo y News en Inicio

**Fecha:** 16 de noviembre de 2026.

Después de rollbacks parciales realizados por el responsable, se tomó el estado resultante como nueva base. La noticia destacada de Inicio se alineó directamente con el módulo de próxima fecha:

- mismo contenedor editorial y mismo padding vertical protagonista;
- mismo ancho máximo de tarjeta: 960 px;
- misma columna visual: máximo 304 px;
- misma altura visual máxima en desktop: 432 px;
- misma escala para fecha, título y cuerpo;
- mismo padding interior de 16/20 px;
- portada completa mediante `object-contain`, sin deformación ni recorte.

La noticia conserva únicamente sus diferencias semánticas: resumen y enlace «Leer noticia». `pnpm run check` y `pnpm run build` finalizaron correctamente, sin errores ni advertencias.

## 13. Ajuste posterior — centrado de Media con un solo video

**Fecha:** 16 de noviembre de 2026.

La variante destacada de `VideoModal` combinaba clases de una y tres columnas. Debido al orden de generación de Tailwind, en desktop prevalecía la retícula de tres columnas y el único video quedaba en el tercio izquierdo.

Se separaron las variantes de forma excluyente:

- un video: una columna real, centrada y con ancho máximo de 832 px;
- varios videos: retícula responsive de una, dos y tres columnas;
- encabezado de la sección, tarjeta, título del video y CTA centrados cuando se muestra el video destacado.

El modal y su carga diferida permanecen sin cambios. `pnpm run check` y `pnpm run build` finalizaron correctamente, sin errores ni advertencias.

## 14. Ajuste posterior — footer

**Fecha:** 16 de noviembre de 2026.

Se simplificó el pie de página para corregir la desalineación y darle un cierre más coherente con la identidad del sitio:

- eliminado el menú duplicado del footer;
- fila compacta con logo abreviado oficial, redes sociales y correo;
- iconos sueltos, sin cajas, bordes ni fondos visibles;
- nombres conservados en `title` y `aria-label` para accesibilidad;
- áreas clicables invisibles de 44 px y estados hover/focus accesibles;
- divisor horizontal y franja inferior con copyright, año y lema territorial;
- sin créditos, agencias ni información ficticia.

`pnpm run check` y `pnpm run build` finalizaron correctamente, sin errores ni advertencias.
