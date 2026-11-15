# Tres Raíces — Web oficial

Repositorio base de planificación para la web oficial de **Tres Raíces**, banda de rock de Talcahuano, Chile.

> **Estado:** documentación inicial. **Todavía no contiene una aplicación Astro** ni scripts ejecutables. El proyecto comenzará a implementarse con Codex en VS Code, siguiendo la documentación aprobada.

## Principios no negociables

- Sitio público **100 % estático** con Astro, publicado en **Cloudflare Pages**.
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

`docs/PROMPTS_OFICIALES_TRES_RAICES.md` aporta contexto creativo complementario.

## Material original

`assets/originales/` conserva las imágenes aportadas por la banda como **fuente de referencia**, no como recursos web optimizados. No alterar ni redibujar los logos oficiales ni inventar rostros. Durante la implementación, generar versiones web optimizadas en `public/images/` y referenciarlas en los archivos de contenido; no copiar indiscriminadamente originales pesados.

## Primer paso en VS Code

Abrir esta carpeta en VS Code. Consultar [`docs/PROMPT_INICIAL_CODEX.md`](docs/PROMPT_INICIAL_CODEX.md) y pegarlo en Codex para iniciar **solo la fase 1**, con cambios pequeños y revisables.

### Preparar Git y GitHub (en Terminal de VS Code)

```bash
git init -b main
git add .
git commit -m "docs: establecer propuesta base Tres Raíces V1"
# Crear un repositorio vacío privado en GitHub antes de ejecutar:
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

No ingresar tokens de GitHub en el código ni subir secretos. Si Git solicita identificación, configurar `git config --global user.name` y `git config --global user.email` con tus datos reales. La integración con Cloudflare Pages se hará **después** de tener una primera compilación estática verificada.

## Convención de trabajo

Antes de cambiar alcance o agregar dependencias/servicios, contrastar la propuesta con `docs/BASE_PROPUESTA_V1.md` y registrar el acuerdo en `docs/DECISIONES.md`. Si una necesidad no está definida, preferir una implementación mínima o dejar un pendiente explícito; **no inventar datos oficiales de la banda**.
