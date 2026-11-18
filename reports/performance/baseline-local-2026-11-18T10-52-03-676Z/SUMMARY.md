# Rendimiento — baseline

- Fecha: 2026-11-18T11:26:02.068Z
- Entorno: build estático local / Lighthouse CLI
- Base: http://127.0.0.1:53041
- Lighthouse: 13.6.0
- Repeticiones por ruta/estrategia: 3

## Datos de laboratorio

| URL | Estrategia | Perf. | Acc. | Buenas prácticas | SEO | FCP | LCP | CLS | Speed Index | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| / | mobile | 92 | 96 | 100 | 100 | 754 ms | 3.38 s | 0.000 | 754 ms | 0 ms |
| / | desktop | 99 | 96 | 100 | 100 | 203 ms | 884 ms | 0.000 | 203 ms | 0 ms |
| /banda/ | mobile | 99 | 96 | 100 | 100 | 752 ms | 2.10 s | 0.000 | 752 ms | 0 ms |
| /banda/ | desktop | 100 | 96 | 100 | 100 | 203 ms | 203 ms | 0.000 | 203 ms | 0 ms |
| /en-vivo/ | mobile | 99 | 96 | 100 | 100 | 753 ms | 2.03 s | 0.000 | 753 ms | 0 ms |
| /en-vivo/ | desktop | 100 | 96 | 100 | 100 | 203 ms | 444 ms | 0.001 | 203 ms | 0 ms |
| /media/ | mobile | 100 | 96 | 100 | 100 | 752 ms | 1.73 s | 0.000 | 752 ms | 0 ms |
| /media/ | desktop | 100 | 96 | 100 | 100 | 203 ms | 405 ms | 0.000 | 203 ms | 0 ms |
| /news/ | mobile | 99 | 96 | 100 | 100 | 752 ms | 2.25 s | 0.000 | 752 ms | 0 ms |
| /news/ | desktop | 100 | 96 | 100 | 100 | 203 ms | 483 ms | 0.000 | 203 ms | 0 ms |
| /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/ | mobile | 99 | 96 | 100 | 100 | 752 ms | 2.25 s | 0.000 | 752 ms | 0 ms |
| /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/ | desktop | 100 | 96 | 100 | 100 | 201 ms | 481 ms | 0.000 | 201 ms | 0 ms |

## Datos de campo CrUX

No hubo datos de campo CrUX válidos. INP no se informa ni se estima con datos de laboratorio.

## Oportunidades principales

### mobile — /

- Improve image delivery — Est savings of 174 KiB; ahorro estimado 600 ms; 174 KB
- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- Use efficient cache lifetimes — Est savings of 9 KiB; 9 KB

### desktop — /

- Improve image delivery — Est savings of 663 KiB; ahorro estimado 100 ms; 663 KB
- Use efficient cache lifetimes — Est savings of 9 KiB; 9 KB
- LCP request discovery

### mobile — /banda/

- Improve image delivery — Est savings of 304 KiB; ahorro estimado 450 ms; 304 KB
- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- LCP request discovery

### desktop — /banda/

- Improve image delivery — Est savings of 307 KiB; 307 KB
- Network dependency tree
- Render-blocking requests

### mobile — /en-vivo/

- Improve image delivery — Est savings of 206 KiB; ahorro estimado 300 ms; 206 KB
- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- LCP request discovery

### desktop — /en-vivo/

- Improve image delivery — Est savings of 284 KiB; ahorro estimado 100 ms; 284 KB
- LCP request discovery
- Network dependency tree

### mobile — /media/

- Improve image delivery — Est savings of 56 KiB; ahorro estimado 450 ms; 56 KB
- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- Use efficient cache lifetimes — Est savings of 9 KiB; 9 KB

### desktop — /media/

- Improve image delivery — Est savings of 56 KiB; ahorro estimado 100 ms; 56 KB
- Use efficient cache lifetimes — Est savings of 9 KiB; 9 KB
- LCP request discovery

### mobile — /news/

- Improve image delivery — Est savings of 98 KiB; ahorro estimado 600 ms; 98 KB
- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- LCP request discovery

### desktop — /news/

- Improve image delivery — Est savings of 138 KiB; ahorro estimado 150 ms; 138 KB
- LCP request discovery
- Network dependency tree

### mobile — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

- Improve image delivery — Est savings of 95 KiB; ahorro estimado 450 ms; 95 KB
- Render-blocking requests — Est savings of 150 ms; ahorro estimado 150 ms
- LCP request discovery

### desktop — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

- Improve image delivery — Est savings of 121 KiB; ahorro estimado 100 ms; 121 KB
- LCP request discovery
- Network dependency tree

## Recursos de mayor transferencia

### mobile — /

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/band/tresRaices1.webp | Image | 171 KB | 171 KB |
| http://127.0.0.1:65209/images/news/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/shows/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |

### desktop — /

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/band/tresRaices1.webp | Image | 171 KB | 171 KB |
| http://127.0.0.1:65209/images/gallery/tresraicesVictor.webp | Image | 165 KB | 165 KB |
| http://127.0.0.1:65209/images/gallery/tresRaicesPato.webp | Image | 163 KB | 163 KB |
| http://127.0.0.1:65209/images/gallery/tresRaicesAlex.webp | Image | 156 KB | 156 KB |
| http://127.0.0.1:65209/images/news/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |

### mobile — /banda/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/band/tresRaices1.webp | Image | 171 KB | 171 KB |
| http://127.0.0.1:65209/images/band/tresRaicesVictor.webp | Image | 63 KB | 63 KB |
| http://127.0.0.1:65209/images/band/TresRaicesAlex.webp | Image | 58 KB | 58 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/images/band/TresRaicesPato.webp | Image | 44 KB | 44 KB |

### desktop — /banda/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/band/tresRaices1.webp | Image | 171 KB | 171 KB |
| http://127.0.0.1:65209/images/band/tresRaicesVictor.webp | Image | 63 KB | 63 KB |
| http://127.0.0.1:65209/images/band/TresRaicesAlex.webp | Image | 58 KB | 58 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/images/band/TresRaicesPato.webp | Image | 44 KB | 44 KB |

### mobile — /en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/shows/kutralKo1.webp | Image | 95 KB | 95 KB |
| http://127.0.0.1:65209/images/shows/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/shows/iceBar.webp | Image | 89 KB | 89 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |

### desktop — /en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/shows/kutralKo1.webp | Image | 95 KB | 95 KB |
| http://127.0.0.1:65209/images/shows/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/shows/iceBar.webp | Image | 89 KB | 89 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |

### mobile — /media/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:65209/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:65209/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| https://i.ytimg.com/vi/ajz26n_vkmg/hqdefault.jpg | Image | 12 KB | 12 KB |

### desktop — /media/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:65209/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:65209/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
| https://i.ytimg.com/vi/ajz26n_vkmg/hqdefault.jpg | Image | 12 KB | 12 KB |

### mobile — /news/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/news/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:65209/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:65209/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |

### desktop — /news/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/news/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:65209/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:65209/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |

### mobile — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/news/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:65209/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:65209/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |

### desktop — /news/desde-la-raiz-comienza-nuestra-historia-en-vivo/

| Recurso | Tipo | Transferencia | Tamaño |
|---|---|---:|---:|
| http://127.0.0.1:65209/images/news/tresRaicesZalsipuedes.webp | Image | 93 KB | 93 KB |
| http://127.0.0.1:65209/images/logos/logoprincipalHorizontal.webp | Image | 57 KB | 57 KB |
| http://127.0.0.1:65209/_astro/ibm-plex-sans-400-latin.BD78gn3f.woff2 | Font | 17 KB | 17 KB |
| http://127.0.0.1:65209/images/logos/logoredondo.webp | Other | 16 KB | 16 KB |
| http://127.0.0.1:65209/_astro/oswald-700-latin.B7j0eYJn.woff2 | Font | 13 KB | 12 KB |
