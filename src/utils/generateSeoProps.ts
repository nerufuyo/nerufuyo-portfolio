import { NextSeoProps } from 'next-seo';
import { OpenGraphArticle } from 'next-seo/lib/types';

type Props = {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
  images?: {
    url: string;
    width: number;
    height: number;
  }[];
  article?: OpenGraphArticle;
};

export default function generateSeoProps({
  title,
  description,
  url,
  type,
  images,
  article,
}: Props): NextSeoProps {
  return {
    title: title,
    description:
      description ??
      `Hello, I'm Listyo Adi, a developer based in Bandung, Indonesia.`,
    canonical: url
      ? `${process.env.NEXT_PUBLIC_SITE_URL}${url}`
      : process.env.NEXT_PUBLIC_SITE_URL,
    themeColor: '#000000',
    openGraph: {
      url: url
        ? `${process.env.NEXT_PUBLIC_SITE_URL}${url}`
        : process.env.NEXT_PUBLIC_SITE_URL,
      title: title ? `${title} | nerufuyo` : 'nerufuyo',
      type: type ?? 'website',
      description:
        description ??
        `Hello, I&apos;m Listyo Adi, a developer based in Bandung, Indonesia.`,
      images: images
        ? [
            ...images,
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/img/banner.webp`,
              width: 1200,
              height: 630,
            },
          ]
        : [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/img/banner.webp`,
              width: 1200,
              height: 630,
            },
          ],
      siteName: 'nerufuyo',
      article: article ?? undefined,
    },
    twitter: {
      cardType: 'summary_large_image',
      handle: '@nerufuyo',
      site: '@nerufuyo',
    },
    facebook: {
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string,
    },
    additionalMetaTags: [
      {
        name: 'twitter:title',
        content: title ? `${title} | nerufuyo` : 'nerufuyo',
      },
      {
        name: 'twitter:description',
        content:
          description ??
          `Hello, I&apos;m Listyo Adi, a developer based in Bandung, Indonesia.`,
      },
      {
        name: 'twitter:image',
        content: images
          ? images[0].url
          : `${process.env.NEXT_PUBLIC_SITE_URL}/img/banner.webp`,
      },
    ],
  };
}
