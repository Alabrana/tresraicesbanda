# Rendimiento — after

- Fecha: 2026-11-18T11:15:04.190Z
- Entorno: build estático local / Lighthouse CLI
- Base: http://127.0.0.1:51162
- Lighthouse: 13.6.0
- Repeticiones por ruta/estrategia: 3

## Datos de laboratorio

| URL | Estrategia | Perf. | Acc. | Buenas prácticas | SEO | FCP | LCP | CLS | Speed Index | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| / | mobile | 100 | 96 | 100 | 100 | 753 ms | 1.88 s | 0.000 | 753 ms | 0 ms |
| / | desktop | 100 | 96 | 100 | 100 | 204 ms | 644 ms | 0.000 | 204 ms | 0 ms |
| /banda/ | mobile | 100 | 96 | 100 | 100 | 752 ms | 1.88 s | 0.000 | 752 ms | 0 ms |
| /banda/ | desktop | 100 | 96 | 100 | 100 | 203 ms | 203 ms | 0.000 | 203 ms | 0 ms |
| /en-vivo/ | mobile | 99 | 96 | 100 | 100 | 753 ms | 2.18 s | 0.000 | 753 ms | 0 ms |
| /en-vivo/ | desktop | 100 | 96 | 100 | 100 | 202 ms | 422 ms | 0.000 | 202 ms | 0 ms |
| /media/ | mobile | 100 | 96 | 100 | 100 | 752 ms | 1.58 s | 0.000 | 752 ms | 0 ms |
| /media/ | desktop | 100 | 96 | 100 | 100 | 202 ms | 468 ms | 0.000 | 202 ms | 0 ms |
| /news/ | mobile | 100 | 96 | 100 | 100 | 752 ms | 1.80 s | 0.000 | 752 ms | 0 ms |
| /news/ | desktop | 100 | 96 | 100 | 100 | 202 ms | 402 ms | 0.000 | 202 ms | 0 ms |
| /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/ | mobile | 100 | 96 | 100 | 100 | 753 ms | 1.80 s | 0.000 | 753 ms | 0 ms |
| /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/ | desktop | 100 | 96 | 100 | 100 | 202 ms | 402 ms | 0.000 | 202 ms | 0 ms |

## Datos de campo CrUX

No hubo datos de campo CrUX válidos. INP no se informa ni se estima con datos de laboratorio.

## Oportunidades principales

### mobile — /

- Improve image delivery — Est savings of 12 KiB; ahorro estimado 150 ms; 12 KB
- Render-blocking requests — Est savings of 140 ms; ahorro estimado 150 ms
- Use efficient cache lifetimes — Est savings of 9 KiB; 9 KB

### desktop — /

- Improve image delivery — Est savings of 150 KiB; 150 KB
- Use efficient cache lifetimes — Est savings of 9 KiB; 9 KB
- Network dependency tree

### mobile — /banda/

- Render-blocking requests — Est savings of 140 ms; ahorro estimado 150 ms
- Improve image delivery — Est savings of 109 KiB; 109 KB
- Network dependency tree

### desktop — /banda/

- Improve image delivery — Est savings of 112 KiB; 112 KB
- Network dependency tree
- Render-blocking requests

### mobile — /en-vivo/

- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- Improve image delivery — Est savings of 25 KiB; 25 KB
- LCP request discovery

### desktop — /en-vivo/

- Improve image delivery — Est savings of 43 KiB; ahorro estimado 50 ms; 43 KB
- LCP request discovery
- Network dependency tree

### mobile — /media/

- Use efficient cache lifetimes — Est savings of 9 KiB; ahorro estimado 150 ms; 9 KB
- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- Network dependency tree

### desktop — /media/

- Use efficient cache lifetimes — Est savings of 9 KiB; 9 KB
- Network dependency tree
- Render-blocking requests

### mobile — /news/

- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- Network dependency tree

### desktop — /news/

- Improve image delivery — Est savings of 30 KiB; ahorro estimado 100 ms; 30 KB
- Network dependency tree
- Render-blocking requests

### mobile — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- Network dependency tree

### desktop — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

- Network dependency tree
- Render-blocking requests

## Recursos de mayor transferencia

### mobile — /

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:50714/images/shows/tresRaicesZalsipuedes-w700.webp | Image | 74 KB | 74 KB |
| http://127.0.0.1:50714/images/news/tresRaicesZalsipuedes-w700.webp | Image | 74 KB | 74 KB |
| http://127.0.0.1:50714/images/band/tresRaices1-w768.webp | Image | 46 KB | 46 KB |
| http://127.0.0.1:50714/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:50714/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |

### desktop — /

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:50714/images/band/tresRaices1.webp | Image | 171 KB | 171 KB |
| http://127.0.0.1:50714/images/shows/tresRaicesZalsipuedes-w480.webp | Image | 49 KB | 49 KB |
| http://127.0.0.1:50714/images/news/tresRaicesZalsipuedes-w480.webp | Image | 49 KB | 49 KB |
| http://127.0.0.1:50714/images/band/tresRaices1-w768.webp | Image | 46 KB | 46 KB |
| http://127.0.0.1:50714/images/gallery/tresraicesVictor-w480.webp | Image | 40 KB | 40 KB |

### mobile — /banda/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:50714/images/band/tresRaicesVictor.webp | Image | 63 KB | 63 KB |
| http://127.0.0.1:50714/images/band/TresRaicesAlex.webp | Image | 58 KB | 58 KB |
| http://127.0.0.1:50714/images/band/tresRaices1-w768.webp | Image | 46 KB | 46 KB |
| http://127.0.0.1:50714/images/band/TresRaicesPato.webp | Image | 44 KB | 44 KB |
| http://127.0.0.1:50714/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |

### desktop — /banda/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:50714/images/band/tresRaices1-w1280.webp | Image | 87 KB | 87 KB |
| http://127.0.0.1:50714/images/band/tresRaicesVictor-w480.webp | Image | 40 KB | 40 KB |
| http://127.0.0.1:50714/images/band/TresRaicesAlex-w480.webp | Image | 36 KB | 36 KB |
| http://127.0.0.1:50714/images/band/TresRaicesPato-w480.webp | Image | 28 KB | 28 KB |
| http://127.0.0.1:50714/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |

### mobile — /en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/images/shows/tresRaicesZalsipuedes-w700.webp | Image | 74 KB | 74 KB |
| http://127.0.0.1:51162/images/shows/iceBar-w700.webp | Image | 67 KB | 67 KB |
| http://127.0.0.1:51162/images/shows/kutralKo1-w700.webp | Image | 59 KB | 58 KB |
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |

### desktop — /en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/images/shows/tresRaicesZalsipuedes-w480.webp | Image | 49 KB | 49 KB |
| http://127.0.0.1:51162/images/shows/iceBar-w480.webp | Image | 42 KB | 42 KB |
| http://127.0.0.1:51162/images/shows/kutralKo1-w480.webp | Image | 38 KB | 38 KB |
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |

### mobile — /media/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:51162/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| https://i.ytimg.com/vi/ajz26n_vkmg/hqdefault.jpg | Image | 12 KB | 12 KB |
| http://127.0.0.1:51162/_astro/BaseLayout.BQtS1r_J.css | Stylesheet | 8 KB | 41 KB |

### desktop — /media/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:51162/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| https://i.ytimg.com/vi/ajz26n_vkmg/hqdefault.jpg | Image | 12 KB | 12 KB |
| http://127.0.0.1:51162/_astro/BaseLayout.BQtS1r_J.css | Stylesheet | 8 KB | 41 KB |

### mobile — /news/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/images/news/tresRaicesZalsipuedes-w700.webp | Image | 74 KB | 74 KB |
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:51162/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| http://127.0.0.1:51162/_astro/BaseLayout.BQtS1r_J.css | Stylesheet | 8 KB | 41 KB |

### desktop — /news/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/images/news/tresRaicesZalsipuedes-w480.webp | Image | 49 KB | 49 KB |
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:51162/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| http://127.0.0.1:51162/_astro/BaseLayout.BQtS1r_J.css | Stylesheet | 8 KB | 41 KB |

### mobile — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/images/news/tresRaicesZalsipuedes-w700.webp | Image | 74 KB | 74 KB |
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:51162/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| http://127.0.0.1:51162/_astro/BaseLayout.BQtS1r_J.css | Stylesheet | 8 KB | 41 KB |

### desktop — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:51162/images/news/tresRaicesZalsipuedes-w480.webp | Image | 49 KB | 49 KB |
| http://127.0.0.1:51162/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:51162/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:51162/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| http://127.0.0.1:51162/_astro/BaseLayout.BQtS1r_J.css | Stylesheet | 8 KB | 41 KB |
