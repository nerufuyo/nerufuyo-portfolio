import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

import { PostDetails } from 'types/post';

type Props = {
  post: PostDetails;
};

export default function PostHeader({ post }: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(() => {
    const src = post.metadata.thumbnail ?? '/img/no-image.webp';
    if (src === '/img/no-image.webp') return src;

    let imageSource = src;

    let type: 'attachments' | 'local' | 'url' = 'url';
    if (src.startsWith('@attachments')) {
      type = 'attachments';
      imageSource = `/api/sharp/${src}`;
    } else if (src.startsWith('/') || src.startsWith('@local')) {
      type = 'local';
      if (src.startsWith('@local')) {
        imageSource = `/api/sharp/${src}`;
      } else {
        imageSource = `/api/sharp/@local${src}`;
      }
    } else if (src.startsWith('http') || src.startsWith('@url')) {
      type = 'url';
      if (src.startsWith('@url')) {
        if (src.split('://').length === 1) {
          imageSource = `/api/sharp/@url/${src.split('://')[1]}`;
        } else {
          imageSource = `/api/sharp/${src}`;
        }
      } else {
        imageSource = `/api/sharp/@url/${src.split('://')[1]}`;
      }
    } else {
      throw new Error(
        'Invalid image source. Must be either @attachments, (@local or /), or (@url or http(s)://)',
      );
    }

    const optimizedUrl = new URL(imageSource, process.env.NEXT_PUBLIC_SITE_URL);
    optimizedUrl.searchParams.append('width', isMobile ? '480' : '960');

    return optimizedUrl.toString();
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);

    // Add timeout to prevent infinite loading and stop useEffect
    const timeout = setTimeout(() => {
      setImgSrc('/img/timeout.webp');
      setIsLoading(false);
      return;
    }, 5000);

    fetch(imgSrc)
      .then((res) => {
        if (!res.ok) throw new Error('error');

        return res.blob();
      })
      .then((blob) => {
        // convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          setImgSrc(base64data as string);
        };
      })
      .catch(() => {
        console.log('error');
        setImgSrc('/img/no-image.webp');
      })
      .finally(() => {
        setIsLoading(false);
        clearTimeout(timeout);
      });

    return () => {
      clearTimeout(timeout);
    };
  }, [imgSrc]);

  useEffect(() => {
    const src = post.metadata.thumbnail ?? '/img/no-image.webp';
    if (src === '/img/no-image.webp') return;

    let imageSource = src;

    let type: 'attachments' | 'local' | 'url' = 'url';
    if (src.startsWith('@attachments')) {
      type = 'attachments';
      imageSource = `/api/sharp/${src}`;
    } else if (src.startsWith('/') || src.startsWith('@local')) {
      type = 'local';
      if (src.startsWith('@local')) {
        imageSource = `/api/sharp/${src}`;
      } else {
        imageSource = `/api/sharp/@local${src}`;
      }
    } else if (src.startsWith('http') || src.startsWith('@url')) {
      type = 'url';
      if (src.startsWith('@url')) {
        if (src.split('://').length === 1) {
          imageSource = `/api/sharp/@url/${src.split('://')[1]}`;
        } else {
          imageSource = `/api/sharp/${src}`;
        }
      } else {
        imageSource = `/api/sharp/@url/${src.split('://')[1]}`;
      }
    } else {
      throw new Error(
        'Invalid image source. Must be either @attachments, (@local or /), or (@url or http(s)://)',
      );
    }

    const optimizedUrl = new URL(imageSource, process.env.NEXT_PUBLIC_SITE_URL);
    optimizedUrl.searchParams.append('width', isMobile ? '480' : '960');

    setImgSrc(optimizedUrl.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <section
      id='post-header'
      className='w-full h-32 md:h-48 mb-8 flex mx-auto relative items-end'
    >
      {isLoading ? (
        <div className='w-full max-w-screen-lg h-32 md:h-48 grid place-items-center absolute top-0 left-0'>
          <ReactLoading
            type='spin'
            width={16}
            height={16}
          />
        </div>
      ) : (
        <>
          <img
            src={imgSrc ?? '/img/no-image.webp'}
            alt={post.metadata.title}
            className='w-full max-w-screen-lg mx-auto h-32 md:h-48 object-cover transition-all transition-smooth rounded-lg opacity-75 absolute top-0 left-0'
            style={{
              objectPosition: `calc(${post.metadata.thumbnail_x} * 100%) calc(${post.metadata.thumbnail_y} * 100%)`,
            }}
          />
          <div className='w-full max-w-screen-lg mx-auto h-32 md:h-48 bg-gradient-to-t from-black to-transparent absolute top-0 left-0 transition-all transition-smooth' />
        </>
      )}
      <div className='relative px-2 z-10'>
        <h1 className='text-white'>{post.metadata.title}</h1>
      </div>
    </section>
  );
}
