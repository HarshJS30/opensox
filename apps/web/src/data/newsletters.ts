import photo from '../assets/images/photu.jpg';
import user from '../assets/images/user_dp.webp';
import coverimg1 from '../assets/images/gsoc.png';
import coverimg2 from '../assets/images/opensox.jpg'
import { StaticImageData } from 'next/image';

export interface Post {
  date: string;
  heading: string;
  description: string;
  image: StaticImageData;
  coverimg:StaticImageData,
  slug: string;           
}

export const posts: Post[] = [
  {
    date: "2024-03-15",
    heading: "Getting Started with Next.js",
    description:
      "Next.js is a powerful React framework that enables server-side rendering and static site generation. It provides an excellent developer experience with features like file-based routing, API routes, and automatic code splitting.",
    image: photo,
    coverimg: coverimg1,
    slug: "getting-started-with-nextjs",
  },
  {
    date: "2024-03-10",
    heading: "Understanding TypeScript",
    description:
      "TypeScript adds static typing to JavaScript, helping catch errors early in development. It improves code quality, maintainability, and provides better IDE support with autocomplete and inline documentation.",
    image: user,
    coverimg: coverimg2,
    slug: "understanding-typescript",
  },

  {
    date: "2024-02-20",
    heading: "Mastering React Hooks",
    description:
      "React Hooks simplify state management and side effects in React applications. Learn how useState, useEffect, and custom hooks can make your components cleaner and more powerful.",
    image: photo,
    coverimg: coverimg1, 
    slug: "mastering-react-hooks",
  },
];
