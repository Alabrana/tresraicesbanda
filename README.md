# Tres Raíces — Web oficial

Repositorio base de planificación para la web oficial de **Tres Raíces**, banda de rock de Talcahuano, Chile.

> **Estado:** Fase 3 en curso. El repositorio contiene una web Astro estática, contratos de contenido validados y un editor de contenido exclusivamente local.

## Principios no negociables

- Sitio público **100 % estático** con Astro, publicado en **Cloudflare Pages**.
- Dominio oficial aprobado: **https://tresraicesbanda.cl**.
- Contenido editable manualmente mediante **Markdown y JSON** en el propio repositorio.
- **Sin base de datos ni backend de producción**, sin NestJS, Supabase ni CMS remoto.
- Editor **exclusivamente local**, para un único responsable; no aparece en el sitio publicado.
- Un **guardado general** para aplicar todas las modificaciones locales; publicación separada con `git commit` + `git push`.
- **Sin borradores, papelera, cuentas ni roles** en V1.
- Identidad chorera, portuaria y grunge; usar logos y fotografías auténticos.

## Documentación: orden de lectura

1. [`AGENTS.md`](AGENTS.md): instrucciones obligatorias para Codex/agentes.
2. [`docs/BASE_PROPUESTA_V1.md`](docs/BASE_PROPUESTA_V1.md): fuente principal de requisitos aprobados.
3. [`docs/MANUAL_CREATIVO_OFICIAL.md`](docs/MANUAL_CREATIVO_OFICIAL.md): identidad visual y comunicacional.
4. [`docs/CONTRATOS_CONTENIDO_V1.md`](docs/CONTRATOS_CONTENIDO_V1.md): estructura de datos prevista.
5. [`docs/ARQUITECTURA_Y_EDITOR_LOCAL.md`](docs/ARQUITECTURA_Y_EDITOR_LOCAL.md): restricciones técnicas.
6. [`docs/HOJA_DE_RUTA.md`](docs/HOJA_DE_RUTA.md): entregas y criterios de aceptación.
7. [`docs/DECISIONES.md`](docs/DECISIONES.md): decisiones y pendientes.
8. [`docs/PERFORMANCE_V1.md`](docs/PERFORMANCE_V1.md): PageSpeed, Lighthouse, baseline y comparación de rendimiento.

`docs/PROMPTS_OFICIALES_TRES_RAICES.md` aporta contexto creativo complementario.

## Material original

`assets/originales/` conserva las imágenes aportadas por la banda como **fuente de referencia**, no como recursos web optimizados. No alterar ni redibujar los logos oficiales ni inventar rostros. Durante la implementación, generar versiones web optimizadas en `public/images/` y referenciarlas en los archivos de contenido; no copiar indiscriminadamente originales pesados.

## Desarrollo local

Requiere Node.js 22.23.4 o superior y pnpm 12.21.0. Con NVM, activar la versión fijada en `.nvmrc`; después instalar dependencias y comprobar la salida estática:

```bash
nvm use
pnpm install
pnpm validate
```

`pnpm validate` ejecuta las pruebas de contratos y fechas, el chequeo de Astro y la compilación estática en `dist/`. Para trabajar con recarga local:

```bash
pnpm dev
```

El contenido se mantiene en `src/content/` y `src/data/`; las copias web de imágenes viven en `public/images/`. Tailwind CSS 4 compone la base visual mediante utilidades y tokens en `src/styles/global.css`.

## Rendimiento

La auditoría local siempre mide el build estático de producción, no `pnpm dev`:

```bash
pnpm perf:production  # PageSpeed Insights API sobre el dominio oficial
pnpm perf:local       # build + Lighthouse móvil/escritorio, tres repeticiones
pnpm perf:compare     # compara los dos reportes locales más recientes
```

`PAGESPEED_API_KEY` es opcional y nunca debe guardarse en el repositorio. La configuración, argumentos, resultados iniciales y limitaciones están en [`docs/PERFORMANCE_V1.md`](docs/PERFORMANCE_V1.md).

## Editor local

El editor se ejecuta solo en el computador del responsable y se enlaza exclusivamente a `127.0.0.1`. No es una ruta de Astro, no forma parte de `dist` y no publica cambios ni ejecuta Git.

```bash
pnpm editor
```

Abrir `http://127.0.0.1:4388`. El panel carga una copia de trabajo de todos los módulos, lista las imágenes existentes de `public/images/` y conserva los cambios en el navegador hasta pulsar **Guardar todos los cambios**. El guardado valida los contratos, evita sobrescribir modificaciones externas y escribe los archivos afectados como una operación coordinada con restauración ante fallos. Después corresponde revisar `git diff`, probar `pnpm dev` y publicar manualmente con Git cuando proceda.

### Añadir presentaciones

En Vivo no se almacena como un único arreglo. Cada presentación ocupa su propio archivo `src/content/shows/<id>.json` y el contenido de ese archivo es un objeto. Para agregarla manualmente, crea un archivo nuevo con un ID único y utiliza exactamente el mismo valor en su campo `id`; no añadas otro evento dentro de un archivo existente.

El editor local presenta esos archivos como un arreglo para que cada show sea un elemento independiente y resulte sencillo agregar, editar o eliminar presentaciones. Al usar **Guardar todos los cambios**, el campo `id` de cada elemento determina su archivo `src/content/shows/<id>.json`. Astro carga después todos esos archivos como una colección y los clasifica por fecha para próximas presentaciones e historial.

Si `4388` está ocupado por otro proceso local, se puede usar un puerto alternativo, por ejemplo `EDITOR_PORT=4390 pnpm editor`, y abrir la misma dirección con ese puerto.

El dominio configurado en Astro se usa solamente para URLs canónicas, sitemap y metadatos sociales del build. `pnpm dev` continúa sirviendo la web en `http://localhost:4321` y no redirige navegación, recursos ni llamadas locales al dominio público.

## Cloudflare Pages y dominio oficial

La configuración del repositorio está preparada para publicar desde la rama `main` con:

| Ajuste | Valor |
|---|---|
| Dominio principal | `tresraicesbanda.cl` |
| Dominio secundario | `www.tresraicesbanda.cl` |
| Rama de producción | `main` |
| Comando de compilación | `pnpm run build` |
| Directorio de salida | `dist` |
| Node.js | `22.23.4` |
| pnpm | `12.21.0` |

### Pasos manuales pendientes

1. En Cloudflare, crear o abrir el proyecto **Pages** conectado al repositorio GitHub y configurar los valores de la tabla anterior. Fijar `PNPM_VERSION=12.21.0` y, si la imagen de build lo permite, `NODE_VERSION=22.23.4`.
2. En **Workers & Pages → proyecto → Custom domains**, asociar primero `tresraicesbanda.cl`. Para un dominio raíz, Cloudflare requiere que la zona esté en la misma cuenta y que el registrador use los nameservers que Cloudflare entregue.
3. En el proveedor donde se registró el dominio, sustituir los nameservers únicamente por los indicados por Cloudflare y esperar a que la zona quede activa. No crear registros DNS a ciegas ni cambiar registros existentes antes de que Cloudflare indique qué necesita.
4. Una vez activo el dominio raíz, asociar `www.tresraicesbanda.cl` en el mismo panel y confirmar el registro DNS solicitado por Cloudflare.
5. Crear una regla de **Bulk Redirects** de `www.tresraicesbanda.cl` a `https://tresraicesbanda.cl`, con estado `301`, preservando query string y sufijo de ruta. Este redireccionamiento de host se configura en Cloudflare, no en Astro ni en `_redirects`.
6. Esperar a que ambos hostnames estén activos y que Cloudflare confirme HTTPS. Verificar `https://tresraicesbanda.cl`, el redireccionamiento de `www` y el certificado antes de anunciar el sitio.

No se realizaron cambios de DNS, conexiones a Cloudflare ni despliegues desde este repositorio.

## Preparar GitHub

### Preparar Git y GitHub (en Terminal de VS Code)

```bash
git init -b main
git add .
git commit -m "docs: establecer propuesta base Tres Raíces V1"
# Crear un repositorio vacío privado en GitHub antes de ejecutar:
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

No ingresar tokens de GitHub en el código ni subir secretos. Si Git solicita identificación, configurar `git config --global user.name` y `git config --global user.email` con tus datos reales. La integración con Cloudflare Pages se hará en la Fase 4.

## Convención de trabajo

Antes de cambiar alcance o agregar dependencias/servicios, contrastar la propuesta con `docs/BASE_PROPUESTA_V1.md` y registrar el acuerdo en `docs/DECISIONES.md`. Si una necesidad no está definida, preferir una implementación mínima o dejar un pendiente explícito; **no inventar datos oficiales de la banda**.
