# Arquitectura y editor local — V1

## Diagrama lógico

```text
VS Code / computador del responsable
  ├─ Astro (páginas + colecciones locales)
  ├─ editor local (formularios, selector visual de imágenes)
  ├─ tarea Node local (lectura/escritura restringida al repositorio)
  └─ Markdown / JSON / imágenes optimizadas
             │
             └── git commit + git push (manual)
                       │
                       ▼
             GitHub (repositorio único)
                       │
                       ▼
             Cloudflare Pages (build Astro)
                       │
                       ▼
             HTML / CSS / JS / imágenes estáticas
```

## Producción

- Un solo proyecto Astro estático; no se requieren consultas a API de negocio o BD para renderizar páginas.
- Cloudflare Pages conecta a GitHub, compila `npm run build` y publica `dist`.
- El dominio propio se conectará cuando se configure el hosting.
- El editor local NO se expone como ruta web publicada ni forma parte de `dist`.

## Diseño del editor local

1. Leer archivos de contenido y escanear las carpetas autorizadas de `public/images`.
2. Presentar formularios independientes (página completa) por módulo.
3. Mantener una **copia editable en navegador** mientras se trabaja (memoria e IndexedDB opcional como continuidad local, nunca fuente editorial oficial).
4. Detectar diferencias reales contra lo inicialmente leído, y resumir altas/ediciones/bajas/reordenamientos.
5. Selector de imágenes mediante miniaturas de recursos existentes; el responsable copia imágenes a carpeta manualmente.
6. **Guardar todos**: validar completo, comprobar cambios externos, preparar nuevos archivos, escribir coordinadamente, intentar rollback si algo falla; no tocar archivos al cambiar de formulario.
7. Revisar cambios en Git y vista previa Astro local; commit/push manual para publicar.

## Seguridad y límites

- Servidor de escritura solo en `127.0.0.1` / localhost; nunca exponerlo a Internet.
- Resolver y normalizar rutas para impedir traversal (`../`) y escritura fuera de las carpetas permitidas.
- Validar tamaño, extensión y nombres de archivo; tratar Markdown/JSON como datos no confiables.
- No almacenar tokens ni secretos en archivos de frontend.
- No lanzar procesos de despliegue desde el editor por defecto.
- Git conserva historial técnico, pero no es una papelera dentro del panel.

## Detalles abiertos de implementación

- Framework concreto del editor (React/Vite es candidato, no mandato).
- Cómo aislar servicio local y controles de archivos del build Cloudflare.
- Protocolo de rollback multiarchivo (filesystem no da atomicidad multiarchivo por defecto).
- Regla exacta para eventos vencidos y JS deshabilitado; horario `America/Santiago`.
- Política de tamaños, formatos y optimización de imágenes.
