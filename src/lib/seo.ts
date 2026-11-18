export interface SocialImageMetadata {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  type?: `image/${string}`;
}

export interface PageSeoMetadata {
  title: string;
  description: string;
}

export const siteSeo = {
  name: 'Tres Raíces',
  url: 'https://tresraicesbanda.cl/',
  lang: 'es-CL',
  ogLocale: 'es_CL',
  themeColor: '#101213',
  musicGroupId: 'https://tresraicesbanda.cl/#musicgroup',
  defaultImage: {
    src: '/images/seo/tres-raices-og.webp',
    alt: 'Tres Raíces en vivo con el logo oficial de la banda',
    width: 1200,
    height: 630,
    type: 'image/webp',
  } satisfies SocialImageMetadata,
} as const;

export const pageSeo = {
  home: {
    title: 'Tres Raíces | Banda de rock de Talcahuano',
    description: 'Sitio oficial de Tres Raíces, banda de rock chileno oriunda de Talcahuano. Conoce nuestra música, historia, videos, noticias y próximas presentaciones en vivo.',
  },
  band: {
    title: 'La Banda | Tres Raíces, rock desde Talcahuano',
    description: 'Conoce la historia de Tres Raíces, banda de rock de Talcahuano, y a sus integrantes: Víctor en bajo y voz, Alexis en guitarra y Patricio en batería.',
  },
  live: {
    title: 'En Vivo | Presentaciones de Tres Raíces',
    description: 'Revisa las próximas tocatas de Tres Raíces, sus fechas, lugares y entradas disponibles. Conoce también nuestras presentaciones anteriores.',
  },
  media: {
    title: 'Música y Videos | Tres Raíces',
    description: 'Mira videos y registros en vivo de Tres Raíces, banda de rock oriunda de Talcahuano. Encuentra nuestro canal oficial de YouTube y plataformas musicales.',
  },
  news: {
    title: 'News | Noticias de Tres Raíces',
    description: 'Noticias y novedades de Tres Raíces: nuevas canciones, presentaciones, videos y experiencias de una banda de rock nacida en Talcahuano.',
  },
  gallery: {
    title: 'Galería | Fotos de Tres Raíces',
    description: 'Fotografías de Tres Raíces en ensayos, escenarios y presentaciones en vivo. Imágenes de nuestra historia y el rock que hacemos desde Talcahuano.',
  },
  network: {
    title: 'Network | Bandas Amigas de Tres Raíces',
    description: 'Conoce las bandas amigas y los vínculos musicales de Tres Raíces, compartiendo escenarios y rock desde Talcahuano y la escena chilena.',
  },
} satisfies Record<string, PageSeoMetadata>;

export const toAbsoluteUrl = (path: string) => new URL(path, siteSeo.url).toString();

export const getImageMimeType = (path: string): `image/${string}` | undefined => {
  const extension = path.split(/[?#]/, 1)[0]?.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, `image/${string}`> = {
    avif: 'image/avif',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };
  return extension ? mimeTypes[extension] : undefined;
};

export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
