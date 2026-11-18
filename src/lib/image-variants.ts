interface ImageVariant {
  src: string;
  width: number;
}

interface ImageProfile {
  width: number;
  height: number;
  variants: ImageVariant[];
}

const profiles: Record<string, ImageProfile> = {
  '/images/logos/logoprincipalHorizontal.webp': {
    width: 1620,
    height: 971,
    variants: [
      { src: '/images/logos/logoprincipalHorizontal-w240.webp', width: 240 },
      { src: '/images/logos/logoprincipalHorizontal-w480.webp', width: 480 },
    ],
  },
  '/images/band/tresRaices1.webp': {
    width: 1535,
    height: 1024,
    variants: [
      { src: '/images/band/tresRaices1-w768.webp', width: 768 },
      { src: '/images/band/tresRaices1-w1280.webp', width: 1280 },
    ],
  },
  '/images/band/tresRaicesVictor.webp': {
    width: 702,
    height: 1064,
    variants: [{ src: '/images/band/tresRaicesVictor-w480.webp', width: 480 }],
  },
  '/images/band/TresRaicesAlex.webp': {
    width: 706,
    height: 1064,
    variants: [{ src: '/images/band/TresRaicesAlex-w480.webp', width: 480 }],
  },
  '/images/band/TresRaicesPato.webp': {
    width: 692,
    height: 1064,
    variants: [{ src: '/images/band/TresRaicesPato-w480.webp', width: 480 }],
  },
  '/images/shows/tresRaicesZalsipuedes.webp': {
    width: 878,
    height: 1116,
    variants: [
      { src: '/images/shows/tresRaicesZalsipuedes-w480.webp', width: 480 },
      { src: '/images/shows/tresRaicesZalsipuedes-w700.webp', width: 700 },
    ],
  },
  '/images/shows/kutralKo1.webp': {
    width: 1014,
    height: 1350,
    variants: [
      { src: '/images/shows/kutralKo1-w480.webp', width: 480 },
      { src: '/images/shows/kutralKo1-w700.webp', width: 700 },
    ],
  },
  '/images/shows/iceBar.webp': {
    width: 940,
    height: 1236,
    variants: [
      { src: '/images/shows/iceBar-w480.webp', width: 480 },
      { src: '/images/shows/iceBar-w700.webp', width: 700 },
    ],
  },
  '/images/news/tresRaicesZalsipuedes.webp': {
    width: 878,
    height: 1116,
    variants: [
      { src: '/images/news/tresRaicesZalsipuedes-w480.webp', width: 480 },
      { src: '/images/news/tresRaicesZalsipuedes-w700.webp', width: 700 },
    ],
  },
  '/images/gallery/tresraicesVictor.webp': {
    width: 1094,
    height: 1437,
    variants: [
      { src: '/images/gallery/tresraicesVictor-w480.webp', width: 480 },
      { src: '/images/gallery/tresraicesVictor-w720.webp', width: 720 },
    ],
  },
  '/images/gallery/tresRaicesPato.webp': {
    width: 1106,
    height: 1422,
    variants: [
      { src: '/images/gallery/tresRaicesPato-w480.webp', width: 480 },
      { src: '/images/gallery/tresRaicesPato-w720.webp', width: 720 },
    ],
  },
  '/images/gallery/tresRaicesAlex.webp': {
    width: 1090,
    height: 1443,
    variants: [
      { src: '/images/gallery/tresRaicesAlex-w480.webp', width: 480 },
      { src: '/images/gallery/tresRaicesAlex-w720.webp', width: 720 },
    ],
  },
};

export function getImageProfile(src: string) {
  const profile = profiles[src];
  if (!profile) return null;
  return {
    width: profile.width,
    height: profile.height,
    srcset: [...profile.variants, { src, width: profile.width }]
      .sort((left, right) => left.width - right.width)
      .map((variant) => `${variant.src} ${variant.width}w`)
      .join(', '),
  };
}
