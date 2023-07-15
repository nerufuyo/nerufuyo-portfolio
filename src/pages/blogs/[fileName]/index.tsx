import Giscus from '@giscus/react';
import matter from 'gray-matter';
import { GetStaticPropsContext } from 'next';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import Link from 'next/link';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';

import MarkdownRender from 'components/MarkdownRender';
import PostHeader from 'components/Post/Header';

import calculateReadingSpeed from 'utils/calculateReadingSpeed';
import formatDate from 'utils/formatDate';
import octokit from 'utils/octokit';

import { GithubFile } from 'types/github';
import { Post, PostDetails } from 'types/post';

type Props = {
  blog: PostDetails;
  toc: {
    level: number;
    text: string;
    slug: string;
  }[];
  nextPost?: Post;
  prevPost?: Post;
};

export default function PageBlog({ blog, toc, nextPost, prevPost }: Props) {
  return (
    <>
      <NextSeo
        title={blog.metadata.title}
        description={blog.metadata.summary}
        openGraph={{
          type: 'article',
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL}${blog.metadata.thumbnail}`,
              width: 800,
              height: 600,
            },
          ],
          article: {
            tags: blog.metadata.tags,
            publishedTime: new Date(blog.metadata.createdAt).toISOString(),
            modifiedTime: new Date(blog.metadata.updatedAt).toISOString(),
            authors: ['Arief Rachmawan'],
          },
        }}
        additionalMetaTags={[
          {
            name: 'twitter:title',
            content: `${blog.metadata.title} | mbahArip`,
          },
          {
            name: 'twitter:description',
            content: blog.metadata.summary,
          },
          {
            name: 'twitter:image',
            content: `${process.env.NEXT_PUBLIC_SITE_URL}${blog.metadata.thumbnail}`,
          },
        ]}
      />
      <ArticleJsonLd
        type='BlogPosting'
        url={`${process.env.NEXT_PUBLIC_SITE_URL}${blog.metadata.path}`}
        title={blog.metadata.title}
        images={[
          `${process.env.NEXT_PUBLIC_SITE_URL}${blog.metadata.thumbnail}`,
        ]}
        datePublished={new Date(blog.metadata.createdAt).toISOString()}
        dateModified={new Date(blog.metadata.updatedAt).toISOString()}
        authorName={['Arief Rachmawan']}
        description={blog.metadata.summary}
      />
      <article>
        <PostHeader post={blog} />

        <hr />

        <div className='w-full grid grid-cols-1 md:grid-cols-5 gap-y-4'>
          <section
            id='details'
            className='flex flex-col gap-2 border-b-2 pb-4 md:pb-0 md:border-b-0 md:border-r-2 border-zinc-700'
          >
            <div className='grid grid-cols-2 md:grid-cols-1 gap-2'>
              <div className='flex flex-col gap-1'>
                <h6>Tags</h6>
                {blog.metadata.tags.length === 0 ? (
                  <span className='text-sm'>No tags</span>
                ) : (
                  <div className='flex flex-wrap gap-1 items-center'>
                    {blog.metadata.tags.map((tag) => (
                      <Link
                        href={`/blogs?q=${tag}`}
                        key={tag}
                        className='opacity-80 hover:opacity-100 transition transition-smooth'
                      >
                        <span className='badge text-sm'>{tag}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-1'>
                <h6>Read time</h6>
                <span className='text-sm'>
                  {calculateReadingSpeed(blog.content)}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-1 gap-2'>
              <div className='flex flex-col gap-1'>
                <h6>Created at</h6>
                <span className='text-sm'>
                  {formatDate(blog.metadata.createdAt)}
                </span>
              </div>
              <div className='flex flex-col gap-1'>
                <h6>Last updated at</h6>
                <span className='text-sm'>
                  {formatDate(blog.metadata.updatedAt)}
                </span>
              </div>
            </div>
          </section>
          <section
            id='content'
            className='md:col-span-4 md:px-4'
          >
            <MarkdownRender>{blog.content}</MarkdownRender>
          </section>
        </div>

        <section
          id='comments'
          className='w-full my-4'
          key={blog.metadata.title}
        >
          <Giscus
            repo='mbaharip/mbaharip-blog-posts'
            repoId='R_kgDOJ5ghvQ'
            category='Comments'
            categoryId='DIC_kwDOJ5ghvc4CX03d'
            mapping='pathname'
            strict='0'
            reactionsEnabled='0'
            emitMetadata='0'
            inputPosition='bottom'
            theme='noborder_dark'
            lang='en'
            loading='lazy'
          />
        </section>

        <hr />

        <section
          id='post-footer'
          className='w-full grid grid-cols-2'
        >
          {prevPost ? (
            <Link
              href={prevPost.path ?? '#'}
              className='flex flex-col gap-1 items-start group'
            >
              <span className='text-sm text-zinc-500 group-hover:text-zinc-500 transition transition-smooth'>
                Previous post
              </span>
              <div className='w-fit flex items-center gap-1 text-zinc-300 group-hover:text-white transition transition-smooth relative'>
                <VscChevronLeft className='relative right-0 group-hover:right-1 transition-all transition-smooth' />
                <h5>{prevPost.title}</h5>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              href={nextPost.path ?? '#'}
              className='flex flex-col gap-1 items-end group'
            >
              <span className='text-sm text-zinc-500 group-hover:text-zinc-500 transition transition-smooth'>
                Next post
              </span>
              <div className='w-fit flex items-center gap-1 text-zinc-300 group-hover:text-white transition transition-smooth relative'>
                <h5>{nextPost.title}</h5>
                <VscChevronRight className='relative left-0 group-hover:left-1 transition-all transition-smooth' />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </section>
      </article>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { fileName } = context.params || {};
  if (!fileName) return { notFound: true };

  const { data } = (await octokit.rest.repos.getContent({
    owner: 'mbaharip',
    path: `blogs/${fileName}.md`,
    repo: 'mbaharip-blog-posts',
  })) as Partial<{ data: GithubFile }>;

  if (!data) return { notFound: true };
  if (data.type !== 'file') return { notFound: true };

  const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');
  const markdownData = matter(rawContent);
  let markdownContent = markdownData.content;

  if (markdownContent.startsWith('\n')) {
    markdownContent = markdownContent.slice(1);
  }

  markdownContent = markdownContent.replace(
    /!\[\[([^\]]+)\]\]/g,
    '![$1](/api/attachments/$1)',
  );

  markdownContent = markdownContent.replace(
    /\[\[([^\]]+)\]\]/g,
    '[$1](/api/attachments/$1)',
  );

  // Get all h1 - h3 for table of contents from markdownContent
  const headings = markdownContent.match(/#{1,3}\s(.+)/g) ?? [];
  const toc = headings.map((heading) => {
    const level = heading.match(/#/g)?.length ?? 0;
    const text = heading.replace(/#+\s/g, '');
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return {
      level,
      text,
      slug,
    };
  });

  let tags = [];
  if (Array.isArray(markdownData.data.tags) && markdownData.data.tags[0]) {
    tags = markdownData.data.tags;
  }

  const summary = markdownContent
    .replace(/!\[.*?\]\((.*?)\)/g, '')
    .replace(/\[(.*?)\]/g, '')
    .replace(/\[\[([^\]]+)\]\]/g, '')
    .replace(/!\[\[([^\]]+)\]\]/g, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/#+\s/g, '')
    .split('\n')
    .slice(0, 3)
    .join(' ')
    .trim();

  let thumbnail = markdownData.data.thumbnail ?? '/img/no-image.webp';
  if (/!\[\[([^\]]+)\]\]/g.test(thumbnail)) {
    thumbnail = thumbnail.match(/!\[\[([^\]]+)\]\]/)?.[1] ?? 'logo.webp';
    thumbnail = `/api/attachments/banner/${thumbnail}`;
  } else {
    thumbnail = thumbnail.replace(/"/g, '').replace(/\\/g, '');
  }

  const postData: PostDetails = {
    content: markdownContent,
    metadata: {
      title:
        markdownData.data.title ?? data.name.replace('.md', '') ?? 'Untitled',
      summary,
      thumbnail: thumbnail ?? null,
      thumbnail_x: markdownData.data.thumbnail_x ?? 0.5,
      thumbnail_y: markdownData.data.thumbnail_y ?? 0.5,
      tags,
      createdAt: markdownData.data.created ?? new Date().toISOString(),
      updatedAt: markdownData.data.updated ?? new Date().toISOString(),
    },
  };

  // Get next and previous post
  const { data: blogsIndex } = (await octokit.rest.repos.getContent({
    owner: 'mbaharip',
    path: '@db/blogsIndex.json',
    repo: 'mbaharip-blog-posts',
  })) as Partial<{ data: GithubFile }>;

  if (!blogsIndex) return { notFound: true };

  const rawBlogsIndex = Buffer.from(blogsIndex.content, 'base64').toString(
    'utf-8',
  );
  const blogs = (JSON.parse(rawBlogsIndex) as Post[]).reverse();

  const currentPostIndex = blogs.findIndex(
    (blog) => blog.path === `/blogs/${fileName}`,
  );

  const nextPost = blogs[currentPostIndex + 1] ?? null;
  const prevPost = blogs[currentPostIndex - 1] ?? null;

  return {
    props: {
      blog: postData,
      toc,
      nextPost,
      prevPost,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const { data } = (await octokit.rest.repos.getContent({
    owner: 'mbaharip',
    path: '@db/blogsIndex.json',
    repo: 'mbaharip-blog-posts',
  })) as Partial<{ data: GithubFile }>;

  if (!data) return { notFound: true };

  const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');
  const blogs = JSON.parse(rawContent) as Post[];

  const paths = blogs.map((blog) => ({
    params: { fileName: blog.path?.split('/').pop() },
  }));

  return {
    paths: paths ?? [],
    fallback: 'blocking',
  };
}
