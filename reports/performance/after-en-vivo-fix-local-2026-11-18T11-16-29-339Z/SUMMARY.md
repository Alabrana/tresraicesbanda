# Rendimiento — after-en-vivo-fix

- Fecha: 2026-11-18T11:17:27.880Z
- Entorno: build estático local / Lighthouse CLI
- Base: http://127.0.0.1:52000
- Lighthouse: 13.6.0
- Repeticiones por ruta/estrategia: 3

## Datos de laboratorio

| URL | Estrategia | Perf. | Acc. | Buenas prácticas | SEO | FCP | LCP | CLS | Speed Index | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| /en-vivo/ | mobile | 99 | 96 | 100 | 100 | 753 ms | 2.18 s | 0.000 | 753 ms | 0 ms |
| /en-vivo/ | desktop | 100 | 96 | 100 | 100 | 203 ms | 423 ms | 0.000 | 203 ms | 0 ms |

## Datos de campo CrUX

No hubo datos de campo CrUX válidos. INP no se informa ni se estima con datos de laboratorio.

## Oportunidades principales

### mobile — /en-vivo/

- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- Improve image delivery — Est savings of 25 KiB; 25 KB
- Network dependency tree

### desktop — /en-vivo/

- Improve image delivery — Est savings of 43 KiB; ahorro estimado 50 ms; 43 KB
- Network dependency tree
- Render-blocking requests

## Recursos de mayor transferencia

### mobile — /en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:52000/images/shows/tresRaicesZalsipuedes-w700.webp | Image | 74 KB | 74 KB |
| http://127.0.0.1:52000/images/shows/iceBar-w700.webp | Image | 67 KB | 67 KB |
| http://127.0.0.1:52000/images/shows/kutralKo1-w700.webp | Image | 59 KB | 58 KB |
| http://127.0.0.1:52000/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:52000/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |

### desktop — /en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:52000/images/shows/tresRaicesZalsipuedes-w480.webp | Image | 49 KB | 49 KB |
| http://127.0.0.1:52000/images/shows/iceBar-w480.webp | Image | 42 KB | 42 KB |
| http://127.0.0.1:52000/images/shows/kutralKo1-w480.webp | Image | 38 KB | 38 KB |
| http://127.0.0.1:52000/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:52000/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
