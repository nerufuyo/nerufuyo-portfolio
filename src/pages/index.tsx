import { NextSeo, NextSeoProps } from 'next-seo';
import Link from 'next/link';
import {
  SiDart,
  SiFlutter,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';

import BlogEntries from 'components/Post/Entries';

import { useSettings } from 'contexts/settings';
import capitalize from 'utils/capitalize';
import generateSeoProps from 'utils/generateSeoProps';

import { User } from 'types/about';
import { ghHeader } from 'types/api';
import { GithubSocial } from 'types/github';
import { Post } from 'types/post';

type Props = {
  user: User;
  blogs: Post[];
  works: Post[];
  socials: GithubSocial[];
};

const experiences: {
  dateFrom: string;
  dateTo: string;
  place: string;
  placeUrl?: string;
  description: string;
  role: string;
}[] = [
  {
    dateFrom: 'Aug 2021',
    dateTo: 'Jan 2022',
    place: 'Kampus Merdeka with Dicoding Batch 1',
    placeUrl: 'https://www.dicoding.com/',
    description: 'Study Independent',
    role: 'Fullstack Developer',
  },
  {
    dateFrom: 'Feb 2022',
    dateTo: 'Jul 2022',
    place: 'Kampus Merdeka with Dicoding Batch 2',
    placeUrl: 'https://www.dicoding.com/',
    description: 'Study Independent',
    role: 'Multiplatform Mobile Developer',
  },
  {
    dateFrom: 'Oct 2022',
    dateTo: 'Feb 2023',
    place: 'Legal Documentation and Information Network Bandung City',
    placeUrl: 'https://jdih.bandung.go.id/',
    description: 'Internship',
    role: 'Mobile Developer',
  },
  {
    dateFrom: 'Jul 2023',
    dateTo: 'Current',
    place: 'AA Solution PT. Bukharindo Makmur Sejahtera',
    placeUrl: 'https://aatech-solution.com/',
    description: 'Full Time',
    role: 'Mobile Developer',
  },
];

export default function Home({ user, blogs, works, socials }: Props) {
  const settings = useSettings();
  const seo: NextSeoProps = generateSeoProps({ title: 'Home' });
  return (
    <>
      <NextSeo {...seo} />
      <section id='profile'>
        <div className='w-full flex items-center justify-center flex-col relative mb-10 md:mb-14'>
          <img
            src='/img/banner.webp'
            alt='profileBanner'
            className='w-full h-32 md:h-64 object-cover object-c enter rounded-xl'
          />
          <div className='w-full h-32 md:h-64 bg-gradient-to-t from-black to-transparent absolute top-0 left-0' />
          <img
            src={user.avatar_url}
            alt={user.login}
            loading='lazy'
            className='w-20 border-4 md:border-6 border-black md:w-28 aspect-square object-cover rounded-full absolute -bottom-10 md:-bottom-14'
          />
        </div>
        <div className='w-full flex items-center justify-center flex-col'>
          <span className='text-xl font-bold'>{user.name}</span>
          <span className='text-zinc-500'>@{user.login}</span>
          <span className='text-zinc-300'>{user.bio}</span>
        </div>
      </section>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8'>
        <section
          id='about-me'
          className='md:text-base gap-8 w-full h-fit my-4 md:my-8 max-w-screen-sm mx-auto flex flex-col items-start justify-center'
        >
          <div className='w-full flex flex-col'>
            <h3>About me</h3>
            <hr />
            <p className='w-full text-start md:text-start'>
              Hello! 👋 <br />
              I&apos;m <strong>{user.name}</strong>, a developer based in{' '}
              {user.location}.
            </p>
            <p>
              Currently I&apos;m working on:{' '}
              {settings.workingOn.length ? (
                <Link
                  href={settings.workingOn[1]}
                  target='_blank'
                  className='font-bold'
                >
                  {settings.workingOn[0]}
                </Link>
              ) : (
                <span className='font-bold'>-</span>
              )}
            </p>
            <div className='max-w-screen-sm w-full my-4'>
              My preferred tech-stack includes: <br />
              <div className='flex w-full flex-wrap items-center gap-4'>
                <span className='inline-flex h-fit w-fit items-center gap-2 font-bold'>
                  <SiDart
                    size={18}
                    className='text-blue-400'
                  />
                  Dart
                </span>
                <span className='inline-flex h-fit w-fit items-center gap-2 font-bold'>
                  <SiFlutter
                    size={18}
                    className='text-zinc-50'
                  />
                  Flutter
                </span>
                <span className='inline-flex h-fit w-fit items-center gap-2 font-bold'>
                  <SiTypescript
                    size={18}
                    className='text-blue-500'
                  />
                  Typescript
                </span>
                <span className='inline-flex h-fit w-fit items-center gap-2 font-bold'>
                  <SiReact
                    size={18}
                    className='text-blue-500'
                  />
                  React
                </span>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <h3>Experiences</h3>
            <hr />
            <ul className='list-disc list-outside'>
              {experiences.map((experience, index) => (
                <li
                  key={`${experience.place}@${index}`}
                  className='list-disc list-inside text-base flex flex-col py-2'
                >
                  <div className='flex items-center gap-1 text-zinc-300'>
                    <span className='text-sm'>
                      {experience.dateFrom} - {experience.dateTo}
                    </span>
                    {' ・ '}
                    <span className='text-sm'>{experience.description}</span>
                  </div>
                  <span className='leading-tight text-start text-white'>
                    <span className='font-bold leading-tight'>
                      {experience.role}
                    </span>{' '}
                    at{' '}
                    <Link
                      href={experience.placeUrl ?? '#'}
                      target={experience.placeUrl ? '_blank' : undefined}
                    >
                      {experience.place}
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className='w-full flex flex-col items-center justify-center'>
            <span>You can find me on:</span>
            <div className='flex items-center justify-center gap-2'>
              {socials.map((social) => (
                <Link
                  key={social.provider}
                  href={social.url}
                  target='_blank'
                >
                  {capitalize(social.provider)}
                </Link>
              ))}
            </div>

            <span className='my-4'>
              Or send me an email at{' '}
              <a href='mailto:listyoap.work@gmail.com'>
                listyoap.work@gmail.com
              </a>
            </span>
          </div>
        </section>

        <section
          id='latest'
          className='w-full grid grid-cols-1 md:grid-cols-1 h-fit my-4 md:my-8 gap-x-16 gap-y-8'
        >
          <div className='w-full flex flex-col'>
            <h3>Latest projects</h3>
            <hr />
            <ul className='w-full flex items-center justify-center flex-col'>
              {works.length === 0 ? (
                <li>
                  <span className='text-center'>No projects to show</span>
                </li>
              ) : (
                <>
                  {works.map((blog, index) => (
                    <BlogEntries
                      key={blog.title}
                      data={blog}
                      index={index}
                    />
                  ))}
                </>
              )}
            </ul>
          </div>
          <div className='w-full flex flex-col'>
            <h3>New blog posts</h3>
            <hr />
            <ul className='w-full flex items-center justify-center flex-col'>
              {blogs.length === 0 ? (
                <li>
                  <span className='text-center'>No blog posts to show</span>
                </li>
              ) : (
                <>
                  {blogs.map((blog, index) => (
                    <BlogEntries
                      key={blog.title}
                      data={blog}
                      index={index}
                    />
                  ))}
                </>
              )}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const fetchUser = fetch('https://api.github.com/users/nerufuyo', {
    headers: ghHeader,
  });
  const fetchSocials = fetch(
    'https://api.github.com/users/nerufuyo/social_accounts',
    {
      headers: ghHeader,
    },
  );
  const fetchData = fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/settings`);
  const fetchBlogs = fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs?perPage=2`,
  );
  const fetchWorks = fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/works?perPage=2`,
  );

  // await all, then return as json
  const [user, socials, data, blogs, works] = await Promise.all([
    fetchUser,
    fetchSocials,
    fetchData,
    fetchBlogs,
    fetchWorks,
  ]).then((responses) =>
    Promise.all(responses.map((response) => response.json())),
  );

  return {
    props: {
      user: user as User,
      socials: socials as GithubSocial[],
      blogs: blogs.data as Post[],
      works: works.data as Post[],
    },
  };
}
